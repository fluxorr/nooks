import { describe, it, expect, vi, beforeEach } from 'vitest';
import type { NextRequest } from 'next/server';

function mockSelect(result: unknown[] = []) {
  return vi.fn(() => ({
    from: vi.fn(() => ({
      orderBy: vi.fn().mockResolvedValue(result),
      where: vi.fn(() => ({
        limit: vi.fn().mockResolvedValue(result),
      })),
    })),
  }));
}

const mockDbInstance = {
  insert: vi.fn(() => ({
    values: vi.fn().mockResolvedValue(undefined),
  })),
  update: vi.fn(() => ({
    set: vi.fn(() => ({
      where: vi.fn().mockResolvedValue(undefined),
    })),
  })),
  delete: vi.fn(() => ({
    where: vi.fn().mockResolvedValue(undefined),
  })),
  select: mockSelect([]),
};

vi.mock('@/db', () => ({
  getDb: vi.fn(() => mockDbInstance),
}));

vi.mock('openai', () => {
  const MockOpenAI = vi.fn(() => ({
    chat: {
      completions: {
        create: vi.fn().mockResolvedValue({
          choices: [{ message: { content: '{}' } }],
        }),
      },
    },
  }));
  return { default: MockOpenAI };
});

function createRequest(body: unknown, method = 'POST'): NextRequest {
  return new Request('http://localhost:3000/api/save', {
    method,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  }) as unknown as NextRequest;
}

async function parseResponse(res: Response) {
  return { status: res.status, body: await res.json() };
}

describe('POST /api/save', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('rejects missing URL with 400 and field details', async () => {
    const { POST } = await import('../save/route');
    const res = await POST(createRequest({}));
    const { status, body } = await parseResponse(res);
    expect(status).toBe(400);
    expect(body.error).toBe('Invalid request');
    expect(body.details).toBeDefined();
    expect(body.details.url).toBeDefined();
  });

  it('rejects empty URL with 400', async () => {
    const { POST } = await import('../save/route');
    const res = await POST(createRequest({ url: '' }));
    const { status } = await parseResponse(res);
    expect(status).toBe(400);
  });

  it('rejects non-http URL with 400', async () => {
    const { POST } = await import('../save/route');
    const res = await POST(createRequest({ url: 'ftp://example.com' }));
    const { status, body } = await parseResponse(res);
    expect(status).toBe(400);
    expect(body.details).toBeDefined();
  });

  it('rejects javascript: URL with 400', async () => {
    const { POST } = await import('../save/route');
    const res = await POST(createRequest({ url: 'javascript:alert(1)' }));
    const { status } = await parseResponse(res);
    expect(status).toBe(400);
  });

  it('rejects invalid URL string with 400', async () => {
    const { POST } = await import('../save/route');
    const res = await POST(createRequest({ url: 'not-a-url' }));
    const { status } = await parseResponse(res);
    expect(status).toBe(400);
  });

  it('rejects body with array of URLs', async () => {
    const { POST } = await import('../save/route');
    const res = await POST(createRequest({ url: ['https://example.com'] }));
    const { status } = await parseResponse(res);
    expect(status).toBe(400);
  });

  it('rejects malformed JSON body with 400', async () => {
    const { POST } = await import('../save/route');
    const req = new Request('http://localhost:3000/api/save', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: 'not-json',
    }) as unknown as NextRequest;
    const res = await POST(req);
    const { status, body } = await parseResponse(res);
    expect(status).toBe(400);
    expect(body.error).toBe('Invalid JSON body');
  });

  it('rejects request without Content-Type with 415', async () => {
    const { POST } = await import('../save/route');
    const req = new Request('http://localhost:3000/api/save', {
      method: 'POST',
      body: JSON.stringify({ url: 'https://example.com' }),
    }) as unknown as NextRequest;
    const res = await POST(req);
    const { status, body } = await parseResponse(res);
    expect(status).toBe(415);
    expect(body.error).toBe('Content-Type must be application/json');
  });

  it('accepts valid URL and inserts into DB', async () => {
    const { POST } = await import('../save/route');
    const res = await POST(createRequest({ url: 'https://example.com' }));
    const { status, body } = await parseResponse(res);
    expect(status).toBe(200);
    expect(body).toHaveProperty('id');
    expect(body).toHaveProperty('title');
    expect(mockDbInstance.insert).toHaveBeenCalled();
  });

  it('accepts URL with nookId', async () => {
    const { POST } = await import('../save/route');
    const res = await POST(createRequest({ url: 'https://example.com', nookId: 'nook123' }));
    const { status } = await parseResponse(res);
    expect(status).toBe(200);
  });
});

describe('POST /api/nooks', () => {
  it('rejects missing name with 400', async () => {
    const { POST } = await import('../nooks/route');
    const res = await POST(createRequest({}));
    const { status, body } = await parseResponse(res);
    expect(status).toBe(400);
    expect(body.error).toBe('Invalid request');
  });

  it('rejects empty name with 400', async () => {
    const { POST } = await import('../nooks/route');
    const res = await POST(createRequest({ name: '' }));
    const { status } = await parseResponse(res);
    expect(status).toBe(400);
  });

  it('rejects name over 100 chars', async () => {
    const { POST } = await import('../nooks/route');
    const res = await POST(createRequest({ name: 'x'.repeat(101) }));
    const { status } = await parseResponse(res);
    expect(status).toBe(400);
  });

  it('rejects invalid hex color', async () => {
    const { POST } = await import('../nooks/route');
    const res = await POST(createRequest({ name: 'Test', color: 'red' }));
    const { status } = await parseResponse(res);
    expect(status).toBe(400);
  });

  it('accepts valid name', async () => {
    const { POST } = await import('../nooks/route');
    const res = await POST(createRequest({ name: 'Engineering' }));
    const { status } = await parseResponse(res);
    expect(status).toBe(200);
  });
});

describe('PATCH /api/nooks', () => {
  beforeEach(() => { vi.clearAllMocks(); });

  it('rejects missing id with 400', async () => {
    const { PATCH } = await import('../nooks/route');
    const res = await PATCH(createRequest({ isPublic: true }));
    const { status, body } = await parseResponse(res);
    expect(status).toBe(400);
    expect(body.error).toBe('Invalid request');
  });

  it('rejects non-existent nook with 404', async () => {
    mockDbInstance.select = mockSelect([]);
    const { PATCH } = await import('../nooks/route');
    const res = await PATCH(createRequest({ id: 'nonexistent', isPublic: true }));
    const { status } = await parseResponse(res);
    expect(status).toBe(404);
  });

  it('accepts valid publish toggle', async () => {
    mockDbInstance.select = mockSelect([{ id: 'abc', name: 'Test' }]);
    const { PATCH } = await import('../nooks/route');
    const res = await PATCH(createRequest({ id: 'abc', isPublic: true }));
    const { status } = await parseResponse(res);
    expect(status).toBe(200);
  });
});

describe('PATCH /api/links', () => {
  it('rejects missing linkId with 400', async () => {
    const { PATCH } = await import('../links/route');
    const res = await PATCH(createRequest({ nookId: null }));
    const { status } = await parseResponse(res);
    expect(status).toBe(400);
  });

  it('rejects empty linkId with 400', async () => {
    const { PATCH } = await import('../links/route');
    const res = await PATCH(createRequest({ linkId: '', nookId: null }));
    const { status } = await parseResponse(res);
    expect(status).toBe(400);
  });

  it('accepts valid linkId and null nookId', async () => {
    const { PATCH } = await import('../links/route');
    const res = await PATCH(createRequest({ linkId: 'abc123', nookId: null }));
    const { status } = await parseResponse(res);
    expect(status).toBe(200);
  });

  it('accepts valid linkId with nookId', async () => {
    const { PATCH } = await import('../links/route');
    const res = await PATCH(createRequest({ linkId: 'abc123', nookId: 'nook456' }));
    const { status } = await parseResponse(res);
    expect(status).toBe(200);
  });
});

describe('DELETE /api/links', () => {
  it('rejects missing linkId with 400', async () => {
    const { DELETE } = await import('../links/route');
    const res = await DELETE(createRequest({}));
    const { status } = await parseResponse(res);
    expect(status).toBe(400);
  });

  it('rejects empty linkId with 400', async () => {
    const { DELETE } = await import('../links/route');
    const res = await DELETE(createRequest({ linkId: '' }));
    const { status } = await parseResponse(res);
    expect(status).toBe(400);
  });

  it('accepts valid linkId', async () => {
    const { DELETE } = await import('../links/route');
    const res = await DELETE(createRequest({ linkId: 'abc123' }));
    const { status } = await parseResponse(res);
    expect(status).toBe(200);
  });
});
