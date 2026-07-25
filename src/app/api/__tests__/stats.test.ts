import { describe, it, expect, vi, beforeEach } from 'vitest';

const fromChain = {
  where: vi.fn().mockResolvedValue([{ value: 5 }]),
  groupBy: vi.fn().mockResolvedValue([]),
};

const mockDbInstance = {
  select: vi.fn(() => ({
    from: vi.fn(() => fromChain),
  })),
};

vi.mock('@/db', () => ({
  getDb: vi.fn(() => mockDbInstance),
}));

async function parseResponse(res: Response) {
  return { status: res.status, body: await res.json() };
}

describe('GET /api/stats', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    fromChain.where.mockResolvedValue([{ value: 5 }]);
    fromChain.groupBy.mockResolvedValue([]);
  });

  it('returns stats shape', async () => {
    const { GET } = await import('../stats/route');
    const res = await GET();
    const { status, body } = await parseResponse(res);
    expect(status).toBe(200);
    expect(body).toHaveProperty('totalLinks');
    expect(body).toHaveProperty('totalNooks');
    expect(body).toHaveProperty('linksThisWeek');
    expect(body).toHaveProperty('linksPerNook');
  });

  it('has number values for counts', async () => {
    const { GET } = await import('../stats/route');
    const res = await GET();
    const { body } = await parseResponse(res);
    expect(typeof body.totalLinks).toBe('number');
    expect(typeof body.totalNooks).toBe('number');
    expect(typeof body.linksThisWeek).toBe('number');
  });

  it('returns empty object for linksPerNook when no group', async () => {
    const { GET } = await import('../stats/route');
    const res = await GET();
    const { body } = await parseResponse(res);
    expect(body.linksPerNook).toEqual({});
  });
});
