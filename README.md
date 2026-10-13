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
| `mark` | Hero, at rest | The particles **are** the TieHere mark |
| `cloud` | Hero, on scroll | A thousand people, scattered, drifting |
| `sparse` | Problem | 85% thrown out of frame, the forty you actually met |
| `city` | Proximity | The cloud falls onto a ground plane: a city at a low angle |
| `fan` | Intents | Seven arms from one centre, one per intent |
| `ladder` | Trust | Four bands, grey at the bottom, green at the top |
| `quiet` | Safety | Ground turns to paper, particles stop |
| `settle` | FAQ | Back to dark before the questions start |
| `knot` | Final CTA | Every particle returns to the mark's lemniscate |

The film opens on the mark and disperses it into the crowd within the first half-screen, which
makes the finale a **return** rather than a first reveal and bookends the whole scroll. It needs
two anchors rather than one attribute on the hero, because a section's centre resolves to a single
point and a chapter needs somewhere to travel between.

It is built as a **rope, not a wire**: each particle is thrown into a disc around the curve so the
shape has body, it spans the hero rather than tucking into a corner, and roughly three particles
in ten are held back as a grey ambient field, because a bold shape in an otherwise empty frame
reads as a shape floating in a void.

Two things had to be got right, and neither was obvious from looking at screenshots:

- **A bare lemniscate is only 0.35 tall against 1.0 wide.** Jitter thick enough to read as a rope
  was half the curve's own height, which smeared the loops shut and produced a featureless blob.
  The shape is stretched vertically (`MARK_Y_STRETCH`) first, which lands it near the logo's own
  2:1 and gives the jitter somewhere to live. Plotting the point cloud as ASCII in a scratch script
  found this in one pass after two rounds of guessing at screenshots had failed.
- **Colour is decided by which lobe a point is on**, not how far along the path it is. The
  lemniscate crosses its own centre, so splitting the parameter in half gave two bicoloured loops
  instead of the blue figure and the green one the mark is made of.

The opening chapter and the finale now share **one** definition (`placeMark` / `markColor`), so
they cannot drift apart: the finale is literally the same shape, centred and at full size.

Two numbers come from the drawn logo rather than from eyeballing: the heads sit at about 63% of
the knot's half-width and a little above its top, and each head's radius is about 15% of the
knot's full width. They also need about a quarter of the mark's particles; at a tenth they were
too sparse to resolve at any size, and the shape read as an infinity symbol with two specks over
it. The whole mark then has to hang low enough that the heads clear the fixed header instead of
being cropped off the top of the frame.

Density comes from `weight` on the formation, a particle-radius multiplier, rather than from
raising the global count: radius is free where particle count is not.

Placement is per-viewport (`markLayout`, set on allocate and resize). Past about 0.85 scale on a
wide screen the lobes fall off both edges and all that is left is the diffuse middle.

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
- **Every icon is authored SVG**, not a bitmap badge or a unicode glyph: the store marks, and the
  contact rail's mail, LinkedIn, Instagram and X glyphs in `components/ui/SocialIcons.tsx`. All sit
  on a shared 24x24 grid, filled rather than stroked. The envelope is drawn to the same optical
  weight as the three brand marks, because a hairline outline next to three solid logos reads as a
  mistake at that size.
- **Brand marks keep their own colours**, which is the one place the two-colour rule gives way: a
  brand mark recoloured is no longer that brand's mark, and the four-colour Google Play glyph
  already set the precedent. LinkedIn `#0A66C2`, Instagram its radial gradient, X in white because
  its black would be invisible on this ground. Email has no owner, so it takes TieHere blue: our
  channel in our colour, their platforms in theirs. The rest state is held back with opacity
  rather than by desaturating them, so nothing is recoloured to fit. `tone="mono"` remains the
  default for any other use, so the rest of the site stays inside the palette. Confirm the store
  lockups against Apple's and Google's badge guidelines before launch.

## The brand flight

The wordmark starts at hero scale and flies into the navigation as you leave the first screen.
It is **one element**, not two that cross-fade: `components/motion/BrandFlight.tsx` renders a
single fixed copy and scrubs it from the hero lockup's measured position and size to the nav
lockup's. `components/ui/Lockup.tsx` is shared by all three copies so they cannot drift apart.

`node scripts/check-brand-flight.mjs` is the regression check, including that the nav lockup never
flashes on load. Four things took measuring:

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
- **Under reduced motion there is no flight**, and the first fallback showed the hero copy and the
  nav copy at once: the brand twice on one screen, which reads as a duplicate rather than as a
  fallback. The nav copy now waits until the hero has scrolled away, as a plain opacity change
  with no travel. Worth remembering that this path is what a reviewer with macOS "Reduce motion"
  switched on actually sees, so it is in the regression check.
- The nav lockup belongs to the flight **from the first frame**. Hiding it in the component's
  effect meant the server HTML painted it at full opacity for ~280ms before it disappeared, which
  was plainly visible on a phone, where there is no large hero lockup to draw the eye away. An
  inline script in `<body>` sets `data-brand-flight="pending"` before the header is even parsed.
  It is skipped under reduced motion, and a visitor without JavaScript never sets it, so in both
  of those cases the lockup simply shows.

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

## Section links are root-relative

Every section link is **`/#home`, not `#home`**. The header and footer appear on every page, and a
bare fragment from `/privacy` points at an element that does not exist there, so the link did
nothing at all. That was the real defect behind "the footer doesn't go anywhere": the legal links
had real URLs, the section links had none.

Root-relative means one href works from everywhere. `SmoothAnchors` decides which behaviour
applies by comparing origin and pathname: same page is a smooth scroll, anything else is left to
the browser, and `ScrollEntry` honours the hash on arrival.

The hero carries `id="home"`, so it is addressable like every other section, and the lockup in the
top-left points at it the way any site's logo should.

Verified from `/`, `/privacy` and `/safety`: header links, footer links and the logo all land on
the right section.

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

## Themes

Dark by default, with a light theme and a toggle in the header. The choice is written to
`data-theme` on `<html>`, remembered, and applied by the inline script before first paint. The
system preference is read only when nothing has been chosen; once someone picks, that choice wins.

Colours go through semantic tokens (`--color-fg`, `--color-bg`, `--color-surface`, `--color-line`,
`--color-cta`…). Tailwind generates utilities against the custom property, so redefining the
property under `[data-theme="light"]` switches every utility at once without touching a class
name. **The two brand colours never move**, because a brand colour that shifts with the theme is
not a brand colour.

Two parts of the design needed thinking about rather than inverting:

- **The safety chapter stays the odd one out.** It is paper against a dark site and ink against a
  light one, so it reads from its own `--color-alt-*` set. The contrast is the point of that
  section, so it has to survive the theme rather than follow it.
- **The chrome follows the canvas, not the theme.** The header floats over a ground that changes
  independently of the page, so its colours are stated for a dark ground and overridden off
  `data-film-light`, which the film sets from the luminance it is actually painting. Inheriting the
  theme tokens instead put dark type on the dark safety chapter of a light site and made the nav
  almost invisible.

The **safety chapter carries its own opaque ground** rather than borrowing the canvas. The canvas
cross-dissolves, so the heading arrived while the ground was still halfway between two chapters:
in the light theme that meant white type on mid-grey. The contrast is that section, so it cannot
be caught mid-change. The film still paints the matching chapter behind it, which is what keeps
the header inverting correctly over it.

The **chrome has no edge**. A fixed bar ending in a border reads as a strip laid on the page, so
both the blur and the tint are masked out toward the bottom and it fades into whatever it is over.
The tint tracks the canvas, like the type does.

**Photography is graded through variables** (`--media-bright`, `--scene-bright`), so it sits much
lighter on a paper page. The scrims under the captions are deliberately *not* themed: they are
what white type sits on, and they stay dark in both themes.

A third category sits outside the theme entirely: **type on photography**. The intent cards, the
scroll scenes and the step panels are graded dark whichever way the page is set, so they read from
`--color-on-media-*`, which is white in both themes. Converting them to the page tokens put dark
type on dark photographs. The one brand mark that does flip is **X**, whose mark is black and so
needs the white version on a dark ground.

The film re-bakes every particle on a theme change (a `MutationObserver` on `data-theme`): white
specks are invisible on paper and dark ones on ink, so the neutrals invert while blue and green
hold.

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

## Coming back to a suspended tab

Safari suspends background tabs much harder than Chromium, and two things broke on resume that
Chromium never showed:

- **Stale state.** Everything scroll-driven dedupes per frame, so a value that was correct when
  the tab froze simply persisted. `BrandFlight`, `SmoothScroll` and the film now re-measure and
  force a recompute on `visibilitychange` and `pageshow`, because the page's extent and the
  elements' positions can both have moved while it was frozen.
- **A dropped layer.** Safari discards the rasterised contents of a `backdrop-filter` layer and
  does not reliably repaint it, so the bar returned with the lockup missing. The header nudges its
  own transform on resume and clears it the next frame, which forces a re-rasterise and leaves
  nothing behind.

Neither reproduces in Chromium, including with `visibilitychange` and `pageshow` driven by hand,
so these are reasoned fixes for a browser the local tooling cannot drive. Worth re-testing in
Safari specifically.

## Measuring paint, not just script

`scripts/perf.mjs` reports script, style and layout. It misses everything the compositor does, so
a masked `backdrop-filter`, a large gradient or an oversized image can cost plenty and show up as
nothing. `scripts/paint-trace.mjs` traces the real paint, raster and composite work over a full
scroll and prints the biggest contributors, with a second run that disables the header blur so the
cost of that one effect can be read off rather than argued about.

That is how the header veil got sized: at `blur(10px)` over a 110px box it was **565ms vs 504ms**
of paint work, about 11% of the page's total, for an effect that is polish rather than legibility
(the gradient tint is what carries that). At `blur(7px)` over a shorter box it measures **530ms vs
533ms** — free, inside the noise.

The largest single cost on the page is image decoding during scroll, which is inherent to carrying
thirteen photographs and is already async and responsively sized.

## Budget

Currently **185 KB gz** of JS for the whole site (budget: 220 KB). Runtime dependencies are
`lenis`, `next`, `react`, `react-dom`: that is the entire list.

## Destinations that do not exist yet

`LINKS` in `content/site.ts` holds the store listings, the contact address and the social
accounts. Every one is an empty string, and **every component that reads them renders a "soon"
state rather than an anchor to `#`**. A control that looks like a link and does nothing when
clicked reads as a broken site rather than an unreleased one, and on a primary call to action it
is the most damaging dead control on the page.

Fill those six strings in and the same components become real links with no other change. Nothing
else needs touching.

## Before launch

- [ ] Real store listings, contact address and socials in `LINKS` (`content/site.ts`)
- [ ] Legal review of `/privacy`, `/terms`, `/delete-account`, each has `TODO` markers
- [ ] Support/privacy contact addresses (same `TODO` markers)
- [ ] `generateMetadata` OG image, deep links / Universal Links, analytics
- [ ] Decide on proof numbers (see PLAN.md §6.2), real ones or none
