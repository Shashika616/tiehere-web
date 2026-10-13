# TieHere, brand website

A standalone Next.js site. **It shares no code with `Professional-Meetups-Monolith`** and nothing
in that repo was modified to build it. The only things that cross over are brand facts: the mark's
two colours, and the product copy in `content/site.ts`.

```bash
npm install
npm run dev     # http://localhost:4321
npm run build
```

## The idea

One continuous shot. A field of scattered people becomes a city, becomes seven reasons to meet,
becomes a trust ladder, goes completely still for safety, and finally locks into the TieHere mark.

There is **no video file**. The background is a single `<canvas>` generating every frame from
scroll position (`components/motion/CinematicFilm.tsx` + `lib/formations.ts`), which is why a
five-chapter cinematic background costs no bytes and can never buffer-stall.

Chapters are not hardcoded to scroll percentages. Sections carry `data-film="<formation>"` and the
film measures where those sections actually are, so editing copy cannot desync the picture from
the words. Sections *without* the attribute are deliberate cross-dissolves between chapters.

| Formation | Section | What it shows |
|---|---|---|
| `cloud` | Hero | A thousand people, scattered, drifting |
| `sparse` | Problem | 85% thrown out of frame, the forty you actually met |
| `city` | Proximity | The cloud falls onto a ground plane: a city at a low angle |
| `fan` | Intents | Seven arms from one centre, one per intent |
| `ladder` | Trust | Four bands, grey at the bottom, green at the top |
| `quiet` | Safety | Ground turns to paper, particles stop |
| `settle` | FAQ | Back to dark before the questions start |
| `knot` | Final CTA | Every particle lands on the mark's lemniscate |

## Imagery

All photography is **CC0 / public domain**: free for commercial use, no attribution, no
watermarks. Sourced through the [Openverse](https://openverse.org) API filtered to **StockSnap**,
then downsized and re-encoded locally. Provenance is in [IMAGE-CREDITS.md](IMAGE-CREDITS.md).

**No identifiable faces, deliberately.** CC0 waives the photographer's copyright, not the
personality rights of the people pictured, and a likeness used in advertising is governed
separately. Every image carries human presence another way: hands, a handshake, a figure from
behind, a crowd in silhouette. Keep that rule when replacing any of them.

- `public/intents/` : seven carousel photographs, one per intent.
- `public/scenes/` : three full-bleed scroll chapters.

Three photographic cuts punctuate the scroll, and they carry the argument rather than decorating
it: a lone figure on a street before *"You know a thousand people. You've met forty."*, a red
umbrella in neon rain before *"Here is not a metaphor."*, and a small lit bar before the trust
ladder. They are **framed insets, never full-bleed**, so the canvas film stays visible around
them and photography never replaces the thing that gives the site its identity. Each is scrubbed
by scroll: the frame scales and fades up as it enters while the picture inside drifts against the
page, which is what makes a still photograph read as footage.

Cards sit at `saturate .62 / brightness .72` with an 18% blue-green tint and return to full
colour on hover. That hover is the card coming alive under the pointer.

The sources are landscape and the cards are portrait, so `object-cover` scales by height and only
the **horizontal** value of `focus` in `content/site.ts` has any effect.

**When swapping images**, clear `.next/dev/cache/images` or the dev server keeps serving the old
optimised derivatives under the same filenames.

## Deliberate decisions

- **The safety chapter does not move.** No parallax, no pinning, no drift, and the only light
  ground on the site. After four screens of motion, stillness is the loudest thing the page can do,
  and on this subject "look at our animation" is the wrong signal.
- **No GSAP, no ScrollTrigger.** Every scroll-driven element reads its own `getBoundingClientRect`
  in its own rAF loop. That removed ~46 KB gz and, more importantly, removed the scroller-proxy /
  pin desync that is the most fragile thing in this genre of site.
- **Line reveals, never per-character.** The reference site ships ~1,184 single-letter spans. The
  full string stays in one accessible node here; only visual wrappers are split.
- **Lenis is off on touch and under reduced motion.** Native momentum beats emulated momentum.
- **Two saturated colours, ever.** Brand blue and brand green, identical in both themes, the app's
  palette file is explicit that a brand colour which shifts with the theme is not a brand colour.
- **No eyebrows above headings, anywhere.** Every heading carries itself. The hero had a pill
  reading "professional meetups, in person"; it was deleted rather than restyled.
- **No em dashes in any copy.**
- **Store marks are authored SVG**, not bitmap badges or glyphs, so they stay crisp and inherit
  `currentColor`. Confirm the lockups against Apple's and Google's badge guidelines before launch.

## The brand flight

The wordmark starts at hero scale and flies into the navigation as you leave the first screen.
It is **one element**, not two that cross-fade: `components/motion/BrandFlight.tsx` renders a
single fixed copy and scrubs it from the hero lockup's measured position and size to the nav
lockup's. `components/ui/Lockup.tsx` is shared by all three copies so they cannot drift apart.

`node scripts/check-brand-flight.mjs` is the regression check. Three things took measuring:

- The natural gap between the two lockups is only ~100px, so the flight finished in a flick of
  the wheel. Travel is floored at half a viewport.
- The handover is driven by **raw** progress, not the eased value. An ease approaches 1
  asymptotically, so a window expressed in eased terms stretches over hundreds of pixels.
- The per-frame early exit must be gated on **both** the eased value and the handover. Guarding
  on the eased value alone froze the crossfade: the ease rounds to 1 at about p = 0.92, every
  later frame bailed out, and the two copies stayed half-faded on top of each other for the rest
  of the page. Fast scrolling skipped straight past it, so it only appeared when scrolling slowly.
- `(1 - 0.9) / 0.1` is `0.9999999999999998`, so the "landed, remove the flyer" branch needs a
  tolerance rather than an exact `>= 1`, or it never fires.

The wordmark carries the mark's own two colours, solid, never a gradient. Brand blue is 4.5:1 on
the dark ground, which clears AA but only just, and **fails** on the light safety chapter (3.9:1),
so that chapter gets darker variants of both.

## Navigation states

Three states, because "which one am I on" and "which one am I about to click" are different
questions and colour alone cannot separate them:

- **rest** — 82% white, no rule
- **hover / pointer-down** — full white, a white rule draws in from the left
- **current section** — full white, the rule stays and turns brand green
- **keyboard focus** — the rule turns brand blue, and the default focus ring is suppressed
  because the rule is already the affordance

The current section comes from an `IntersectionObserver` reading a thin band across the middle of
the viewport, so exactly one section qualifies at a time. In the gaps between tracked sections (a
photographic chapter, say) the last one stays lit, which is what a reader expects of a progress
indicator. Weight never changes between states, so nothing reflows. On mobile the overlay uses a
green dot rather than an underline, which would be lost under a 2.5rem heading.

## Reduced motion

A real implementation, not a checkbox: Lenis off, the horizontal chapter becomes a plain stack
(page height drops 15.0k → 11.2k px), all scroll-scrub replaced by static end states, particle
drift stops. Verify with `node scripts/shoot.mjs --reduced`.

## Screenshots

`scripts/shoot.mjs` drives the real page in system Chrome and captures it at each section, since
the canvas cannot be reviewed from markup. Dev-only.

```bash
node scripts/shoot.mjs              # desktop 1440×900 @2x → .shots/
node scripts/shoot.mjs --mobile     # 390×844
node scripts/shoot.mjs --reduced    # prefers-reduced-motion
```

## Performance

Jank here was measured, not guessed. `node scripts/perf.mjs` drives a full scroll in real Chrome
and reports layout-forcing reads per frame, rAF loop count, and script/style/layout time.
Headless reports a locked 60fps whatever you do, so frame rate alone tells you nothing.

Four things were wrong, and the measured effect of fixing them:

| | Before | After |
|---|---|---|
| rAF callbacks over a scroll | 2898 | ~600 |
| Script time | 0.367 s | **0.180 s** |
| Total task time | 0.665 s | **0.470 s** |
| Style recalcs | 547 | 411 |

Both figures are at full 60fps. An earlier pass halved the film's frame rate, which read as
judder against 60fps scrolling; it was reverted and the cost taken out of each frame instead.

1. **Every scroll-driven component ran its own rAF loop** and read
   `getBoundingClientRect()` immediately before writing a style. `lib/ticker.ts` is now one loop
   for the whole page with a read phase and a write phase, so layout is computed once and every
   subscriber reads the same clean frame. Lenis runs at order 0 so scroll position has settled
   first.
2. **The film drew 1180 individual `arc()` + `fill()` calls**, each allocating an `rgba()` string.
   Formations draw from a handful of colours, so particles are now bucketed by colour pair and
   quantised alpha (12 steps) via a counting sort into preallocated typed arrays: tens of fills
   per frame instead of 1180, with no per-frame allocation.
3. **The bloom and vignette were radial gradients re-evaluated across ~3M pixels, twice a frame.**
   A gradient `fillRect` computes the ramp per pixel. Both are now baked into bitmaps once per
   resize and blitted with `drawImage`, tinted with `globalAlpha`.
4. **The canvas is a full-viewport texture upload on every repaint.** Capped at 1.25x device
   pixels (soft dots; indistinguishable from 2x) with the particle count trimmed to 860.
5. **Lenis was damped to `lerp: 0.09`**, a ~200ms trail behind the wheel. That is not smoothness,
   it is input lag, and it was most of what "laggy" actually meant. Now `0.16`, with the pinned
   track and the scenes tightened to match.
6. **The brand flight wrote a CSS custom property on `:root` every frame**, which invalidates
   style for the entire document subtree. It writes `style.opacity` on the one element instead.

Also: style writes are guarded so an unchanged frame costs no recalc; the card tint is a plain
translucent gradient rather than `mix-blend-mode`, because a blend group on each of seven cards
is something the compositor re-resolves every frame while the track scrubs; and the header's
backdrop blur went from 24px to 12px behind a slightly more opaque ground.

## Budget

Currently **185 KB gz** of JS for the whole site (budget: 220 KB). Runtime dependencies are
`lenis`, `next`, `react`, `react-dom`: that is the entire list.

## Before launch

- [ ] Real store links in `components/ui/StoreButtons.tsx` (currently `href="#"`)
- [ ] Legal review of `/privacy`, `/terms`, `/delete-account`, each has `TODO` markers
- [ ] Support/privacy contact addresses (same `TODO` markers)
- [ ] `generateMetadata` OG image, deep links / Universal Links, analytics
- [ ] Decide on proof numbers (see PLAN.md §6.2), real ones or none
