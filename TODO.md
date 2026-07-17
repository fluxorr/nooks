# TODO

## Security (P0)
- [x] Remove `.env` from git tracking — file is already in `.gitignore`, never committed
- [x] Create `.env.example` with placeholder values
- [ ] Rotate exposed credentials (DATABASE_URL, OPENROUTER_API_KEY) — file was never committed, no rotation needed
- [x] Add `.env` to `.gitignore` — verified it's already listed

## Testing (P1)
- [x] Add test framework (Vitest v4)
- [x] Create `vitest.config.ts`
- [x] Create basic tests for `cn()` and `generateId()` in `src/lib/__tests__/utils.test.ts`
- [ ] Add `@testing-library/react` for component tests
- [ ] Add tests for API routes
- [ ] Add tests for components (save page, dashboard, etc.)
- [ ] Set up CI with GitHub Actions

## Infrastructure (P1)
- [x] Create root error boundary (`src/app/error.tsx`)
- [x] Create root loading state (`src/app/loading.tsx`)
- [x] Create dashboard loading state (`src/app/dashboard/loading.tsx`)
- [x] Create 404 page (`src/app/not-found.tsx`)
- [x] Add proper SEO metadata to layout.tsx (OG + Twitter cards)
- [x] Add `metadata` export with title template
- [x] Add Open Graph / Twitter card metadata

## Asset Management (P1)
- [x] Create `public/favicon.svg`
- [x] Update layout.tsx to reference `favicon.svg` instead of `.ico`
- [x] Create `public/robots.txt`
- [x] Remove `apple-touch-icon.png` reference — replaced with favicon.svg
- [ ] Add `public/manifest.json` (or remove reference)
- [ ] Generate proper PNG favicons at various sizes

## Code Quality (P2)
- [x] Create `.eslintrc.json` with proper rules
- [x] Enable TypeScript strict mode — already enabled
- [ ] Fix any TypeScript strict errors
- [ ] Add `.prettierrc` config
- [ ] Add Husky + lint-staged for pre-commit hooks
- [ ] Address all `any` types (e.g. `setResult<any>` in save page)

## Polish (P2)
- [x] Improve error handling in save page (HTTP status check, cancellation, better error messages)
- [ ] Use CSS custom properties instead of inline theme colors
- [ ] Extract theme toggle into a reusable component
- [ ] Move inline border colors to use CSS vars defined in globals.css
- [ ] Fix extension hardcoded URLs (content.js → `http://localhost:3000`)
- [ ] Normalize extension URLs to use environment variables
- [ ] Add loading/empty/error states to API route responses
- [ ] Add toast notifications for actions

## Package Cleanup (P2)
- [x] Remove duplicate lock file (`bun.lock`)
- [x] Add `test` and `test:watch` scripts to package.json
- [ ] Align package manager — decided on npm (removed bun.lock)
- [ ] Audit dependencies for unused packages

## Integration (P3)
- [ ] Add `/api/health` endpoint
- [ ] Add rate limiting
- [ ] Add request validation (zod)
- [ ] Add request logging
- [ ] Add proper CORS headers for extension

## Accessibility (P3)
- [ ] Ensure proper aria labels on all interactive elements
- [ ] Add skip-to-content link
- [ ] Test with screen reader
- [ ] Ensure color contrast meets WCAG AA

## Performance (P3)
- [ ] Add next/image for images
- [ ] Add proper caching headers
- [ ] Lazy load below-the-fold content
- [ ] Add bundle analysis

## Documentation (P3)
- [ ] Document API routes
- [ ] Document extension setup
- [ ] Document environment variables
- [ ] Add contributing guide
