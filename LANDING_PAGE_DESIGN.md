# Nooks Landing Page - Design Document

## 1. Overview
The Nooks landing page (`src/app/page.tsx`) serves as the primary entry point for the application. It acts as an introduction to the product's core value proposition: curating the web, auto-summarizing links via AI, and organizing them into collections ("Nooks"). 

The page is designed with a minimal, typography-driven aesthetic inspired by Notion and modern productivity tools, heavily localized in a single-column constraints layout.

## 2. Visual Style & Theming
- **Dual Theme Support:** Fully supports both Light and Dark modes.
  - **Light Mode:** White background (`bg-white`), dark grey text (`text-[#37352f]`), and subtle grey borders (`#e9e9e7`).
  - **Dark Mode:** Deep charcoal background (`bg-[#191919]`), off-white text (`text-[#ebebeb]`), and darker borders (`#2f2f2f`).
- **Typography:** Clean, confident headers with a focus on readability and content hierarchy.
- **Accents:** Semantic colors used for feature highlights (Blue for Auto-summarizes, Green for Organize, Purple for Instant Search).

## 3. Layout Structure
The page is centered within a constrained maximum width (`max-w-2xl mx-auto`), anchored by custom left and right borders that extend down the viewport, providing a "document" or "canvas" feel. It is flanked by a `Scales` decorative component.

### 3.1 Navigation (Sticky)
- **Positioning:** Sticky/Relative top navigation with a blur backdrop (`backdrop-blur-md`).
- **Elements:**
  - **Brand/Logo:** Simple text logo ("nooks") with a slight hover scale effect.
  - **Theme Toggle:** An animated Sun/Moon icon toggle for switching between light and dark modes.
  - **CTA Button:** A subtle "Dashboard" link that matches the current theme properties.

### 3.2 Hero Section
- **Headline:** Bold, leading-tight 4xl header: "Curate the web, remember everything". The second half of the phrase is slightly muted to create visual contrast.
- **Subheadline:** Clear, concise 18px value proposition explaining the core features (AI summaries, collections, instant search).
- **Primary Action:**
  - A prominent URL input field for immediate engagement.
  - Features focus state styling and keyboard support (Enter to save).
  - A high-contrast "Save" button accompanied by a plus icon.
- **Microcopy:** A subtle hint below the input reminding users of the `⌘⇧S` Chrome extension shortcut.

### 3.3 Features Section
- **Layout:** A vertically stacked list of core features mapping to the `SPEC.md` (Auto-summarizes, Organize in Nooks, Instant search).
- **Card Design:** Each feature operates as a rounded container showing off an icon with a distinct background color.
- **Interactions:** Group hover states trigger subtle background transitions and icon scaling.

### 3.4 Call to Action (CTA) & Footer
- **Secondary CTA:** A simple "Open Dashboard" textual link with a looping right-arrow animation (`→`) drawing the user further into the app.
- **Footer:** A minimalist footer simply stating "Free forever" with subtle hover opacity transitions, bordered securely at the top.

## 4. Interactive Elements & Motion
The page relies heavily on **Framer Motion** for bringing the interface to life:
- **Mount Animations:** The Hero section slides up (`y: 16` to `0`) and fades in gracefully on load.
- **Micro-interactions:** 
  - Buttons and links scale up slightly on hover (`scale: 1.02` or `1.1`) and scale down on tap (`scale: 0.9`).
  - The theme toggle rotates 180 degrees when switching modes.
- **Scroll Reveals:** Features fade and slide up sequentially (`whileInView`) as the user scrolls down.
- **Focus Rings:** The main input dynamically updates its border colors and scales up slightly when focused to draw attention.

## 5. Technical Implementation Details
- **State Management:** Uses React `useState` for the URL input, theme preferences, mount status (to prevent hydration mismatches), and input focus states.
- **Styling:** Tailwind CSS is used extensively with arbitrary values (e.g., `bg-[#191919]`) to perfectly match the design specifications.
- **Icons:** Powered by `lucide-react`.

## 6. Future Considerations (per SPEC)
- As the Chrome Extension expands, the landing page could introduce visual cues or deep-links specifically prompting the installation.
- The warm accent color (amber/coral blend) mentioned in the spec could be introduced into the Hero "Save" button or primary links to align perfectly with the overarching brand direction.