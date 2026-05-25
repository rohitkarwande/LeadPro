import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET() {
  try {
    const providers = await prisma.provider.findMany({
      include: {
        leads: {
          include: {
            lead: true
          },
          orderBy: {
            createdAt: 'desc'
          },
          take: 5
        }
      },
      orderBy: {
        id: 'asc'
      }
    });

    const formatted = providers.map(p => ({
      id: p.id,
      name: p.name,
      quota: p.monthly_quota,
      usage: p.current_month_usage,
      remaining: p.monthly_quota - p.current_month_usage,
      leads: p.leads.map(l => ({
        id: l.lead.id,
        name: l.lead.name,
        serviceId: l.lead.serviceId,
        assignedAt: l.createdAt
      }))
    }));

    return NextResponse.json(formatted);
  } catch (error) {
    console.error('Error fetching dashboard:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
