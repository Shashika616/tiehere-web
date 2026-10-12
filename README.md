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

## Budget

Currently **185 KB gz** of JS for the whole site (budget: 220 KB). Runtime dependencies are
`lenis`, `next`, `react`, `react-dom`: that is the entire list.

## Before launch

- [ ] Real store links in `components/ui/StoreButtons.tsx` (currently `href="#"`)
- [ ] Legal review of `/privacy`, `/terms`, `/delete-account`, each has `TODO` markers
- [ ] Support/privacy contact addresses (same `TODO` markers)
- [ ] `generateMetadata` OG image, deep links / Universal Links, analytics
- [ ] Decide on proof numbers (see PLAN.md §6.2), real ones or none
