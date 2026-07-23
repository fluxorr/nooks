import { NextRequest, NextResponse } from 'next/server';

const SECURITY_HEADERS: Record<string, string> = {
  'X-Content-Type-Options': 'nosniff',
  'X-Frame-Options': 'DENY',
  'Referrer-Policy': 'strict-origin-when-cross-origin',
  'X-DNS-Prefetch-Control': 'off',
};

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
