import { describe, it, expect } from 'vitest';
import { saveLinkSchema, moveLinkSchema, deleteLinkSchema, createNookSchema } from '../validation';

describe('saveLinkSchema', () => {
  it('accepts a valid URL', () => {
    const result = saveLinkSchema.safeParse({ url: 'https://example.com' });
    expect(result.success).toBe(true);
  });

  it('accepts URL with nookId', () => {
    const result = saveLinkSchema.safeParse({ url: 'https://example.com', nookId: 'abc123' });
    expect(result.success).toBe(true);
  });

  it('accepts URL with null nookId', () => {
    const result = saveLinkSchema.safeParse({ url: 'https://example.com', nookId: null });
    expect(result.success).toBe(true);
  });

  it('rejects missing URL', () => {
    const result = saveLinkSchema.safeParse({});
    expect(result.success).toBe(false);
  });

  it('rejects empty URL', () => {
    const result = saveLinkSchema.safeParse({ url: '' });
    expect(result.success).toBe(false);
  });

  it('rejects non-http URL', () => {
    const result = saveLinkSchema.safeParse({ url: 'ftp://example.com' });
    expect(result.success).toBe(false);
  });

  it('rejects invalid URL string', () => {
    const result = saveLinkSchema.safeParse({ url: 'not-a-url' });
    expect(result.success).toBe(false);
  });

  it('rejects javascript: URL', () => {
    const result = saveLinkSchema.safeParse({ url: 'javascript:alert(1)' });
    expect(result.success).toBe(false);
  });
});

describe('moveLinkSchema', () => {
  it('accepts valid linkId and null nookId', () => {
    const result = moveLinkSchema.safeParse({ linkId: 'abc123', nookId: null });
    expect(result.success).toBe(true);
  });

  it('accepts valid linkId with nookId', () => {
    const result = moveLinkSchema.safeParse({ linkId: 'abc123', nookId: 'nook456' });
    expect(result.success).toBe(true);
  });

  it('rejects missing linkId', () => {
    const result = moveLinkSchema.safeParse({ nookId: null });
    expect(result.success).toBe(false);
  });

  it('rejects empty linkId', () => {
    const result = moveLinkSchema.safeParse({ linkId: '', nookId: null });
    expect(result.success).toBe(false);
  });
});

describe('deleteLinkSchema', () => {
  it('accepts valid linkId', () => {
    const result = deleteLinkSchema.safeParse({ linkId: 'abc123' });
    expect(result.success).toBe(true);
  });

  it('rejects missing linkId', () => {
    const result = deleteLinkSchema.safeParse({});
    expect(result.success).toBe(false);
  });

  it('rejects empty linkId', () => {
    const result = deleteLinkSchema.safeParse({ linkId: '' });
    expect(result.success).toBe(false);
  });
});

describe('createNookSchema', () => {
  it('accepts valid name', () => {
    const result = createNookSchema.safeParse({ name: 'Engineering' });
    expect(result.success).toBe(true);
  });

  it('accepts name with optional color', () => {
    const result = createNookSchema.safeParse({ name: 'Design', color: '#7c3aed' });
    expect(result.success).toBe(true);
  });

  it('rejects empty name', () => {
    const result = createNookSchema.safeParse({ name: '' });
    expect(result.success).toBe(false);
  });

  it('rejects name over 100 chars', () => {
    const result = createNookSchema.safeParse({ name: 'x'.repeat(101) });
    expect(result.success).toBe(false);
  });

  it('rejects invalid hex color', () => {
    const result = createNookSchema.safeParse({ name: 'Test', color: 'blue' });
    expect(result.success).toBe(false);
  });

  it('rejects hex color without hash', () => {
    const result = createNookSchema.safeParse({ name: 'Test', color: 'ff0000' });
    expect(result.success).toBe(false);
  });

  it('rejects short hex color', () => {
    const result = createNookSchema.safeParse({ name: 'Test', color: '#fff' });
    expect(result.success).toBe(false);
  });
});
