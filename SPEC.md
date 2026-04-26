# Nooks - Link Curator

## Product Overview

**Nooks** is a beautiful link curation tool that helps you save, organize, and search across the web content you care about. Think of it as a personal digital library where every link gets auto-summarized, tagged, and stored in themed collections called "Nooks."

## Core Features

1. **Save Links**
   - Manual URL paste
   - Chrome extension icon to save current page
   - Hover-to-save tooltip on any link (500ms hover delay)
   - Keyboard shortcut (Cmd/Ctrl+Shift+S) to save current page

2. **Auto-Processing**
   - URL content scraping via Jina AI Reader API
   - Auto-generate 2-3 sentence summary
   - Auto-tag with AI-generated topics

3. **Organization (Nooks)**
   - User-created collections for grouping links
   - Default "Inbox" for unsorted links
   - Custom Nooks with name + color

4. **Search**
   - Full-text search across summaries
   - Tag-based filtering

5. **Share (TIL-style)**
   - Make Nooks public
   - Shareable link to curated lists

## Tech Stack

- **Frontend:** Next.js 14 + Tailwind CSS + Framer Motion
- **Backend:** Next.js API routes
- **Database:** Neon PostgreSQL + Drizzle ORM
- **AI:** OpenRouter API (free tier available)
- **Scraping:** Jina AI Reader API (free tier available)

## Pricing

Free tier:
- Unlimited links
- Unlimited Nooks
- Basic search
- Manual save + extension

## Design Direction

- Typography-driven with bold, confident headers
- Warm accent color (amber/coral blend)
- Subtle scroll-triggered animations
- Glassmorphism for modals/tooltips
- Grid-based link display with varied card sizes
- Clean, minimal aesthetic with personality

## Chrome Extension

- Popup for quick save
- Hover tooltip on all links
- Cmd/Ctrl+Shift+S shortcut
- Syncs with web app via localStorage + optional account