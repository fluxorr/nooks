# Nooks - Project Context

> Living document. Updated whenever the codebase changes.

## Project Overview

**Nooks** is a link curation tool. Save links from anywhere (Chrome extension, web UI, right-click menu), and they get auto-summarized and tagged by AI. Organize links into collections called "Nooks". Search across everything from the dashboard.

Repository root: `/Users/rahulchd_/rahulll/code/pros/nooks`

## Tech Stack

- **Frontend:** Next.js 14 (App Router) + React 18 + Tailwind CSS 3.4
- **Animation:** Framer Motion
- **Backend:** Next.js API routes (Node runtime, except `/api/health` which uses Edge)
- **Database:** Neon PostgreSQL + Drizzle ORM
- **AI:** OpenRouter API via the `openai` SDK (model: `google/gemma-2-9b-it:free`)
- **Scraping:** Jina AI Reader API (`https://r.jina.ai/{url}`)
- **Testing:** Vitest v4
- **Linting:** ESLint (next/core-web-vitals)

## Project Structure

```
├── extension/               # Chrome extension (Manifest V3)
│   ├── manifest.json
│   ├── background.js        # Service worker: context menus, notifications, save calls
│   ├── popup.html / popup.js# Extension popup UI
│   ├── content.js / content.css # Hover-to-save tooltip injected into pages
│   ├── options.html / options.js# Extension options page (server URL config)
│   └── icons/               # 16, 32, 48, 128 PNG icons
├── public/                  # Static assets, favicon.svg, robots.txt, manifest.json
├── src/
│   ├── app/                 # Next.js App Router pages + API routes
│   │   ├── page.tsx         # Landing/marketing page
│   │   ├── save/page.tsx    # Auto-save page (?url=...), shows saving state
│   │   ├── dashboard/page.tsx # Main app: collections + links list
│   │   ├── layout.tsx       # Root layout with SEO, Inter font, ViewTransitions
│   │   ├── loading.tsx      # Root loading state
│   │   ├── error.tsx        # Root error boundary
│   │   └── not-found.tsx    # 404 page
│   │   ├── api/
│   │   │   ├── save/route.ts    # POST creates a link
│   │   │   ├── links/route.ts   # PATCH move, DELETE remove
│   │   │   ├── nooks/route.ts   # GET list, POST create
│   │   │   └── health/route.ts  # GET health check (edge runtime)
│   │   └── globals.css
│   ├── components/
│   │   ├── CommandPalette.tsx  # ⌘K search modal
│   │   ├── ViewTransitions.tsx # Client view transition wrapper
│   │   └── Scales.tsx          # Decorative scales background
│   ├── db/
│   │   ├── index.ts         # Drizzle client singleton (getDb)
│   │   └── schema.ts        # PostgreSQL schema
│   ├── lib/
│   │   ├── utils.ts         # cn(), generateId()
│   │   └── validation.ts    # Zod schemas
│   └── lib/__tests__/       # Unit tests + API route tests
├── tailwind.config.ts       # Custom color tokens via CSS vars
├── vitest.config.ts         # Vitest config with `@` alias
├── drizzle.config.ts        # Drizzle Kit config
├── CHANGELOG.md
├── TODO.md                  # Previous task list
├── SPEC.md                  # Product spec
├── .env / .env.example      # DATABASE_URL, OPENROUTER_API_KEY (not tracked)
└── PROJECT_CONTEXT.md       # This file — project context
```

## Pages / Routes

| Page | Path | Purpose |
|------|------|---------|
| Landing | `/` | Marketing page with save input |
| Save | `/save?url={url}` | Auto-fetches summary and saves a link |
| Dashboard | `/dashboard` | Browse/search Nooks and links |
| Health | `/api/health` | Public health check |

## API Endpoints

| Method | Route | Body | Response |
|--------|-------|------|----------|
| POST | `/api/save` | `{ url: string, nookId?: string \| null }` | `{ id, title, summary, tags }` |
| POST | `/api/nooks` | `{ name: string, color?: string }` | `{ id, name, color }` |
| GET | `/api/nooks` | - | `{ nooks, links }` |
| PATCH | `/api/links` | `{ linkId: string, nookId: string \| null }` | `{ success: true }` |
| DELETE | `/api/links` | `{ linkId: string }` | `{ success: true }` |
| GET | `/api/health` | - | `{ status: 'ok', timestamp }` |

## Database Schema

### `nooks`
| Column | Type | Default |
|--------|------|---------|
| id | text (PK) | |
| name | text (not null) | |
| color | text | `'#f5a623'` |
| is_public | boolean | `false` |
| created_at | timestamp | `now()` |

### `links`
| Column | Type | Default |
|--------|------|---------|
| id | text (PK) | |
| url | text (not null) | |
| title | text | |
| summary | text | |
| image_url | text | |
| nook_id | text (FK → nooks.id) | |
| tags | text[] | |
| created_at | timestamp | `now()` |

## Environment Variables

Copy `.env.example` to `.env`:

```bash
DATABASE_URL=postgresql://user:password@host:5432/database?sslmode=require
OPENROUTER_API_KEY=sk-or-v1-your-key-here
```

`.env` is in `.gitignore` and must never be committed.

## Available Scripts

```bash
npm run dev          # Start Next.js dev server
npm run build        # Production build
npm run start        # Start production server
npm run lint         # ESLint
npm test             # Run Vitest once
npm run test:watch   # Run Vitest in watch mode
npm run db:push      # Push schema via Drizzle Kit
npm run db:generate  # Generate migrations
```

## Chrome Extension

### Installation / Loading

1. Open Chrome → `chrome://extensions/`
2. Enable **Developer mode**
3. Click **Load unpacked**
4. Select the `extension/` folder

### Permissions

- `activeTab` — access current tab URL
- `storage` — persist server URL setting
- `notifications` — show save success/failure toasts
- `contextMenus` — right-click save on links/pages
- `host_permissions`: `http://localhost:3000/*`, `https://*/*`

### Extension Files

| File | Purpose |
|------|---------|
| `manifest.json` | Extension metadata, shortcuts, content scripts |
| `background.js` | Service worker: handles save API calls, notifications, context menus, keyboard shortcut |
| `popup.html/js` | Click the toolbar icon to save current page |
| `content.js/css` | Injected into all pages; hover over links to show save tooltip |
| `options.html/js` | Extension settings (server URL, connection test) |

### Extension Features

- **Toolbar popup**: save current page with one click. Shows connection status (green/red dot).
- **Right-click menu**: save link or save page to Nooks.
- **Keyboard shortcut**: **Ctrl+Shift+S** (Windows/Linux), **Cmd+Shift+S** (macOS). Popup displays platform-aware modifier key.
- **Hover tooltip**: 500ms hover on any link shows a "Save to Nooks" button. Clamped to viewport. Smart show/hide logic (entering tooltip doesn't hide it).
- **Options page**: configurable server URL + connection test button.
- **Retry logic**: background.js retries save up to 2 times on network failure or timeout.

### Extension Configuration

The extension stores the Nooks server URL in `chrome.storage.sync` under key `serverUrl`.
Default: `http://localhost:3000`.

To use a deployed/production server:
1. Right-click the Nooks toolbar icon → **Options**
2. Enter your server URL
3. Click **Test connection** to verify

## Design System

### Colors

CSS custom properties in `src/app/globals.css`. Dark mode via `.dark` class on `<html>`.

| Token | Light | Dark |
|-------|-------|------|
| `--background` | `#ffffff` | `#1c1c1c` |
| `--foreground` | `#37352f` | `#ebebeb` |
| `--foreground-muted` | `#6b6b6b` | `#6b6b6b` |
| `--accent` | `#37352f` | `#ebebeb` |
| `--surface` | `#ffffff` | `#252525` |
| `--border` | `#e9e9e7` | `#333333` |

Tailwind config maps these to utility classes: `bg-background`, `text-foreground`, `border-border`, etc.

### Typography

- Body: system-ui stack (`-apple-system, SF Pro Display, SF Pro Text, Helvetica Neue`)
- Mono: `SF Mono, Fira Code, monospace`
- Inter font loaded via `next/font/google` for the `--font-inter` CSS variable

## Testing

Vitest v4. Tests cover:

- `src/lib/__tests__/utils.test.ts` — `cn()` merging, `generateId()` UUID
- `src/lib/__tests__/validation.test.ts` — Zod schemas (save, move, delete, create)
- `src/app/api/__tests__/save.test.ts` — API route validation (save, nooks, links, delete)

Run: `npm test`

**Last result:** 3 test files, 51 tests, all passing. Lint passes (pre-existing warnings only).

## Linting / Code Style

- ESLint: `next/core-web-vitals` + custom rules
- Prettier config in `.prettierrc`
- Tailwind CSS v3.4 with custom color tokens

## Commit History (Extension + App Changes)

### polish(extension): improve popup with status indicator, platform-aware shortcut, options link
- Connection status indicator showing server reachability
- Platform-aware modifier key display (Cmd vs Ctrl)
- Gear icon linking to extension options page
- Better error state recovery (reset button after timeout)

### fix(extension): robust hover tooltip with 500ms delay and smart positioning
- Changed hover delay from 400ms to 500ms per product spec
- Fixed scroll position bug (fixed position doesn't need scrollX offset)
- Clamped tooltip to viewport, falls back below link if no space above
- Proper hide logic: tooltip stays visible when moving mouse to it
- Uses calculated offsetHeight instead of hardcoded `-40px`

### fix(extension): align keyboard shortcut and add options page
- Changed shortcut from `Ctrl+Shift+Z`/`Cmd+Shift+Z` to `Ctrl+Shift+S`/`Cmd+Shift+S`
- Added `options_page` entry to manifest
- Added `options.html`/`options.js` for configurable Nooks server URL with connection test

### fix(site): align landing page shortcut badge with extension
- Changed badge from `⇧⌘Z` to `⇧⌘S`
