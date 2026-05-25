import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function POST(request: Request) {
  try {
    const { idempotencyKey } = await request.json();
    
    if (!idempotencyKey) {
      return NextResponse.json({ error: 'Missing idempotencyKey' }, { status: 400 });
    }

    return await prisma.$transaction(async (tx) => {
      // 1. Try to create the idempotency record
      try {
        await tx.webhookIdempotency.create({
          data: { id: idempotencyKey }
        });
      } catch (e: unknown) {
        // If unique constraint violation (P2002), return 200 without doing anything
        if (e && typeof e === 'object' && 'code' in e && (e as { code: string }).code === 'P2002') {
          return NextResponse.json({ status: 'Idempotent - Already processed' });
        }
        throw e;
      }

      // 2. If new key, perform the operation: Reset all provider quotas
      await tx.provider.updateMany({
        data: {
          current_month_usage: 0
        }
      });

      return NextResponse.json({ status: 'Quotas reset successfully' });
    });
  } catch (error) {
    console.error('Webhook Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
