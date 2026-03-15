# Landing Page Redesign Implementation Plan

> **For agentic workers:** REQUIRED: Use superpowers:subagent-driven-development (if subagents available) or superpowers:executing-plans to implement this plan. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Redesign `src/app/page.tsx` and `src/components/Navbar.tsx` with a cinematic dark aesthetic, Iconly icons, the custom `simrailxyz.svg` logo, and a browser-framed Route Generator screenshot hero.

**Architecture:** Surgical rewrite of two existing files — no new files, no new components. All changes are purely presentational: icon swaps (Lucide → react-iconly), logo image (`<Image>` from `public/simrailxyz.svg`), hero restructured to add a perspective-tilted browser frame, and card hover states elevated.

**Tech Stack:** Next.js 16, Tailwind v4, `react-iconly@2.2.10`, `next/image`

**Spec:** `docs/superpowers/specs/2026-03-15-landing-page-redesign-design.md`

---

## File Map

| File | Action | Responsibility |
|---|---|---|
| `package.json` | Modify | Add `react-iconly` dependency |
| `src/components/Navbar.tsx` | Modify | Logo image + Iconly icon swaps |
| `src/app/page.tsx` | Modify | Hero section, ToolCard, footer |
| `public/simrailxyz.svg` | Already exists | Brand icon asset |
| `public/route-screenshot.png` | Create (manual capture) | Screenshot asset for hero frame |

---

## Chunk 1: Setup and Navbar

### Task 1: Install `react-iconly`

**Files:**
- Modify: `package.json`

- [ ] **Step 1: Install the package**

  ```bash
  cd C:/Users/debon/WebstormProjects/simrail.xyz
  npm install react-iconly
  ```

  Expected output: `added 1 package` (or similar). No errors.

- [ ] **Step 2: Verify it resolves**

  ```bash
  node -e "const r = require('react-iconly'); console.log(Object.keys(r).slice(0,5))"
  ```

  Expected: prints icon names like `[ 'Activity', 'AddUser', 'Arrow', ... ]`

- [ ] **Step 3: Commit**

  ```bash
  git add package.json package-lock.json
  git commit -m "chore: add react-iconly dependency"
  ```

---

### Task 2: Capture screenshot asset

**Files:**
- Create: `public/route-screenshot.png`

- [ ] **Step 1: Start the dev server**

  ```bash
  npm run dev
  ```

  Open `http://localhost:3000/route` in your browser.

- [ ] **Step 2: Capture a 1280×800 screenshot**

  Use your browser's DevTools device emulator or a screenshot tool. Save as `public/route-screenshot.png`.

  Verify the file exists:
  ```bash
  ls -lh public/route-screenshot.png
  ```

  Expected: file present, size > 100KB.

- [ ] **Step 3: Commit**

  ```bash
  git add public/route-screenshot.png
  git commit -m "assets: add route generator screenshot for hero"
  ```

---

### Task 3: Update `Navbar.tsx` — logo and Iconly icons

**Files:**
- Modify: `src/components/Navbar.tsx`

Current state of relevant imports (lines 1–13 of `Navbar.tsx`):
```tsx
import { Sun, Moon, Globe, Check } from "lucide-react";
```
Current logo (lines 47–50):
```tsx
<div className="w-8.5 h-8.5 bg-primary rounded-lg flex items-center justify-center text-base font-bold text-primary-foreground shrink-0">
  SR
</div>
```

- [ ] **Step 1: Update imports**

  Replace the import block at the top of `src/components/Navbar.tsx`:

  ```tsx
  // Before:
  import { Sun, Moon, Globe, Check } from "lucide-react";

  // After:
  import Image from "next/image";
  import { Sun, Moon, Global } from "react-iconly";
  import { Check } from "lucide-react";
  // Note: Image must be added here in Step 1, not deferred to Step 2.
  ```

- [ ] **Step 2: Replace logo element**

  Find and replace the logo `<div>` (the one with "SR" text):

  ```tsx
  // Before:
  <div className="w-8.5 h-8.5 bg-primary rounded-lg flex items-center justify-center text-base font-bold text-primary-foreground shrink-0">
    SR
  </div>

  // After:
  <Image src="/simrailxyz.svg" width={34} height={34} alt="SimRail XYZ" className="rounded-lg shrink-0" />
  ```

- [ ] **Step 3: Replace Moon/Sun icons in theme toggle**

  Find the theme toggle button content:
  ```tsx
  // Before:
  {isDark ? (
    <Sun className="h-4 w-4" />
  ) : (
    <Moon className="h-4 w-4" />
  )}

  // After:
  {isDark ? (
    <Sun set="light" primaryColor="currentColor" size={16} />
  ) : (
    <Moon set="light" primaryColor="currentColor" size={16} />
  )}
  ```

- [ ] **Step 4: Replace Globe icon in language selector**

  Find `<Globe className="h-3.5 w-3.5" />` and replace:
  ```tsx
  // Before:
  <Globe className="h-3.5 w-3.5" />

  // After:
  <Global set="light" primaryColor="currentColor" size={14} />
  ```

- [ ] **Step 5: Type-check**

  ```bash
  npx tsc --noEmit
  ```

  Expected: no errors.

  **If you see missing export errors**, verify exact names at runtime:
  ```bash
  node -e "const r=require('react-iconly'); console.log(Object.keys(r).filter(k=>k.match(/Global|Moon|Sun/i)))"
  ```
  Use the names returned (e.g. `Global2`, `Moon`, `Sun2`) and update the import accordingly.

- [ ] **Step 6: Lint**

  ```bash
  npm run lint
  ```

  Expected: no errors.

- [ ] **Step 7: Verify visually**

  With `npm run dev` running, open `http://localhost:3000`. Check:
  - Navbar shows the `simrailxyz.svg` icon (red rounded square with route logo) instead of "SR"
  - Moon/Sun toggle icons visible and correct
  - Globe → language picker icon looks like a globe

- [ ] **Step 8: Commit**

  ```bash
  git add src/components/Navbar.tsx
  git commit -m "feat: replace navbar logo and icons with simrailxyz.svg and react-iconly"
  ```

---

## Chunk 2: page.tsx — Hero, Cards, Footer

> **Prerequisite:** `react-iconly` must be installed and present in `package.json` before any step in this chunk. Verify with:
> ```bash
> node -e "require('react-iconly'); console.log('ok')"
> ```
> If this fails, complete Task 1 from Chunk 1 first.

### Task 4: Update hero section in `page.tsx`

**Files:**
- Modify: `src/app/page.tsx`

- [ ] **Step 1: Update imports at top of `page.tsx`**

  ```tsx
  // Before (lucide imports):
  import {
    MapPin,
    Heart,
    Map,
    ChevronRight,
    Layers,
    Github,
    Clock,
    Scale,
  } from "lucide-react";

  // After:
  import Image from "next/image";
  import { Github } from "lucide-react";
  import {
    Category,
    Location,
    Discovery,
    TimeCircle,
    ArrowRight2,
    Heart,
    Paper,
  } from "react-iconly";
  ```

  > **`Heart` naming collision:** Both lucide-react and react-iconly export a symbol named `Heart`. The Before import block has `Heart` from lucide; the After removes it from lucide and adds it from react-iconly. These two edits **must happen atomically in a single edit** — if you add the Iconly import without removing the lucide one first, both will be in scope and TypeScript may not error, but the wrong component will silently be used at the usage site in the footer. Apply the full import block replacement shown above as one operation.

- [ ] **Step 2: Replace hero badge icon**

  Find the `<Badge>` in the hero section (currently uses `<Layers className="h-3 w-3" />`):

  ```tsx
  // Before:
  <Badge
    variant="outline"
    className="gap-1.5 border-primary/60 text-primary bg-primary/10 px-3.5 py-1 text-xs font-bold tracking-widest uppercase backdrop-blur-sm"
  >
    <Layers className="h-3 w-3" />
    {t.heroBadge}
  </Badge>

  // After:
  <Badge
    variant="outline"
    className="gap-1.5 border-primary/60 text-primary bg-primary/10 px-3.5 py-1 text-xs font-bold tracking-widest uppercase backdrop-blur-sm"
  >
    <Category set="light" primaryColor="currentColor" size={13} />
    {t.heroBadge}
  </Badge>
  ```

- [ ] **Step 3: Replace Route Generator CTA button icon**

  Find the primary hero button (currently uses `<MapPin className="h-4 w-4" />`):

  ```tsx
  // Before:
  <Button asChild size="lg" className="gap-2">
    <Link href="/route">
      <MapPin className="h-4 w-4" />
      {t.heroRouteGen}
    </Link>
  </Button>

  // After:
  <Button asChild size="lg" className="gap-2">
    <Link href="/route">
      <Location set="light" primaryColor="currentColor" size={16} />
      {t.heroRouteGen}
    </Link>
  </Button>
  ```

- [ ] **Step 4: Add browser-framed screenshot below CTA buttons**

  > `animate-fade-in-up` is an **existing** animation class in `globals.css` — no new CSS is needed.

  After the closing `</div>` of the CTA buttons row (the one with `flex gap-3 flex-wrap justify-center mt-3`), and **before the closing `</section>` tag of the hero section**, add the screenshot frame. The full structure to add:

  ```tsx
  {/* Browser-framed screenshot */}
  <div
    className="animate-fade-in-up relative w-full max-w-[920px] mx-auto mt-4"
    style={{ "--delay": "400ms", perspective: "1400px" } as React.CSSProperties}
  >
    <div className="relative rounded-xl overflow-hidden border border-border/50 shadow-[0_40px_100px_rgba(0,0,0,0.8)] transition-transform duration-500 ease-out [transform:rotateX(6deg)] hover:[transform:rotateX(2deg)]">
      {/* Traffic-light bar */}
      <div className="flex items-center gap-1.5 px-3.5 py-2.5 bg-card border-b border-border">
        <span className="w-2.5 h-2.5 rounded-full bg-primary" />
        <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
        <span className="w-2.5 h-2.5 rounded-full bg-app-green" />
        <div className="flex-1 mx-2.5 h-5 rounded bg-background text-[10px] flex items-center justify-center text-muted-foreground/40 tracking-wide">
          simrail.xyz/route
        </div>
      </div>
      {/* Screenshot — replace placeholder with <Image> once route-screenshot.png exists */}
      <div className="h-[380px] bg-card flex items-center justify-center text-muted-foreground/20 text-xs tracking-widest uppercase">
        Screenshot coming soon
      </div>
    </div>
    {/* Fade into tool cards */}
    <div className="absolute bottom-0 left-0 right-0 h-36 bg-gradient-to-b from-transparent to-background pointer-events-none" />
  </div>
  ```

  > Once `public/route-screenshot.png` is saved, replace the placeholder `<div>` with:
  > ```tsx
  > <Image src="/route-screenshot.png" alt="Route Generator screenshot" width={1280} height={800} className="w-full h-auto block" />
  > ```

- [ ] **Step 5: Type-check**

  ```bash
  npx tsc --noEmit
  ```

  Expected: no errors.

- [ ] **Step 6: Verify visually**

  Check `http://localhost:3000`:
  - Hero badge shows the Category (grid) icon
  - Route Generator button shows the Location (pin) icon
  - Browser frame appears below CTAs with traffic-light dots and "Screenshot coming soon" placeholder
  - Frame has perspective tilt; tilts flatter on hover

- [ ] **Step 7: Commit**

  ```bash
  git add src/app/page.tsx
  git commit -m "feat: add browser-framed screenshot hero and iconly icons to hero section"
  ```

---

### Task 5: Update `ToolCard` — Iconly icons and elevated hover states

**Files:**
- Modify: `src/app/page.tsx` (the `ToolCard` component, lines ~21–118)

- [ ] **Step 1: Update `ToolCard` hover states and top-edge accent line**

  In the `ToolCard` component, find the inner card `<div>` with `glass-card`. Replace the **entire ternary expression** — both branches change:

  ```tsx
  // Before (full ternary — `group` appears in the available branch):
  className={`glass-card h-full rounded-xl py-0 relative overflow-hidden ${
    isAvailable
      ? "transition-all duration-300 hover:-translate-y-1 group"
      : "cursor-default"
  }`}

  // After (full ternary — `group` removed from both branches; opacity-45 added to unavailable):
  className={`glass-card h-full rounded-xl py-0 relative overflow-hidden ${
    isAvailable
      ? "transition-all duration-300 hover:-translate-y-[3px] hover:border-primary/30 group-hover:shadow-[0_16px_48px_rgba(0,0,0,0.45)]"
      : "cursor-default opacity-45"
  }`}
  ```

  > **Why `group-hover:` works here without `group` on this `<div>`:** `group-hover:*` responds to the nearest ancestor that has the `group` class — which is the `<Link>` wrapper added in Step 3. The shadow activates when the user hovers anywhere over the `<Link>`, which is the correct behavior. Removing `group` from the inner `<div>` does not break these classes.

- [ ] **Step 2: Replace existing top-line `<div>` with wider gradient**

  Find the existing top-edge accent line inside the card:
  ```tsx
  // Before:
  {isAvailable && (
    <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-primary to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
  )}

  // After:
  {isAvailable && (
    <div className="absolute top-0 left-[10%] right-[10%] h-px bg-gradient-to-r from-transparent via-primary/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
  )}
  ```

- [ ] **Step 3: Move `group` to the `<Link>` wrapper**

  Find the `return` statement at the bottom of `ToolCard`:
  ```tsx
  // Before:
  return href ? (
    <Link href={href} className="group">
      {card}
    </Link>
  ) : (
    <div>{card}</div>
  );

  // After (group stays on Link, already correct — just verify it's not also on the inner div):
  return href ? (
    <Link href={href} className="group block">
      {card}
    </Link>
  ) : (
    <div>{card}</div>
  );
  ```

- [ ] **Step 4: Update icon containers gradient**

  Find the icon container `<div>` inside the card:
  ```tsx
  // Before:
  className={`w-11 h-11 bg-gradient-to-br border rounded-lg flex items-center justify-center text-primary ${
    isAvailable
      ? "from-primary/25 to-primary/5 border-primary/30"
      : "from-primary/15 to-primary/5 border-primary/20 opacity-70"
  }`}

  // After:
  className={`w-11 h-11 bg-gradient-to-br border rounded-lg flex items-center justify-center text-primary ${
    isAvailable
      ? "from-primary/20 to-primary/5 border-primary/30"
      : "from-primary/[8%] to-primary/[2%] border-primary/20"
  }`}
  ```

- [ ] **Step 5: Replace card icons and chevron in `HomePage`**

  In the three `<ToolCard>` calls inside `HomePage`, update `icon` props:

  ```tsx
  // Route Generator:
  icon={<Location set="bulk" primaryColor="currentColor" size={22} />}

  // Live Map:
  icon={<Discovery set="bulk" primaryColor="currentColor" size={22} />}

  // Timetable:
  icon={<TimeCircle set="bulk" primaryColor="currentColor" size={22} />}
  ```

  In the `ToolCard` body, find `<ChevronRight>` and replace with the span-wrapped final state:
  ```tsx
  // Before:
  <ChevronRight className="h-4 w-4 text-muted-foreground group-hover:translate-x-1 group-hover:text-primary transition-all duration-300" />

  // After (span carries the transition classes so the slide effect is preserved):
  <span className="text-muted-foreground group-hover:translate-x-1 group-hover:text-primary transition-all duration-300 flex">
    <ArrowRight2 set="light" primaryColor="currentColor" size={18} />
  </span>
  ```

- [ ] **Step 6: Update divider label opacity**

  Find the divider `<span>` (currently `text-xs font-bold tracking-wider uppercase text-muted-foreground`):
  ```tsx
  // Before:
  <span className="text-xs font-bold tracking-wider uppercase text-muted-foreground whitespace-nowrap">

  // After:
  <span className="text-[10px] font-bold tracking-[0.22em] uppercase text-muted-foreground/40 whitespace-nowrap">
  ```

- [ ] **Step 7: Type-check**

  ```bash
  npx tsc --noEmit
  ```

  Expected: no errors.

- [ ] **Step 8: Verify visually**

  Check `http://localhost:3000`:
  - Route Generator card: Location (bulk) icon in icon box
  - Live Map card: Discovery icon, dimmed at 45% opacity
  - Timetable card: TimeCircle icon, dimmed at 45% opacity
  - Available card hover: lifts 3px, border goes slightly red, top edge accent line fades in, arrow icon slides right

- [ ] **Step 9: Commit**

  ```bash
  git add src/app/page.tsx
  git commit -m "feat: elevate tool cards with iconly icons and enhanced hover states"
  ```

---

### Task 6: Update footer in `page.tsx`

**Files:**
- Modify: `src/app/page.tsx` (footer section, lines ~227–274)

- [ ] **Step 1: Add logo image to footer brand**

  Find the footer brand section:
  ```tsx
  // Before:
  <div className="flex items-center gap-3">
    <span className="text-sm font-bold tracking-widest uppercase">
      <span className="text-primary">SimRail</span> XYZ
    </span>

  // After (`rounded-md` is a plan-level addition — not in the spec. Intentionally different from the Navbar image which uses `rounded-lg`; the smaller footer icon looks better with a tighter radius):
  <div className="flex items-center gap-3">
    <Image src="/simrailxyz.svg" width={26} height={26} alt="" className="rounded-md" />
    <span className="text-sm font-bold tracking-widest uppercase">
      <span className="text-primary">SimRail</span> XYZ
    </span>
  ```

- [ ] **Step 2: Replace Heart icon**

  Find `<Heart className="inline h-3 w-3 text-primary align-[-1px]" fill="currentColor" />`:

  ```tsx
  // Before:
  <Heart className="inline h-3 w-3 text-primary align-[-1px]" fill="currentColor" />

  // After:
  <Heart set="bold" primaryColor="#cf5d54" size={12} />
  ```

- [ ] **Step 3: Replace Scale icon**

  Find `<Scale className="h-3.5 w-3.5" />`:

  ```tsx
  // Before:
  <Scale className="h-3.5 w-3.5" />

  // After:
  <Paper set="bulk" primaryColor="currentColor" size={13} />
  ```

- [ ] **Step 4: Type-check**

  ```bash
  npx tsc --noEmit
  ```

  Expected: no errors.

- [ ] **Step 5: Lint**

  ```bash
  npm run lint
  ```

  Expected: no errors. Fix any unused import warnings (e.g. if `Scale` or `Heart` still appear in imports from lucide-react).

- [ ] **Step 6: Production build check**

  ```bash
  npm run build
  ```

  Expected: `✓ Compiled successfully`. No errors. (Warnings about image optimization for `simrailxyz.svg` are acceptable.)

- [ ] **Step 7: Verify visually**

  Check `http://localhost:3000`:
  - Footer: `simrailxyz.svg` icon appears left of "SimRail XYZ" brand name
  - Heart icon is the Iconly bold style (filled, red)
  - License link shows the Paper (document) icon

- [ ] **Step 8: Final commit**

  ```bash
  git add src/app/page.tsx
  git commit -m "feat: update footer with simrailxyz logo and iconly icons"
  ```

---

## Post-Implementation: Activate Screenshot

Once `public/route-screenshot.png` is captured:

- [ ] In `src/app/page.tsx`, inside the browser frame, replace:
  ```tsx
  <div className="h-[380px] bg-card flex items-center justify-center text-muted-foreground/20 text-xs tracking-widest uppercase">
    Screenshot coming soon
  </div>
  ```
  with:
  ```tsx
  <Image src="/route-screenshot.png" alt="Route Generator screenshot" width={1280} height={800} className="w-full h-auto block" />
  ```

- [ ] Build check: `npm run build`
- [ ] Commit: `git commit -m "feat: activate route generator screenshot in hero frame"`
