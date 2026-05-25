import prisma from './prisma';

const MANDATORY_RULES = {
  1: [1], // Service 1 -> Provider 1
  2: [5], // Service 2 -> Provider 5
  3: [1, 4] // Service 3 -> Provider 1, 4
};

const FAIR_POOLS = {
  1: [2, 3, 4],
  2: [6, 7, 8],
  3: [2, 3, 5, 6, 7, 8]
};

export async function processLead(data: { name: string, phoneNumber: string, city: string, description?: string, serviceId: number }) {
  const { name, phoneNumber, city, description, serviceId } = data;
  
  return await prisma.$transaction(async (tx) => {
    // Lock providers to serialize transactions (concurrency safety)
    await tx.$executeRaw`SELECT id FROM "Provider" FOR UPDATE`;
    
    // Check for duplicate lead
    const existing = await tx.lead.findUnique({
      where: {
        phoneNumber_serviceId: {
          phoneNumber,
          serviceId
        }
      }
    });
    if (existing) {
      throw new Error('DUPLICATE_LEAD');
    }

    const providers = await tx.provider.findMany();
    const providerMap = new Map(providers.map(p => [p.id, p]));
    
    const mandatoryIds = MANDATORY_RULES[serviceId as keyof typeof MANDATORY_RULES] || [];
    const poolIds = FAIR_POOLS[serviceId as keyof typeof FAIR_POOLS] || [];
    
    const selectedProviderIds = new Set<number>();
    
    // 1. Assign mandatory providers (if quota available)
    for (const id of mandatoryIds) {
      const p = providerMap.get(id);
      if (p && p.current_month_usage < p.monthly_quota) {
        selectedProviderIds.add(id);
      }
    }
    
    // 2. Assign fair pool providers
    const needed = 3 - selectedProviderIds.size;
    if (needed > 0) {
      const eligiblePoolProviders = poolIds
        .map(id => providerMap.get(id)!)
        .filter(p => p && p.current_month_usage < p.monthly_quota && !selectedProviderIds.has(p.id));
        
      // Sort for round-robin: nulls (never assigned) first, then by last_assigned_at asc
      eligiblePoolProviders.sort((a, b) => {
        if (!a.last_assigned_at && !b.last_assigned_at) return a.id - b.id;
        if (!a.last_assigned_at) return -1;
        if (!b.last_assigned_at) return 1;
        return a.last_assigned_at.getTime() - b.last_assigned_at.getTime();
      });
      
      for (let i = 0; i < Math.min(needed, eligiblePoolProviders.length); i++) {
        selectedProviderIds.add(eligiblePoolProviders[i].id);
      }
    }
    
    if (selectedProviderIds.size !== 3) {
      throw new Error('NOT_ENOUGH_PROVIDERS');
    }

    // 3. Create Lead
    const lead = await tx.lead.create({
      data: {
        name,
        phoneNumber,
        city,
        description,
        serviceId
      }
    });
    
    // 4. Create Assignments and update providers
    const now = new Date();
    for (const pid of selectedProviderIds) {
      await tx.leadAssignment.create({
        data: {
          leadId: lead.id,
          providerId: pid
        }
      });
      
      await tx.provider.update({
        where: { id: pid },
        data: {
          current_month_usage: { increment: 1 },
          last_assigned_at: now
        }
      });
    }
    
    return { lead, assignedProviders: Array.from(selectedProviderIds) };
  });
}
