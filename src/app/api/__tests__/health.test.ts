import { describe, it, expect, vi, beforeEach } from 'vitest';

const mockDbInstance = {
  execute: vi.fn().mockResolvedValue([[{ 1: 1 }]]),
};

vi.mock('@/db', () => ({
  getDb: vi.fn(() => mockDbInstance),
}));

describe('GET /api/health', () => {
  beforeEach(() => { vi.clearAllMocks(); });

  it('returns ok when DB is reachable', async () => {
    const { GET } = await import('../health/route');
    const res = await GET();
    const body = await res.json();
    expect(res.status).toBe(200);
    expect(body.status).toBe('ok');
    expect(body.db).toBe('connected');
    expect(body).toHaveProperty('uptime');
    expect(body).toHaveProperty('timestamp');
  });

  it('returns degraded when DB fails', async () => {
    mockDbInstance.execute.mockRejectedValueOnce(new Error('connection failed'));
    const { GET } = await import('../health/route');
    const res = await GET();
    const body = await res.json();
    expect(body.status).toBe('degraded');
    expect(body.db).toBe('error');
  });
});
