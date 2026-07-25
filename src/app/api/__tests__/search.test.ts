import { describe, it, expect, vi, beforeEach } from 'vitest';
import type { NextRequest } from 'next/server';

const mockLinks = [
  { id: '1', url: 'https://example.com', title: 'Example Site', summary: 'A test site', tags: ['test', 'demo'], nookId: null, createdAt: new Date().toISOString() },
  { id: '2', url: 'https://react.dev', title: 'React Docs', summary: 'React framework docs', tags: ['react', 'frontend'], nookId: 'n1', createdAt: new Date().toISOString() },
];

const mockDbInstance = {
  select: vi.fn(() => ({
    from: vi.fn(() => ({
      where: vi.fn(() => ({
        limit: vi.fn(() => ({
          orderBy: vi.fn().mockResolvedValue(mockLinks),
        })),
      })),
    })),
  })),
};

vi.mock('@/db', () => ({
  getDb: vi.fn(() => mockDbInstance),
}));

function createRequest(url: string): NextRequest {
  return new Request(url) as unknown as NextRequest;
}

async function parseResponse(res: Response) {
  return { status: res.status, body: await res.json() };
}

describe('GET /api/links/search', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('returns 400 when query is missing', async () => {
    const { GET } = await import('../links/search/route');
    const res = await GET(createRequest('http://localhost:3000/api/links/search'));
    const { status, body } = await parseResponse(res);
    expect(status).toBe(400);
    expect(body.error).toBe('Invalid search query');
  });

  it('returns 400 when query is empty', async () => {
    const { GET } = await import('../links/search/route');
    const res = await GET(createRequest('http://localhost:3000/api/links/search?q='));
    const { status } = await parseResponse(res);
    expect(status).toBe(400);
  });

  it('returns 400 when query exceeds max length', async () => {
    const { GET } = await import('../links/search/route');
    const res = await GET(createRequest(`http://localhost:3000/api/links/search?q=${'a'.repeat(201)}`));
    const { status } = await parseResponse(res);
    expect(status).toBe(400);
  });

  it('returns matching links for a valid query', async () => {
    const { GET } = await import('../links/search/route');
    const res = await GET(createRequest('http://localhost:3000/api/links/search?q=react'));
    const { status, body } = await parseResponse(res);
    expect(status).toBe(200);
    expect(body.links).toHaveLength(2);
    expect(body.total).toBe(2);
  });

  it('accepts optional nookId filter', async () => {
    const { GET } = await import('../links/search/route');
    const res = await GET(createRequest('http://localhost:3000/api/links/search?q=test&nookId=n1'));
    const { status } = await parseResponse(res);
    expect(status).toBe(200);
  });

  it('accepts custom limit', async () => {
    const { GET } = await import('../links/search/route');
    const res = await GET(createRequest('http://localhost:3000/api/links/search?q=test&limit=10'));
    const { status } = await parseResponse(res);
    expect(status).toBe(200);
  });

  it('rejects limit over 100', async () => {
    const { GET } = await import('../links/search/route');
    const res = await GET(createRequest('http://localhost:3000/api/links/search?q=test&limit=200'));
    const { status } = await parseResponse(res);
    expect(status).toBe(400);
  });
});
