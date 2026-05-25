import { NextResponse } from 'next/server';
import { processLead } from '@/lib/leadAllocation';

export async function POST(request: Request) {
  try {
    let count = 10;
    try {
      const body = await request.json();
      if (body.count) count = body.count;
    } catch { } // ignore empty body parsing error

    const basePhone = Math.floor(Math.random() * 10000000).toString();

    // Fire `count` requests simultaneously without awaiting them inside the loop
    const promises = Array.from({ length: count }).map((_, i) => {
      return processLead({
        name: `Concurrent User ${i}`,
        phoneNumber: `${basePhone}${i}`, // ensure unique phone to bypass duplication rule for this test
        city: 'Test City',
        serviceId: 1 // Test on Service 1
      }).catch((e: unknown) => ({ error: e instanceof Error ? e.message : 'Unknown error' }));
    });

    const results = await Promise.all(promises);

    const successCount = results.filter(r => r && typeof r === 'object' && !('error' in r)).length;
    const errorCount = count - successCount;

    return NextResponse.json({ 
      status: `Generated ${count} leads`,
      successCount,
      errorCount,
      details: results
    });
  } catch (error) {
    console.error('Concurrency Test Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
