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
- `public/steps/` : three full-bleed panels for "How it works".

Three photographic cuts punctuate the scroll, and they carry the argument rather than decorating
it: a lone figure on a street before *"You know a thousand people. You've met forty."*, a red
umbrella in neon rain before *"Here is not a metaphor."*, and a small lit bar **after** the trust
ladder, where *"A place, an hour, and one person who said yes"* reads as the payoff for having
climbed it. That third one used to sit directly after the stacking panels, where a framed inset
following three full-bleed screens read as an anticlimax. They are **framed insets, never full-bleed**, so the canvas film stays visible around
them and photography never replaces the thing that gives the site its identity. Each is scrubbed
by scroll: the frame scales and fades up as it enters while the picture inside drifts against the
page, which is what makes a still photograph read as footage.

Cards sit at `saturate .62 / brightness .72` with an 18% blue-green tint and return to full
colour on hover. That hover is the card coming alive under the pointer.

The sources are landscape and the cards are portrait, so `object-cover` scales by height and only
the **horizontal** value of `focus` in `content/site.ts` has any effect.

**When swapping images**, clear `.next/dev/cache/images` or the dev server keeps serving the old
optimised derivatives under the same filenames.

## The word "verified"

**It may describe a credential. It may never describe a person.** A phone number can be verified.
An email can be verified. An employer can be verified. A human being cannot, because nothing the
product checks says anything about how someone will behave.

This is not pedantry. A "verified" badge on a person is an implied safety guarantee the product
cannot honour, and worse, it makes people drop a guard at exactly the moment they should keep it.
The site now says `Identity checked` and `Workplace checked` instead of `Verified person` and
`Verified professional`, and the safety chapter carries an explicit **What a check cannot do**
block rather than leaving the reader to infer the limits.

The app's own strings already got this right (`Phone verified`, `Company email verified`) in most
places. Two of them do not, and they live in the product rather than the marketing, which is where
the exposure actually is: **`GET VERIFIED`**, and the copy promising **"a verified badge other
members can see"** plus **"shared with verified members"**. Those are outside this repo and were
not changed.

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

## How it works: stacking panels

Three steps as full-bleed photographic panels that stack over one another, in the manner of a
studio's work index. The stacking is **pure CSS `position: sticky`**: each panel pins to the top
and the next, later in flow, scrolls up over it. No scroll listener, no per-frame transform, no
JavaScript in the effect at all. The compositor does the whole thing, which is the only honest
way to promise it never stutters.

It also fixed a real defect. The cards it replaced were translucent, so a covered card's body
text showed through the one on top and read as broken. A full-bleed photograph is opaque by
definition.

The one piece of JavaScript in the section is an optimisation rather than an effect: while the
stack covers the viewport the canvas film behind it cannot be seen, so `scrollState.covered`
tells the film to stop drawing. That is three screens of scrolling with zero canvas work. Under
reduced motion the panels become ordinary sequential sections instead of sliding over each other.

## The sign-off

The footer is not a slab under the page. The final CTA **pins** and the footer rises over it, the
same pure-CSS sticky stack the step panels use, which is why it needs an opaque ground: a
translucent surface sliding over a live section reads as a rendering bug.

One thing that is easy to get wrong here: a sticky element can only stick inside **its parent's
box**, and the CTA is the last child of `<main>` while the footer is a sibling of `<main>`. With
nothing below it inside its own parent, the CTA unstuck the instant it pinned and the footer just
followed underneath. `page.tsx` reserves a screen of travel after the CTA and the footer takes the
same height back as a negative margin, so the document is no taller. That margin is scoped with
`main:has([data-cta-travel]) + footer`, because the text pages share this footer and must not
inherit it.

Inside it: the wordmark at full scale, rising on a clip mask when the footer comes into view (one
transition per word, fired once by an observer, nothing per frame), and beside it the reader's own
city, UTC offset and a live local clock. The reference site uses that device to say where the
studio is; ours says where *you* are, because a place and a window are the only two things the
product ever asks for. It is read from `Intl`, so it needs no permission, no network and no API,
and the seconds are written to a text node through a ref rather than React state, which would
re-render the subtree and force a style recalc once a second.

## Where the page opens

It opens on the hero, and that took taking scroll restoration over by hand. Two independent
things were breaking it: the browser's `history.scrollRestoration` defaults to `auto`, so a reload
returned you to wherever you had scrolled, and the anchor handler used to write the section into
the URL, so any reload after clicking a nav tab opened on that tab and skipped the hero entirely.

`components/motion/ScrollEntry.tsx` sets restoration to `manual` and decides the entry itself:

| Entry | Lands on |
|---|---|
| Fresh load, or reload | The hero, always |
| Reload after clicking a nav tab | The hero |
| Pasted deep link (`/#safety`) | That section, offset for the header |
| Back or forward | The position saved for that page |

Switching restoration off alone was not enough, because then coming back from `/privacy` would
dump you at the top of a nineteen-thousand-pixel page instead of where you were reading. The
position is saved to `sessionStorage` on `pagehide` and restored only for a `back_forward`
navigation.

**Trade-off worth knowing:** clicking a nav tab no longer puts a `#section` in the URL, so you
cannot copy the address bar to link someone to a section. Deep links still work if someone has
one. `node scripts/check-scroll-entry.mjs` covers all seven cases.

## In-page navigation

Anchor clicks scroll smoothly, and neither path gave that for free: Lenis does not intercept
anchor clicks, and this stylesheet sets `scroll-behavior: auto` deliberately so Lenis and the
browser never drive the scroll at once. Every nav click was a hard jump.

`components/motion/SmoothAnchors.tsx` is one delegated listener covering the header, the mobile
overlay, the footer index and the bottom CTA bar. On pointer devices it hands the move to Lenis so
the easing matches the rest of the site, with the duration scaled by distance so a short hop does
not crawl and a full-document jump does not teleport. On touch, where Lenis is off by design, it
falls back to native smooth scrolling. Under reduced motion it lands instantly.

Four details that are easy to miss:

- It offsets by the **measured** header height, not a guessed constant.
- It scrolls to the target's **flow** position, so a pinned sticky section (the final CTA) still
  resolves correctly instead of to wherever it happens to be stuck.
- It releases the mobile overlay's body-scroll lock before measuring, rather than waiting for
  React's effect, or the scroll goes nowhere.
- It moves **focus** to the target. A scripted scroll does not do what a real anchor jump does, so
  without this a keyboard user lands nowhere. The target is marked `data-scroll-target` purely to
  suppress its focus ring: browsers will match `:focus-visible` on a scripted focus, and a 2px
  outline around a full-bleed section renders as a stray blue line across the page. The suppression
  is scoped to that one marker, so the skip link and every real control keep their indicator.

Verified landing within a pixel of the header edge on both viewports, animating rather than
teleporting, with the overlay closing and the URL and back button staying honest.

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
7. **Scroll progress was computed against a document height cached at mount.** Fonts swap, images
   decode, sticky sections resolve, and the page kept growing afterwards, so `raw` read 0.73 at the
   true 0.90. Every scroll-driven thing on the site inherited that error, and the visible symptom
   was the film painting the paper-white safety chapter behind a footer full of white type. Both
   `SmoothScroll` and the film now re-measure from a `ResizeObserver` on the body.

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
