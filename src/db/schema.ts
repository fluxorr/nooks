import { pgTable, text, timestamp, boolean, integer } from 'drizzle-orm/pg-core';

export const nooks = pgTable('nooks', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  color: text('color').default('#f5a623'),
  isPublic: boolean('is_public').default(false),
  createdAt: timestamp('created_at').defaultNow(),
});

export const links = pgTable('links', {
  id: text('id').primaryKey(),
  url: text('url').notNull(),
  title: text('title'),
  summary: text('summary'),
  imageUrl: text('image_url'),
  nookId: text('nook_id').references(() => nooks.id),
  tags: text('tags').array(),
  createdAt: timestamp('created_at').defaultNow(),
});