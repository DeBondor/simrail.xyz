# Landing Page Redesign — Design Spec

**Date:** 2026-03-15
**Scope:** `src/app/page.tsx` only (surgical rewrite, no new files)

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

**Badge:** Iconly `Category` icon + "Open Source Tools" text, pill shape with `border-primary/45` and `bg-primary/8`

**Headline:** Two lines — `"The tools"` + gradient `"SimRail XYZ"`. Gradient animates `from-primary via-amber-500 to-primary` with `background-size: 200%` shift. Font: `font-black`, `tracking-tight`, `leading-[1.08]`.

**Description:** Same copy as current, `text-muted-foreground`, `max-w-[420px]`.

**CTA buttons:**
- Primary: `bg-primary` with `box-shadow: 0 4px 28px rgba(207,93,84,0.4)`, Iconly `Location` icon
- Outline: existing `variant="outline"` + `backdrop-blur-sm`, GitHub SVG logo (no Iconly equivalent)

**Screenshot:**
- Outer wrapper: `perspective-[1400px]`
- Browser frame: dark `#111116` background, traffic-light dots (red/amber/green), URL bar showing `simrail.xyz/route`
- `transform: rotateX(6deg)` on mount, eases to `rotateX(2deg)` on hover
- Fade overlay: `linear-gradient(to bottom, transparent, background)` at the bottom, `h-[140px]`, to blend into the tool cards section
- No glow under the screenshot

**Background:** Three animated glow orbs (primary, blue, purple) + `hero-grid` pattern with `mask-image` radial fade. Same as current but refined opacity values.

---

## Tool Cards Section

**Divider:** Minimal — gradient line + "TOOLS" label in `text-[10px] font-bold tracking-[0.22em] uppercase text-muted-foreground/40`

**Card changes from current:**
- Border: `rgba(255,255,255,0.045)` default → `rgba(207,93,84,0.28)` on hover
- `border-radius: 16px` (up from `rounded-xl`)
- Hover: `translateY(-4px)` + soft box-shadow + top-edge accent line (`::before` gradient)
- "Soon" cards: `opacity-45` (dimmed), `cursor-default`
- Icon containers: gradient background `from-primary/20 to-primary/4` for available, `from-primary/8 to-primary/2` for soon

**Iconly icons (bulk-style with opacity layer for depth):**
- Route Generator → `Location` (`set="bulk"`)
- Live Map → `Discovery` (`set="bulk"`)
- Timetable → `TimeCircle` (`set="bulk"`)
- Card chevron → `ArrowRight` (`set="light"`)

---

## Navbar Changes

- Replace `<div>` with "SR" text → `<Image src="/simrailxyz.svg" width={34} height={34} alt="SimRail XYZ" />`
- Iconly `Moon`/`Sun` for theme toggle (replaces Lucide)
- Iconly `Global` for language selector (replaces Lucide `Globe`)
- Keep existing sticky behaviour, backdrop-blur, border-bottom

---

## Footer Changes

- Add `<Image src="/simrailxyz.svg" width={26} height={26} />` before brand name
- Iconly `Heart` (filled, `primaryColor="#cf5d54"`) replaces Lucide `Heart`
- Iconly `Paper` (bulk) for license link
- Keep GitHub SVG logo (no Iconly equivalent)
- Footer accent line: `linear-gradient(90deg, transparent, rgba(207,93,84,0.18), transparent)`

---

## Dependencies

Install `react-iconly`:
```bash
npm install react-iconly
```

Add `public/simrailxyz.svg` — **already saved**.

---

## Files Changed

| File | Change |
|---|---|
| `src/app/page.tsx` | Full rewrite of `HomePage` component |
| `src/components/Navbar.tsx` | Icon swap + Iconly imports |
| `public/simrailxyz.svg` | New file — already created |
| `package.json` | Add `react-iconly` dependency |

---

## Out of Scope

- No new page sections (no features list, how-it-works, stats, gallery)
- No changes to `/route` page or any other page
- No layout.tsx changes
- No new component files
- Light mode is not redesigned (dark mode is the primary target; light mode inherits existing tokens)
