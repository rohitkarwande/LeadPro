import { NextResponse } from 'next/server';
import { processLead } from '@/lib/leadAllocation';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    // Basic validation
    if (!body.name || !body.phoneNumber || !body.city || !body.serviceId) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const result = await processLead({
      name: body.name,
      phoneNumber: body.phoneNumber,
      city: body.city,
      description: body.description,
      serviceId: parseInt(body.serviceId)
    });
    
    return NextResponse.json(result, { status: 201 });
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : 'Unknown error';
    if (msg === 'DUPLICATE_LEAD') {
      return NextResponse.json({ error: 'Duplicate lead: You have already submitted a request for this service with the same phone number.' }, { status: 409 });
    }
    if (msg === 'NOT_ENOUGH_PROVIDERS') {
      return NextResponse.json({ error: 'Not enough providers have available quota for this service.' }, { status: 503 });
    }
    
    console.error('Error creating lead:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
