# Landing Page Redesign — Design Spec

**Date:** 2026-03-15
**Scope:** `src/app/page.tsx` and `src/components/Navbar.tsx` (surgical rewrites, no new files)

---

## Overview

Redesign the SimRail XYZ landing page with a cinematic dark aesthetic, adding a browser-framed Route Generator screenshot hero and elevated tool cards. The design is inspired by the Route Generator's visual language.

---

## Design Decisions

| Decision | Choice | Rationale |
|---|---|---|
| Direction | Cinematic Dark | Premium, high-contrast feel matching the dark UI of the Route Generator |
| Hero visual | Browser-framed app screenshot | Shows the product immediately; familiar SaaS pattern (Linear, Vercel) |
| Hero layout | Centered text → perspective screenshot below | Clean hierarchy; screenshot anchors the section without competing with the headline |
| Sections | Keep minimal | Improve existing: Hero → Tool Cards → Footer. No new sections. |
| Icon | `public/simrailxyz.svg` via Next.js `<Image>` | Custom brand icon replaces the "SR" text box in navbar and footer |
| Icons (UI) | `react-iconly` (named imports) | Rounded, 1.5px stroke, distinctive aesthetic vs Lucide's thinner style |

---

## Hero Section

**Structure:** Badge → Headline → Description → CTA buttons → Browser-framed screenshot

### Badge
Iconly `Category` icon + "Open Source Tools" text, pill shape. Use existing badge classes: `border-primary/60 bg-primary/10 text-primary`.

### Headline
Two lines — `"The tools"` + gradient `"SimRail XYZ"`. Gradient animates `from-primary via-amber-500 to-primary` with `background-size: 200%` (already exists in globals as `animate-gradient-shift`). Font: `font-bold`, `tracking-tight`, `leading-tight`.

### Description
Same copy as current. `text-muted-foreground max-w-xl`.

### CTA Buttons
- Primary: `<Button size="lg">` with Iconly `Location` icon (`set="light"`, `primaryColor="currentColor"`, `size={16}`)
- Outline: existing `variant="outline" size="lg"` + `backdrop-blur-sm`, GitHub SVG logo (Iconly has no GitHub icon — keep the existing Lucide `Github` icon here)

### Browser-Framed Screenshot

**Screenshot asset:** The developer must capture a PNG screenshot of the Route Generator (`/route`) and save it to `public/route-screenshot.png` before implementing this component. Recommended dimensions: 1280×800px. Use `<Image src="/route-screenshot.png" alt="Route Generator screenshot" width={1280} height={800} className="w-full h-auto" />` inside the frame.

**Interim / missing-image fallback:** Until the screenshot is captured, render a placeholder inside the frame body: `<div className="h-[380px] bg-card flex items-center justify-center text-muted-foreground/20 text-xs tracking-widest uppercase">Screenshot coming soon</div>`. Replace with `<Image>` once the asset exists.

**Frame structure (JSX):**
```tsx
<div className="relative w-full max-w-[920px] mx-auto" style={{ perspective: "1400px" }}>
  <div className="relative rounded-xl overflow-hidden border border-border/50 shadow-[0_40px_100px_rgba(0,0,0,0.8)] transition-transform duration-500 ease-out [transform:rotateX(6deg)] hover:[transform:rotateX(2deg)]">
    {/* Traffic-light bar */}
    <div className="flex items-center gap-1.5 px-3.5 py-2.5 bg-card border-b border-border">
      <span className="w-2.5 h-2.5 rounded-full bg-primary" />
      <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
      <span className="w-2.5 h-2.5 rounded-full bg-app-green" /> {/* bg-app-green: existing theme token defined as --color-app-green in globals.css */}
      <div className="flex-1 mx-2.5 h-5 rounded bg-background text-[10px] flex items-center justify-center text-muted-foreground/40 tracking-wide">
        simrail.xyz/route
      </div>
    </div>
    {/* Screenshot */}
    <Image src="/route-screenshot.png" alt="Route Generator screenshot" width={1280} height={800} className="w-full h-auto block" />
  </div>
  {/* Bottom fade into tool cards section */}
  <div className="absolute bottom-0 left-0 right-0 h-36 bg-gradient-to-b from-transparent to-background pointer-events-none" />
</div>
```

> **Note on `rotateX`:** Use inline CSS via Tailwind arbitrary variant `[transform:rotateX(6deg)]` and `hover:[transform:rotateX(2deg)]` with `transition-transform duration-500`. No JS state needed — pure CSS transition on hover.

> **Note on `perspective`:** Tailwind v4 does not ship `perspective-*` utilities. Use `style={{ perspective: "1400px" }}` as an inline style on the outer wrapper.

### Background
Three animated glow orbs + `hero-grid` class. Reuse existing `animate-pulse-glow` and `animate-float` animations and the `hero-grid` CSS class from `globals.css`. No new CSS needed.

---

## Tool Cards Section

### Divider
Replace current divider with: gradient line + label in `text-[10px] font-bold tracking-[0.22em] uppercase text-muted-foreground/40`.

### Card Upgrades (update existing `ToolCard` component in `page.tsx`)

**Available cards:**
- Hover border: add `hover:border-primary/30` transition
- Hover lift: `hover:-translate-y-1` (already exists) → increase to `hover:-translate-y-[3px]`
- Top-edge accent line: follow existing pattern — use an absolutely-positioned `<div>` (not `::before`):
  ```tsx
  {isAvailable && (
    <div className="absolute top-0 left-[10%] right-[10%] h-px bg-gradient-to-r from-transparent via-primary/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
  )}
  ```

> **`group` placement:** Place `group` on the `<Link>` wrapper (outermost element), not on the inner card `<div>`, so `group-hover:*` children respond to the full link target. The current code has `group` on both — consolidate to `<Link>` only.
- Hover shadow: add `group-hover:shadow-[0_16px_48px_rgba(0,0,0,0.45)]`

**"Soon" cards:** increase dim from current to `opacity-45`.

**Icon containers:** update gradient direction to `from-primary/20 to-primary/5` for available, `from-primary/[8%] to-primary/[2%]` for soon (arbitrary opacity — Tailwind v4 does not generate `/8` or `/2` as standard steps). Keep existing `border-primary/30` / `border-primary/20`.

### Iconly Icons

Install and import:
```bash
npm install react-iconly
```
```tsx
import { Category, Location, Discovery, TimeCircle, ArrowRight2 } from "react-iconly"
import Image from "next/image" // add to page.tsx imports
```

> **Verified export names** (react-iconly v2.2.10): `Location`, `Discovery`, `TimeCircle`, `ArrowRight2`. Use `set="bulk"` for card icons (adds opacity-layered depth), `set="light"` for the chevron.

Usage in `ToolCard`:
```tsx
// Route Generator
<Location set="bulk" primaryColor="currentColor" size={22} />
// Live Map
<Discovery set="bulk" primaryColor="currentColor" size={22} />
// Timetable
<TimeCircle set="bulk" primaryColor="currentColor" size={22} />
// Chevron
<ArrowRight2 set="light" primaryColor="currentColor" size={18} />
```

Replace `MapPin`, `Map`, `Clock`, `ChevronRight`, `Layers` imports from `lucide-react` in `page.tsx`. (`Layers` is used for the hero badge and is replaced by `Category` from react-iconly.)

---

## Navbar Changes (`src/components/Navbar.tsx`)

- Replace logo `<div>` → `<Image src="/simrailxyz.svg" width={34} height={34} alt="SimRail XYZ" className="rounded-lg" />`
- Replace Lucide `Moon`/`Sun` → Iconly `Moon` / `Sun` (`set="light"`, `primaryColor="currentColor"`, `size={16}`)
- Replace Lucide `Globe` → Iconly `Global` (`set="light"`, `primaryColor="currentColor"`, `size={14}`)
- Keep existing `Check` from Lucide for the language selector checkmark (Iconly has no direct equivalent)

```tsx
import Image from "next/image" // add to Navbar.tsx imports
import { Moon, Sun, Global } from "react-iconly"
// Remove from lucide-react: Sun, Moon, Globe
// Keep from lucide-react: Check
```

---

## Footer Changes (`src/app/page.tsx`)

- Add `<Image src="/simrailxyz.svg" width={26} height={26} alt="" />` (empty alt — decorative, brand name follows immediately)
- Replace Lucide `Heart` → Iconly `Heart` filled: `<Heart set="bold" primaryColor="#cf5d54" size={12} />`
- Replace Lucide `Scale` → Iconly `Paper` (`set="bulk"`, `primaryColor="currentColor"`, `size={13}`)
- Keep Lucide `Github` (no Iconly equivalent)
- Keep existing footer accent line (already present in current code — no change needed)

```tsx
import { Heart, Paper } from "react-iconly"
// Remove from lucide-react: Heart, Scale
// Keep from lucide-react: Github
```

---

## Dependencies

```bash
npm install react-iconly
```

`public/simrailxyz.svg` — **already saved**.
`public/route-screenshot.png` — **must be captured by developer** before screenshot component renders correctly.

---

## Files Changed

| File | Change |
|---|---|
| `src/app/page.tsx` | Rewrite `HomePage` + update `ToolCard` component |
| `src/components/Navbar.tsx` | Icon swaps + logo image |
| `public/simrailxyz.svg` | Already created |
| `public/route-screenshot.png` | Developer must capture and export |
| `package.json` | Add `react-iconly` |

---

## Out of Scope

- No new page sections (no features list, how-it-works, stats, gallery)
- No changes to `/route` page or any other page
- No `layout.tsx` changes
- No new component files
- Light mode not redesigned (inherits existing tokens; dark mode is primary target)
