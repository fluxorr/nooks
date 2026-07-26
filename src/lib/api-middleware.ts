import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { getDb } from '@/db';
import { apiTokens } from '@/db/schema';
import { eq } from 'drizzle-orm';

const SECURITY_HEADERS: Record<string, string> = {
  'X-Content-Type-Options': 'nosniff',
  'X-Frame-Options': 'DENY',
  'Referrer-Policy': 'strict-origin-when-cross-origin',
  'X-DNS-Prefetch-Control': 'off',
};

export async function authenticate(req?: NextRequest): Promise<string | null> {
  const { userId } = auth();
  if (userId) return userId;

  const token = req?.headers.get('x-api-token');
  if (!token) return null;

  try {
    const db = getDb();
    const result = await db.select().from(apiTokens).where(eq(apiTokens.token, token)).limit(1);
    return result[0]?.userId ?? null;
  } catch { return null; }
}

export function apiError(message: string, status: number, details?: unknown) {
  return NextResponse.json(
    { error: message, ...(details ? { details } : {}) },
    { status, headers: SECURITY_HEADERS }
  );
}

export function apiSuccess<T>(data: T, status = 200) {
  return NextResponse.json(data, { status, headers: SECURITY_HEADERS });
}

export async function requireJson(req: NextRequest): Promise<{ json: unknown; error?: NextResponse }> {
  if (req.method === 'GET' || req.method === 'HEAD') {
    return { json: null, error: apiError('Method does not accept a body', 405) };
  }
  const ct = req.headers.get('content-type') || '';
  if (!ct.includes('application/json')) {
    return { json: null, error: apiError('Content-Type must be application/json', 415) };
  }
  try {
    return { json: await req.json() };
  } catch {
    return { json: null, error: apiError('Invalid JSON body', 400) };
  }
}
