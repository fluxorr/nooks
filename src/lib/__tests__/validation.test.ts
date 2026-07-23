import { describe, it, expect } from 'vitest';
import {
  urlSchema,
  saveLinkSchema,
  moveLinkSchema,
  deleteLinkSchema,
  createNookSchema,
  updateNookSchema,
} from '../validation';

describe('urlSchema', () => {
  it('accepts https URL', () => {
    expect(urlSchema.safeParse('https://example.com').success).toBe(true);
  });

  it('accepts http URL', () => {
    expect(urlSchema.safeParse('http://example.com').success).toBe(true);
  });

  it('rejects ftp URL', () => {
    expect(urlSchema.safeParse('ftp://example.com').success).toBe(false);
  });

  it('rejects javascript: URL', () => {
    expect(urlSchema.safeParse('javascript:alert(1)').success).toBe(false);
  });

  it('rejects empty string', () => {
    expect(urlSchema.safeParse('').success).toBe(false);
  });

  it('rejects arbitrary text', () => {
    expect(urlSchema.safeParse('not-a-url').success).toBe(false);
  });
});

describe('saveLinkSchema', () => {
  it('accepts URL with nookId', () => {
    const r = saveLinkSchema.safeParse({ url: 'https://example.com', nookId: 'abc' });
    expect(r.success).toBe(true);
  });

  it('accepts URL without nookId', () => {
    const r = saveLinkSchema.safeParse({ url: 'https://example.com' });
    expect(r.success).toBe(true);
  });

  it('rejects missing url', () => {
    const r = saveLinkSchema.safeParse({});
    expect(r.success).toBe(false);
  });
});

describe('createNookSchema', () => {
  it('accepts valid name and color', () => {
    const r = createNookSchema.safeParse({ name: 'Design', color: '#7c3aed' });
    expect(r.success).toBe(true);
  });

  it('accepts name without color', () => {
    const r = createNookSchema.safeParse({ name: 'Design' });
    expect(r.success).toBe(true);
  });

  it('rejects empty name', () => {
    const r = createNookSchema.safeParse({ name: '' });
    expect(r.success).toBe(false);
  });

  it('rejects name over 100 chars', () => {
    const r = createNookSchema.safeParse({ name: 'x'.repeat(101) });
    expect(r.success).toBe(false);
  });

  it('rejects invalid hex color', () => {
    const r = createNookSchema.safeParse({ name: 'Test', color: 'red' });
    expect(r.success).toBe(false);
  });
});

describe('updateNookSchema', () => {
  it('accepts valid id and isPublic', () => {
    const r = updateNookSchema.safeParse({ id: 'abc123', isPublic: true });
    expect(r.success).toBe(true);
  });

  it('rejects missing id', () => {
    const r = updateNookSchema.safeParse({ isPublic: true });
    expect(r.success).toBe(false);
  });

  it('rejects non-boolean isPublic', () => {
    const r = updateNookSchema.safeParse({ id: 'abc', isPublic: 'true' });
    expect(r.success).toBe(false);
  });
});

describe('moveLinkSchema', () => {
  it('accepts valid linkId and null nookId', () => {
    const r = moveLinkSchema.safeParse({ linkId: 'abc', nookId: null });
    expect(r.success).toBe(true);
  });

  it('rejects empty linkId', () => {
    const r = moveLinkSchema.safeParse({ linkId: '' });
    expect(r.success).toBe(false);
  });
});

describe('deleteLinkSchema', () => {
  it('accepts valid linkId', () => {
    const r = deleteLinkSchema.safeParse({ linkId: 'abc' });
    expect(r.success).toBe(true);
  });

  it('rejects empty linkId', () => {
    const r = deleteLinkSchema.safeParse({ linkId: '' });
    expect(r.success).toBe(false);
  });
});
