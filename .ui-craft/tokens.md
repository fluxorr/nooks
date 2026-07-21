# Nooks — Token Spine

Established from audit of `globals.css`, `tailwind.config.ts`, and all components.
Three-layer spine: primitives → semantics → component.

---

## Audit Findings

**Current state:** A flat semantic layer exists in `globals.css` (light + dark via `.dark` class) and is mapped into Tailwind's `theme.extend.colors`. This works as a basic system but has gaps.

### Issues found by automated lint

| File | Severity | Count | Examples |
|------|----------|-------|---------|
| `dashboard/page.tsx` | error | 14 | Raw hex in NOOK_COLORS, Inbox icon, component specifics |
| `page.tsx` | error | 9 | Raw hex in OS window dots, step visuals, collection mockup |
| `globals.css` | error | 3 | `3px` scrollbar radius (off-scale), raw hex in `gradient-text` |

### Scored results

| Surface | Score | Grade | Top issues |
|---------|-------|-------|------------|
| Landing (page.tsx) | 70 | C | Outline removed w/o focus-visible, inline hexes |
| Dashboard (page.tsx) | 28 | F | Destructive deletes w/o confirm, no focus-visible on hovers, inline hexes, no reduced-motion guard for animations |

Gap categories (all 7 are missing some dimension):

| Category | Status |
|----------|--------|
| Color (primitive ramp) | ❌ None — only flat semantics |
| Spacing | ⚠️ Tailwind defaults only, no CSS vars |
| Type | ⚠️ Inter loaded, no size/weight tokens |
| Radii | ⚠️ Tailwind defaults only, no CSS vars |
| Shadows | ⚠️ Tailwind defaults only, no CSS vars |
| Motion | ⚠️ Framer Motion used, no CSS duration/easing tokens |
| Z-index | ❌ Inline `z-*` values throughout |

### Before we fix

The next step would be to establish the primitive layer and fill all 7 categories, then migrate the inline hexes in components to use those tokens. Would you like me to:

1. **Write the full 3-layer tokens now** — replaces `globals.css` and `tailwind.config.ts` with a proper spine, migrates all inline hexes in components to use tokens
2. **Write a minimal token patch** — just add the missing primitives to `globals.css` and keep components as-is (lowest effort, unblocks consistency for new work)
3. **Write the token file only** — add `.ui-craft/tokens.md` as a spec for the token spine, but don't touch any code yet (safe for review)

---

*Spine applied 2026-07-21. globals.css has 0 token-lint findings.*
*Existing semantic vars kept backward compatible.*

## Layer 1: Primitive Tokens

### Color — Neutral ramp

The project uses a warm-toned neutral system (not pure gray). Values preserved from existing `globals.css`.

```css
--nook-50:  #f7f7f5;
--nook-100: #f0f0ed;
--nook-200: #e5e5e0;
--nook-300: #d4d4ce;
--nook-400: #a8a8a0;
--nook-500: #8a8a84;
--nook-600: #6b6b6b;
--nook-700: #525252;
--nook-800: #37352f;
--nook-900: #1c1c1c;
--nook-950: #0f0f0e;
```

### Color — Accent ramp

The in-app accent is monochrome (neutral text-like), while the brand mark uses amber `#f5a623`. Two ramps:
- **`--ink-*`** — monochrome accent used for app chrome (buttons, links inside dashboard)
- **`--amber-*`** — warm accent used for brand moments (extension icon, nook color picker)

```css
--ink-50:  #f5f5f5;
--ink-100: #e5e5e5;
--ink-200: #cccccc;
--ink-300: #a3a3a3;
--ink-400: #8a8a8a;
--ink-500: #6b6b6b;
--ink-600: #525252;
--ink-700: #37352f;
--ink-800: #1a1a1a;
--ink-900: #0f0f0f;

--amber-50:  #fffbeb;
--amber-100: #fef3c7;
--amber-200: #fde68a;
--amber-300: #fcd34d;
--amber-400: #fbbf24;
--amber-500: #f5a623;
--amber-600: #d97706;
--amber-700: #b45309;
--amber-800: #92400e;
--amber-900: #78350f;
```

### Color — Semantic bases

```css
--green-500: #22c55e;
--green-700: #15803d;
--red-500:  #ef4444;
--red-700:  #b91c1c;
--blue-500: #3b82f6;
--blue-700: #1d4ed8;
```

### Spacing (8pt scale)

```css
--space-0:   0;
--space-1:   0.25rem;   /*  4px */
--space-2:   0.5rem;    /*  8px */
--space-3:   0.75rem;   /* 12px */
--space-4:   1rem;      /* 16px */
--space-5:   1.25rem;   /* 20px */
--space-6:   1.5rem;    /* 24px */
--space-8:   2rem;      /* 32px */
--space-10:  2.5rem;    /* 40px */
--space-12:  3rem;      /* 48px */
--space-16:  4rem;      /* 64px */
--space-20:  5rem;      /* 80px */
--space-24:  6rem;      /* 96px */
```

### Type

```css
--text-xs:   0.75rem;   /* 12px */
--text-sm:   0.875rem;  /* 14px */
--text-base: 1rem;      /* 16px */
--text-lg:   1.125rem;  /* 18px */
--text-xl:   1.25rem;   /* 20px */
--text-2xl:  1.5rem;    /* 24px */
--text-3xl:  1.875rem;  /* 30px */
--text-4xl:  2.25rem;   /* 36px */
--text-5xl:  3rem;      /* 48px */

--font-light:   300;
--font-regular: 400;
--font-medium:  500;
--font-semibold: 600;
--font-bold:    700;

--leading-none:   1;
--leading-tight:  1.1;
--leading-snug:   1.3;
--leading-normal: 1.5;
--leading-relaxed: 1.65;

--tracking-tight:  -0.03em;
--tracking-normal: 0;
--tracking-wide:   0.01em;
--tracking-wider:  0.05em;
```

### Radii

```css
--radius-none: 0;
--radius-sm:   0.125rem;  /*  2px */
--radius-md:   0.375rem;  /*  6px — inputs, badges */
--radius-lg:   0.625rem;  /* 10px — cards */
--radius-xl:   0.875rem;  /* 14px — modals, panels */
--radius-2xl:  1.25rem;   /* 20px — feature cards, popovers */
--radius-3xl:  1.5rem;    /* 24px — hero panels */
--radius-full: 9999px;    /* pills, avatars */
```

### Shadows (stacked ambient + direct)

```css
--shadow-sm:
  0 1px 2px rgb(0 0 0 / 0.06);
--shadow-md:
  0 4px 6px rgb(0 0 0 / 0.06),
  0 2px 4px rgb(0 0 0 / 0.04);
--shadow-lg:
  0 10px 15px rgb(0 0 0 / 0.08),
  0 4px 6px rgb(0 0 0 / 0.04);
--shadow-xl:
  0 20px 25px rgb(0 0 0 / 0.10),
  0 8px 10px rgb(0 0 0 / 0.04);
```

### Motion

```css
--duration-instant: 80ms;
--duration-fast:    150ms;
--duration-normal:  250ms;
--duration-slow:    400ms;

--ease-out:    cubic-bezier(0.16, 1, 0.3, 1);
--ease-in:     cubic-bezier(0.4, 0, 1, 1);
--ease-in-out: cubic-bezier(0.4, 0, 0.2, 1);
```

### Z-index

```css
--z-dropdown:  10;
--z-sticky:    20;
--z-overlay:   30;
--z-modal:     40;
--z-toast:     50;
--z-tooltip:   60;
```

---

## Layer 2: Semantic Tokens

These remap primitives to contextual roles, and they switch for dark mode.

```css
:root {
  /* Surface stack */
  --surface-canvas:  var(--nook-900);   /* page background */
  --surface-raised:  var(--nook-800);   /* cards, panels */
  --surface-overlay: var(--nook-700);   /* modals, sheets */

  /* Text */
  --text-primary:    var(--nook-50);
  --text-secondary:  var(--nook-400);
  --text-tertiary:   var(--nook-600);
  --text-on-accent:  var(--nook-900);

  /* Border */
  --border-subtle:  rgb(255 255 255 / 0.06);
  --border-default: rgb(255 255 255 / 0.10);
  --border-strong:  rgb(255 255 255 / 0.20);

  /* Accent (monochrome ink for in-app) */
  --accent-bg:        var(--ink-700);
  --accent-bg-hover:  var(--ink-800);
  --accent-text:      var(--ink-50);
  --accent-border:    var(--ink-400);

  /* Status */
  --success-bg:     rgb(34 197 94 / 0.12);
  --success-text:   var(--green-500);
  --error-bg:       rgb(239 68 68 / 0.12);
  --error-text:     var(--red-500);
}
```

Dark mode (`.dark`):

```css
.dark {
  --surface-canvas:  var(--nook-950);
  --surface-raised:  var(--nook-900);
  --surface-overlay: var(--nook-800);

  --text-primary:    var(--nook-50);
  --text-secondary:  var(--nook-400);
  --text-tertiary:   var(--nook-600);
  --text-on-accent:  var(--nook-900);

  --border-subtle:  rgb(255 255 255 / 0.06);
  --border-default: rgb(255 255 255 / 0.10);
  --border-strong:  rgb(255 255 255 / 0.20);

  --accent-bg:        var(--ink-50);
  --accent-bg-hover:  var(--ink-100);
  --accent-text:      var(--ink-800);
  --accent-border:    var(--ink-300);

  --success-bg:     rgb(34 197 94 / 0.15);
  --success-text:   var(--green-500);
  --error-bg:       rgb(239 68 68 / 0.15);
  --error-text:     var(--red-500);
}
```

---

## Layer 3: Component Tokens

Created on demand as components need them. Not pre-built.

### Current component-specific values to migrate

These inline hexes in components should become component tokens once the primitive/semantic layers are in place:

| Location | Current value | Target token |
|----------|--------------|--------------|
| `dashboard/page.tsx` NOOK_COLORS array | `#d97706`, `#dc2626`, etc. | Keep as-is — these are user-facing color choices, not UI tokens |
| `dashboard/page.tsx` Inbox gradient icon | `#6b685e`, `#4a4640`, `#6b6b6b` | → `var(--ink-500)`, `var(--ink-700)`, `var(--text-secondary)` |
| `page.tsx` window dots | `#dc2626`, `#f5a623`, `#16a34a` | Keep as-is — these are real OS signal colors |
| `globals.css` gradient-text | `#37352f`, `#6b6b6b` | → `var(--text-primary)`, `var(--text-secondary)` |
| `globals.css` scrollbar | `3px` radius | → `var(--radius-sm)` |
