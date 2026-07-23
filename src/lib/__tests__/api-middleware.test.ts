import { describe, it, expect } from 'vitest';
import type { NextRequest } from 'next/server';
import { apiError, apiSuccess, requireJson } from '../api-middleware';

describe('apiError', () => {
  it('returns correct status and error message', async () => {
    const res = apiError('Not found', 404);
    const body = await res.json();
    expect(res.status).toBe(404);
    expect(body.error).toBe('Not found');
  });

  it('includes details when provided', async () => {
    const res = apiError('Invalid', 400, { field: 'name' });
    const body = await res.json();
    expect(body.details).toEqual({ field: 'name' });
  });

  it('sets security headers', () => {
    const res = apiError('err', 500);
    expect(res.headers.get('X-Content-Type-Options')).toBe('nosniff');
    expect(res.headers.get('X-Frame-Options')).toBe('DENY');
  });
});

describe('apiSuccess', () => {
  it('returns 200 with data', async () => {
    const res = apiSuccess({ ok: true });
    const body = await res.json();
    expect(res.status).toBe(200);
    expect(body.ok).toBe(true);
  });

  it('respects custom status', () => {
    const res = apiSuccess({}, 201);
    expect(res.status).toBe(201);
  });
});

function nextReq(url: string, init?: RequestInit): NextRequest {
  return new Request(url, init) as unknown as NextRequest;
}

describe('requireJson', () => {
  it('rejects GET requests', async () => {
    const { json, error } = await requireJson(nextReq('http://localhost:3000/api/test', { method: 'GET' }));
    expect(json).toBeNull();
    expect(error).toBeDefined();
    if (error) expect((await error.json()).error).toBe('Method does not accept a body');
  });

  it('rejects missing Content-Type', async () => {
    const { error } = await requireJson(nextReq('http://localhost:3000/api/test', {
      method: 'POST',
      body: '{}',
    }));
    expect(error).toBeDefined();
    if (error) expect((await error.json()).error).toBe('Content-Type must be application/json');
  });

  it('rejects malformed JSON', async () => {
    const { error } = await requireJson(nextReq('http://localhost:3000/api/test', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: 'not-json',
    }));
    expect(error).toBeDefined();
    if (error) expect((await error.json()).error).toBe('Invalid JSON body');
  });

  it('parses valid JSON', async () => {
    const { json, error } = await requireJson(nextReq('http://localhost:3000/api/test', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ foo: 'bar' }),
    }));
    expect(error).toBeUndefined();
    expect(json).toEqual({ foo: 'bar' });
  });
});
