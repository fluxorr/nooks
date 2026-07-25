# Nooks

A link curation tool. Save URLs, auto-summarize and tag them with AI, organize into collections ("Nooks").

## Stack

- **Framework:** Next.js 14 (App Router), React 18, Tailwind CSS 3
- **Database:** Neon PostgreSQL + Drizzle ORM
- **AI:** OpenRouter (Google Gemma 2) for summaries/tags, Jina AI for page scraping
- **Extension:** Chrome Manifest V3 (popup, content script, service worker)
- **Testing:** Vitest

## Getting started

```bash
npm install
cp .env.example .env   # fill in DATABASE_URL, OPENROUTER_API_KEY, JINA_API_KEY
npm run db:push        # push schema to database
npm run dev            # http://localhost:3000
```

## Scripts

| Command               | Action                      |
| --------------------- | --------------------------- |
| `npm run dev`         | Start dev server            |
| `npm run build`       | Production build            |
| `npm run lint`        | ESLint                      |
| `npm run typecheck`   | TypeScript check            |
| `npm run test`        | Run tests                   |
| `npm run db:push`     | Push Drizzle schema         |
| `npm run db:generate` | Generate Drizzle migrations |

## Extension

The Chrome extension lives in `extension/`. Load it as an unpacked extension in `chrome://extensions` (dev mode).

## API

REST routes under `src/app/api/` — save links, manage nooks, search, health check.
