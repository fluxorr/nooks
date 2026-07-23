import { NextResponse } from 'next/server';
import { getDb } from '@/db';
import { sql } from 'drizzle-orm';

export const runtime = 'edge';

const startTime = Date.now();

export async function GET() {
  let dbOk = false;
  try {
    const db = getDb();
    await db.execute(sql`SELECT 1`);
    dbOk = true;
  } catch {
    dbOk = false;
  }

  return NextResponse.json({
    status: dbOk ? 'ok' : 'degraded',
    uptime: Math.floor((Date.now() - startTime) / 1000),
    timestamp: new Date().toISOString(),
    db: dbOk ? 'connected' : 'error',
  });
}
