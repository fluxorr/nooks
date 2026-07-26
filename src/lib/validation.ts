import { z } from 'zod';

export const urlSchema = z.string().url().refine(
  val => val.startsWith('http://') || val.startsWith('https://'),
  { message: 'URL must start with http:// or https://' }
);

export const saveLinkSchema = z.object({
  url: urlSchema,
  title: z.string().max(500).optional().nullable(),
  nookId: z.string().min(1).optional().nullable(),
});

export const moveLinkSchema = z.object({
  linkId: z.string().min(1, 'linkId is required'),
  nookId: z.string().nullable(),
});

export const deleteLinkSchema = z.object({
  linkId: z.string().min(1, 'linkId is required'),
});

export const createNookSchema = z.object({
  name: z.string().min(1, 'Name is required').max(100, 'Name must be under 100 characters'),
  color: z.string().regex(/^#[0-9a-fA-F]{6}$/, 'Color must be a valid hex color').optional(),
});

export const updateNookSchema = z.object({
  id: z.string().min(1, 'id is required'),
  isPublic: z.boolean(),
});
