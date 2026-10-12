# TieHere — Brand Website

**A separate Next.js project. Nothing in `Professional-Meetups-Monolith` is touched by this work.**

Status: plan, 2026-10-11. Written for Shashika plus whoever designs and builds the site.

---

## 0. Scope and ground rules

- New standalone repo/folder: `tiehere-web/`. No shared code, no shared build, no imports from the Flutter app. The only things that cross over are **brand facts** (mark, colours, product truth) and, optionally, **copies** of image assets.
- The site is marketing + trust surface, not product. No auth, no API calls to the gateway in v1.
- Target: this is the face of the brand, so the bar is "would this pass an Awwwards nomination *and* convert an app install" — those two goals conflict more often than people admit, and §6 resolves the conflict explicitly.

---

## 1. Reference review — glowww.one

### 1.1 What the site actually is

This matters before copying anything from it.

`glowww.one` is a **720-byte HTML file** whose entire body is one full-viewport `<iframe>` pointing at `https://beloved-assistant-655483.framer.app/`. Served from Hostinger/LiteSpeed. The outer document's `<title>` is literally `Home`; there is no meta description, no Open Graph, no crawlable text, no headings.

The inner Framer site is a **purchased template: "Arpeggio" by Tamas Bodo** (Framer Marketplace). The evidence is still in the shipped markup:

- footer layer named `Copyright © ARPEGGIO AGENCY 2025`
- footer credit layer `Designed by Tamas`
- an unedited FAQ answer: *"How do I get started with **Arpeggio**?"*
- agency-boilerplate copy left in place (unlimited design requests, subscription model, pause your plan) that doesn't match the business

So: a strong template, lightly reskinned, iframed under a custom domain. **Three things to learn from it as a warning, before the things worth stealing:**

1. **The iframe destroys SEO.** Google indexes the wrapper, which contains one word. Every bit of the template's content — the H1, the copy, the images, the structured data — sits in a cross-origin frame attributed to `framer.website`, not to the brand domain. For a site that is meant to *be* the brand, this is the single worst technical decision on the page.
2. **Template residue reads as carelessness** to exactly the audience we want (professionals judging whether to trust us with a real-life meeting).
3. **It is heavy.** 1.49 MB of HTML on the first document, 205 KB of Framer runtime JS, 108 distinct `.woff2` font files referenced, 34 hosted images, plus a looping background MP4.

### 1.2 Motion inventory (verified from the shipped source, not eyeballed)

| Technique | Evidence in source | Notes |
|---|---|---|
| Scroll "appear" reveals | 65 × `data-framer-appear-id` | Initial states: `opacity:0; translateY(40px)` (×18), `translateY(56px)` (×9), `translateY(12px)` (×9), `scale(0.8)` (×6), `translateX(-50%)` (×6) |
| Easing | `cubic-bezier(.44, 0, .56, 1)` | A symmetric ease-in-out. Everything shares it — which is why the site feels coherent but slightly flat |
| Per-character text reveal | ~1,184 single-letter elements | Headlines are split into one span per letter and staggered. Visible in the extracted text as `R e a d y t o c r e a t ?` |
| Infinite tickers / marquees | 22 × `Ticker` components | Logo rows, award rows, testimonial rows |
| Ticker edge fades | 36 × `mask-image` | `linear-gradient(to right, transparent 0%, black 10%, black 90%, transparent 100%)` — fade percentages vary per ticker: 5 / 7.5 / 10 / 12.5 / 16.5% |
| Odometer stat counters | digit reels in markup (`2` `0` → `20`, `9` `+` → `99+`) | "Projects Completed", "Clients Served Worldwide 20+", "Campaigns Launched 99+" |
| Custom cursor | 38 × `data-framer-cursor`, 6 distinct cursor states | Different cursor per region (view-work, drag, link…) |
| Background video | 3 × `<video loop muted playsinline preload="none">`, layers `Desktop - BGVideo` / `Tablet - BGVideo` | Hero ambience |
| Depth / glass | 12 × `backdrop-filter`, 16 × `blur`, 5 × `perspective` | Card hovers and overlays |
| GPU hinting | 289 × `will-change` | Aggressive — a real cost, see §10 |
| Layout patterns | layers: `Bento Grid`, `Stat Grid`, `Default Accordion`, `Highlighted Testimonial`, `Award Ticker`, `Video Promo` | Standard 2025–26 agency vocabulary |

**Palette:** ground `#333336` (not black — a warm charcoal), text `#FFFFFF`, muted `#8A8A91` / `#929298` / `#C0C0C0`, light surfaces `#F6F6F6` / `#E6E6E6`. Accents: orange `#FF4400`, blue `#0099FF`, magenta `#BA007D`.

**Type:** Inter for everything structural, **Playfair Display Variable** as the serif counterpoint for brand moments.

### 1.3 Verdict — what to take, what to leave

**Take:**
- The **rhythm**: a long, confident, dark scroll where every section earns one clear motion beat and no more.
- **Ticker edge-fade masking.** Cheap, and it's the difference between "marquee" and "designed".
- **Odometer counters** for proof numbers.
- **A serif counterpoint** against a neutral grotesk — it's what stops a dark site reading as a crypto landing page.
- **Numbered services** (`{01}`, `{02}`, `{03}`) — quiet, editorial, and it makes a list feel authored.

**Leave:**
- The iframe. Non-negotiable.
- **Per-letter spans on every headline.** 1,184 of them is an accessibility and SEO liability (screen readers can mangle letter-split text; it bloats the DOM). We get 90% of the effect with **per-word or per-line** splitting, which is safe. See §8.
- **289 `will-change`** declarations. That's a memory and compositing cost, not an optimisation.
- Generic agency copy and anything subscription-design-studio shaped.
- A universal single easing curve. Different gestures deserve different curves (§8).

---

## 2. Peer research — the two tiers

The Awwwards *Scrolling* collection (Roveia Health, TIGRIS, Lev, Blink Capital, SANTAL, Studio Mirage, Rialto, Columbus Travel, Cypher Capital, Armor, Point Of View, Halcyon Lighting…) and the Framer-template tier that `glowww.one` sits in are **different crafts**, and it's worth being precise about the difference, because "make it like Glowww" and "make it awards-grade" are not the same brief.

**Tier A — the template genre** (Arpeggio, Torvyn, Designak, and the agency-template roundups). Characteristics: dark ground, big grotesk headline, letter-split reveal, logo ticker, bento grid, stacked sticky service cards, accordion FAQ, testimonial wall, stat counters. It is a *known pattern language*. A visitor who browses design sites will recognise it inside three seconds. That recognition is not fatal — it reads as competent — but it cannot read as *ours*.

**Tier B — the awards tier.** The recurring techniques across that collection, per the gallery's own filters, are **GSAP + Lenis**, parallax, horizontal layout sections, infinite scroll, scroll-scrubbed sequences, and WebGL. What actually separates them is not the technique list — it's that each has **one idea** that only that brand could have, and the motion serves that idea.

**The 2026 app-landing-page consensus** (worth knowing, worth partially ignoring): dark-mode-first, bento grids, glassmorphism, 3D device mockups, minimal heroes, subtle scroll-triggered reveals; one analysis put ~70% of the best app landing pages it sampled on dark schemes. Also a fair warning from the same research: gallery-winning sites frequently convert badly. So we take the craft and keep a conversion spine underneath it (§6.9).

**Direct product peers worth studying** (meeting/community/identity products, for structure and tone rather than motion): Partiful, Luma, Hinge's brand site, Bumble For Friends, Timeleft, Belong/Lunchclub-style "we match you offline" products, and Linear/Family for motion discipline on a dark ground.

**Conclusion for us:** build at Tier B craft level, but borrow Tier A's *conversion skeleton* (hero → proof → what it does → trust → objections → CTA). Our "one idea" is in §4.

---

## 3. What the site has to say — brand truth pulled from the app

This is the part a template can't give us. All of it is sourced from the actual product.

**Name / mark:** **TieHere**. The mark is two interlocking figures — a blue one and a green one — forming a single continuous knot, with two dots as heads. Brand blue `#0075F6`, brand green `#34C24C`. Per the app's own palette file, these are "the two brand colours, sampled from the TieHere mark itself… They are the same in both themes — a brand colour that shifts with the theme is not a brand colour." The site must honour that: **the two brand colours never change between themes.**

**The product line already in the app:** *"Connect with who's here."*

**What it actually does:** verified professionals near you meet in person, around a stated intent, inside a scheduled window, with real safety scaffolding.

**The seven intents** (names and taglines are the app's own, use them verbatim):

| Intent | Tagline |
|---|---|
| COFFEE | A quick cup, a new connection |
| MEAL | Breakfast, lunch or dinner: the time decides |
| NETWORKING | Grow your circle |
| MENTORSHIP | Learn from someone a step ahead |
| OUTING | A gig, a game, a night out |
| RIDE SHARE | Share the road, split the fare |
| DATING | Connect beyond the office |

**The trust ladder (0 → 3).** Levels gate what you can see and do: Level 0 sees meetups with location redacted; Level 1 is any real created account; Level 2 adds LinkedIn + phone + personal email verification and unlocks safety features; Level 3 adds work-email/company verification. This is the single most differentiating thing about the product and deserves a whole chapter of the site.

**Safety, as actual product mechanics, not a badge:** SOS, trusted contacts, a per-participant safety gate (Level 2 required), contact sharing on confirmation, viewer coordinate quantisation so a precise location is never leaked to someone who shouldn't have it.

**Three product decisions that are brand-defining and should be *on the site*, because competitors can't claim them:**
1. **One meetup at a time.** Hosting or holding a request blocks another in the same window. The product refuses to let you collect people.
2. **"Not this time."** A turned-down request never says rejected or declined to the requester — the page explains it as fit and shows other meetups nearby.
3. **Location is redacted until trust is earned**, and quantised even then.

That's the brand: **not a network you accumulate — a small number of real meetings you actually show up to, made safe enough to say yes to.**

---

## 4. Creative direction — the one idea

> **"Here" is a place, and the site is standing in it.**

Everything on the page is built from two primitives taken straight from the mark: **a dot (a person, present)** and **the knot (two people, tied)**. The whole site is the journey from scattered dots to a single tie.

Concretely:
- The hero is a dark, drifting field of presence dots over an abstracted city plane. As you scroll the entire site, dots thin out, converge, and by the final CTA two of them lock into the TieHere knot. **One continuous idea spanning the full page length**, not a sequence of unrelated tricks.
- **Blue and green are the only saturated colours on the site.** Everything else is ground and type. Blue = you, green = them. Once a visitor has scrolled the page, those two colours mean something — which is exactly what a brand colour is supposed to earn.
- **The signature move is restraint, and it is literal.** The safety chapter is the one place where the page *stops moving*: no parallax, no reveals, static type, generous space, and (deliberately) the only light-ground section on the site. In a page that has been in continuous motion for four screens, stillness lands harder than another animation. That contrast is the thing a template cannot copy, and it says "we are serious about this part" without a word of copy.

Tone of voice: plain, confident, short sentences, lowercase UI labels in mono, no exclamation marks, no "revolutionise". The app's own copy is already written this way — match it.

---

## 5. Information architecture

**v1 (launch):**
- `/` — the long scroll. The whole story.
- `/safety` — the trust ladder, SOS, trusted contacts, data handling, in full. Linked from the home safety chapter and from the app.
- `/privacy`, `/terms`, `/delete-account` — required for App Store / Play listings. Account deletion already exists in the product (ADR-008); give it a public page.
- `/press` — mark files, screenshots, boilerplate. Cheap, and it stops journalists screenshotting the app badly.

**v2 (post-launch):** `/cities` (per-city landing pages — the real SEO play for a proximity product), `/blog` or `/field-notes`, `/changelog`.

**Navigation:** a thin fixed header that is transparent over the hero and gains a backdrop blur after 1 viewport. Left: mark. Right: `safety`, `faq`, and one solid CTA `Get the app`. Mobile: full-screen overlay menu, staggered line reveal.

**Persistent conversion rail:** a bottom-anchored, thumb-reachable CTA bar on mobile that appears after the first screen and never leaves. (The June 2026 award roundups specifically flagged bottom-anchored navigation as a pattern worth copying, and for an app site it is also the highest-converting placement.)

---

## 6. Page-by-page section and motion spec — `/`

Each section lists: purpose → content → motion beat. **One beat per section.**

### 6.1 Hero — "Connect with who's here"
- **Content:** H1 `Connect with who's here.` Sub: one sentence naming the actual mechanic — *verified professionals near you, meeting in person, around something specific.* Primary CTA `Get the app` (App Store + Play), secondary ghost link `How trust works ↓`.
- **Motion:** dark plane with a slow drifting dot field (Canvas 2D, ~60–120 dots, additive glow, no WebGL needed). Headline reveals **per line via a clip mask**, not per letter: 3 lines, 90 ms stagger, 700 ms each. Sub and CTAs fade+rise 12 px after the headline settles. The dot field responds to pointer with a gentle repulsion (desktop only).
- **No background video.** A canvas field is a fraction of the weight and can't buffer-stall.

### 6.2 Proof strip
- **Content:** either real numbers (meetups held, cities, verified professionals) or, if the numbers are too small to brag about at launch, **drop the counters entirely** and run a single-line ticker of intent words instead. Do not ship fake stats — the entire product is about trust.
- **Motion:** odometer roll-up on enter (if numbers), or an edge-fade ticker at ~40 s/loop.

### 6.3 The problem — "You know a thousand people. You've met forty."
- **Content:** the anti-feed argument, in three short lines. This is where we separate from LinkedIn.
- **Motion:** the dot field from the hero carries into this section and **thins out** — a scroll-scrubbed transition, not a new animation. Continuity.

### 6.4 Intents — the horizontal chapter
- **Content:** all seven intents, each with its app tagline (§3) and a photographic scene. The app already ships 29 curated landing-collage photos (`assets/images/landing/l01–l29.jpg`) and the intent→image mapping is already decided in code (`intent_type.dart`). **Copy those exact pairings** so the site and the app's schedule flow share one visual language.
- **Motion:** a pinned horizontal track — 7 cards scrubbed sideways by vertical scroll. On mobile it degrades to a native snap-scroll carousel (no pinning; pinned horizontal sections on touch devices are a usability trap).
- This is the section that will get screenshotted. Give it the most design budget.

### 6.5 How it works — three steps
- **Content:** Say where and when → Get requests from verified people → Meet. Keep it to three.
- **Motion:** sticky stacked cards (the one Tier-A pattern worth keeping), with the step number as an oversized ghost numeral behind each card. `{01} {02} {03}` numbering per §1.3.

### 6.6 The trust ladder — the differentiator chapter
- **Content:** levels 0 → 3 as a literal climb. Each rung names what it unlocks: L0 *browse, location hidden*; L1 *an account, full visibility*; L2 *LinkedIn + phone + personal email → safety features unlock*; L3 *verified company → the meetups that ask for it*.
- **Motion:** a sticky left column holding the ladder graphic; the right column scrolls through the four rungs; the ladder fills blue→green as you climb, scroll-scrubbed. The mark's knot completes at L3.
- **Copy note:** frame it as *what you get*, never as *hoops to jump through*.

### 6.7 Safety — the still chapter
- **Content:** SOS. Trusted contacts. Location quantised, never exact. Contact details shared only on confirmation. Plus the three brand-defining decisions from §3 (one meetup at a time / "not this time" / redaction before trust), stated plainly.
- **Motion: none.** Light ground, dark type, static. The only section on the site that does not move. Entering it, the smooth-scroll damping also relaxes toward 1.0 so the scroll itself feels more direct. This is the site's signature.

### 6.8 FAQ
- **Content:** real objections — *Is this dating?* (no: dating is one of seven intents, and it's opt-in), *Who can see where I am?*, *What does verification need?*, *Is it free?* (yes; Premium adds hosting limits, filters, priority help — cancellable in the store), *What if someone doesn't show?*
- **Motion:** accordion, height-animated with a spring, chevron rotation, 1-line answer preview on hover (desktop).

### 6.9 Final CTA
- **Content:** the convergence pays off — two dots lock into the TieHere knot, headline, store badges, QR code for desktop visitors (a desktop visitor cannot install an app; a QR is the only honest desktop CTA).
- **Motion:** the knot draws itself via SVG `stroke-dashoffset`, scrubbed to the last 400 px of scroll, then holds.

### 6.10 Footer
Mark, nav, legal, socials, and — a nod to the one genuinely nice touch on Glowww — a live local-time/location line, but ours says where the *user* is, not where we are. ("You're in Colombo. 14 people are too." only if that number is real; otherwise just the city.)

---

## 7. Design system

```
/* Ground — dark-first */
--ink-900: #07090C;   /* onyx, from the app's dark palette */
--ink-800: #0F1318;   /* surface */
--ink-700: #151B21;
--ink-600: #181D24;
--ink-500: #274050;

/* Light chapter (safety) */
--paper-0:  #FFFFFF;
--paper-50: #F3F6F9;
--paper-100:#ECF0F4;
--paper-200:#E8EDF2;

/* Brand — identical in both themes, never tinted */
--brand-blue:  #0075F6;
--brand-green: #34C24C;

/* Support (from the app, use sparingly) */
--muted:   #9AA7B3;
--slate:   #5D6873;
--danger:  #E5484D;
--gold:    #E5B93D;
```

Rules:
- **Two saturated colours only.** Blue and green. Everything else is ground, paper, or grey. No orange/magenta accents — that's Glowww's palette, not ours.
- Gradients: only blue→green, only on the knot and the ladder fill. Nowhere else.

**Type:** a neutral grotesk + an editorial serif counterpoint, but **not** Inter + Playfair (that's the template's pairing and it is everywhere).
- Headings/UI: **Geist** or **Instrument Sans** — both free, both variable, both with real character at display sizes.
- Brand/editorial moments: **Instrument Serif** (or a licensed display serif if budget allows).
- Data/labels: **Geist Mono** for intent labels, step numbers, timestamps, the `{01}` numerals. Lowercase, letter-spaced.
- Self-host via `next/font/local` — subset, `font-display: swap`, **max 4 font files total**. (Glowww references 108.)

**Scale:** fluid `clamp()` type scale, 8 px spacing base, 1440 max content width with a 16 px mobile gutter.

**Radius/elevation:** 12 px cards, 999 px pills. Shadows are near-invisible on dark — use a 1 px hairline (`rgba(255,255,255,.08)`) the way the app does, not drop shadows.

---

## 8. Motion system

**Principles**
1. One beat per section. If a section has two animations, one of them is decoration — cut it.
2. Motion must carry meaning. Dots converge because the product converges people.
3. Reveal **per line or per word, never per letter.** (Glowww ships ~1,184 letter spans; we will not.)
4. Everything animates `transform` and `opacity` only. No animated `top/left/width/height/filter` on scroll.
5. Interruptible. Scroll up mid-reveal and it reverses cleanly.

**Easing** — not one curve for everything:
```
--ease-out-soft:  cubic-bezier(0.22, 1, 0.36, 1);   /* entrances */
--ease-in-out:    cubic-bezier(0.44, 0, 0.56, 1);   /* scrubbed / symmetric */
--ease-spring:    spring(stiffness 220, damping 28) /* accordions, hovers */
```

**Timings:** entrance 600–800 ms; stagger 60–90 ms; hover 180 ms; page transition 450 ms. Scrub smoothing 0.8–1.2.

**Smooth scroll:** Lenis, `lerp: 0.09`, mounted once as a client component in the root layout so pages stay server-rendered. Relaxed toward 1.0 inside the safety chapter (§6.7). **Disabled entirely on touch** — native momentum beats emulated momentum on iOS every time.

**Reduced motion** — a real implementation, not a checkbox. Under `prefers-reduced-motion: reduce`: Lenis off, all scroll-scrub replaced by static end-states, the dot field renders one static frame, the horizontal chapter becomes a plain vertical stack, counters show final values. Use `gsap.matchMedia()` so the reduced variants are registered, not patched on. **Test it** — this is a safety-first brand; shipping motion that makes people ill would be an own goal.

**Custom cursor:** desktop only, and only two states (default dot, and an expanded "drag" state over the horizontal chapter). Glowww has six; six is noise.

---

## 9. Stack and scaffold

**Stack**
- **Next.js (App Router) + TypeScript**, statically exported where possible. Mostly static pages — SSG, not SSR.
- **Tailwind CSS v4** with the §7 tokens as CSS custom properties in `@theme`.
- ~~**Motion** and **GSAP + ScrollTrigger**~~ — **dropped during the build.** Every scroll-driven
  element (the pinned intent track, the trust ladder, the mark that draws itself) ended up reading
  its own `getBoundingClientRect` in its own rAF loop, which is both lighter and immune to the
  scroller-proxy/pin desync. Removing both cut 231 KB gz to 185 KB. See `README.md`.
- **Lenis** (`ReactLenis`) for smooth scroll.
- **Canvas 2D** for the dot field. No Three.js in v1 — a WebGL dependency for a particle field is weight we don't need, and it's the first thing that breaks on low-end Android.
- `next/image` for everything photographic; AVIF + WebP.
- Deploy on **Vercel** (or Cloudflare Pages). Preview deploys per PR.

**Why no animation library:** this was planned as Motion + GSAP and built without either. Sticky
positioning plus a transform driven by rAF does everything this site needs, and Lenis already owns
scroll position — layering a ScrollTrigger pin on a scroller proxy is the single most fragile thing
in this genre of site.

```
tiehere-web/
├─ app/
│  ├─ layout.tsx                 # fonts, <SmoothScroll>, header, footer, metadata
│  ├─ page.tsx                   # the long scroll, composed of sections/
│  ├─ safety/page.tsx
│  ├─ privacy/page.tsx  terms/page.tsx  delete-account/page.tsx
│  ├─ press/page.tsx
│  ├─ opengraph-image.tsx        # generated OG card
│  └─ globals.css
├─ components/
│  ├─ sections/                  # Hero, Problem, Intents, HowItWorks,
│  │                             # TrustLadder, Safety, FAQ, FinalCta
│  ├─ motion/                    # SmoothScroll, RevealLines, Ticker,
│  │                             # Odometer, PinnedTrack, Cursor, DotField
│  └─ ui/                        # Button, Badge, StoreBadges, Accordion, Mark
├─ content/                      # intents.ts, faq.ts, trust-levels.ts  (typed, one source of truth)
├─ lib/                          # useReducedMotion, easings.ts, seo.ts
├─ public/
│  ├─ brand/                     # tiehere mark svg (traced from the 276×264 png), wordmark, favicons
│  ├─ intents/                   # the 7 scenes, re-exported from the app's landing collage
│  └─ og/
└─ README.md
```

**Content as data:** `content/intents.ts` etc. mirror the app's `intent_type.dart` exactly. When a tagline changes in the app, it changes in one file here. Add a note in that file pointing at the Dart source so the two never silently diverge.

---

## 10. Budgets — performance, accessibility, SEO

**Performance (enforced in CI via Lighthouse CI, build fails below):**
- LCP < 2.0 s on a throttled 4G Moto G-class device
- CLS < 0.05 · INP < 200 ms
- JS shipped to the browser on `/`: **< 220 KB gzipped** including GSAP, Motion and Lenis
- Total `/` page weight < 1.6 MB with images (for comparison: Glowww's first HTML document alone is 1.49 MB)
- Lighthouse Performance ≥ 90 mobile, Accessibility = 100
- `will-change` used **only** on elements currently animating, added and removed by the animation itself. Never a blanket declaration.

**Accessibility:**
- WCAG AA contrast on every pairing. The app already does this rigorously (there's a test that fails the build if the danger colour drops below 4.5:1) — hold the site to the same standard.
- Full keyboard path, visible focus rings, skip link.
- Split text keeps the complete string accessible: animate per-line wrappers while the semantic text stays intact for screen readers (`aria-label` on the heading, `aria-hidden` on the visual spans).
- The horizontal chapter is keyboard-navigable and does not trap scroll.
- `prefers-reduced-motion` honoured throughout (§8).

**SEO:**
- Real server-rendered HTML at the brand domain. **No iframe, ever.**
- Per-page `metadata`, canonical URLs, generated OG images, `Organization` + `MobileApplication` + `FAQPage` JSON-LD, `sitemap.xml`, `robots.txt`.
- Apple Smart App Banner + Android App Links / Universal Links, so a link to a meetup opens the app when it's installed.
- Plan `/cities/[city]` for v2 — for a proximity product, city pages are the whole organic strategy.

---

## 11. What has to be produced (the real blockers)

| Asset | Status | Note |
|---|---|---|
| Vector mark | **Needed** | Only a 276×264 PNG exists (`assets/images/brand/tiehere_mark.png`). Trace to clean SVG before anything else — it's the hero, the favicon, the OG card, the knot animation |
| Wordmark | **Needed** | "TieHere" set in the chosen display face, kerned by hand |
| 7 intent scenes | **Done** | CC0 photography, not the app's illustrations. See IMAGE-CREDITS.md. `mentorship` and `networking` are weak and worth replacing |
| App screenshots | **Needed** | Device-framed, dark theme, real content, no lorem |
| Proof numbers | **Decide** | Real numbers or no numbers (§6.2) |
| Founder/team photo | Optional | A trust product benefits from a face. Worth considering |
| Privacy / Terms copy | **Needed** | Legal review before launch; store listings require them |
| Store listings live | **Blocker for CTA** | The primary CTA is a store link. If the app isn't live, v1 ships a waitlist instead and the CTA swaps later |

---

## 12. Build phases

1. **Foundation** — repo, Next.js + TS + Tailwind v4, tokens, fonts, layout shell, header/footer, legal pages, deploy pipeline, Lighthouse CI budgets wired on day one (retrofitting budgets never works).
2. **Static long scroll** — every section of `/` built and responsive with **zero animation**. The page must be good read as a static document. If it isn't, motion won't save it.
3. **Motion layer** — SmoothScroll, RevealLines, DotField, PinnedTrack, TrustLadder scrub, Odometer, cursor. Reduced-motion variants written *alongside* each, not after.
4. **Signature pass** — the dot→knot continuity across the full page, the still safety chapter, the final knot draw. This is where the site stops being competent and starts being ours.
5. **Hardening** — a11y audit, real-device testing (low-end Android especially), OG cards, JSON-LD, analytics, 404.
6. **Launch** — domain, deep links, store banners, press page.

Phases 1–2 are the ones people skip, and skipping them is why Tier-A sites all look alike.

---

## 13. Decisions I need from you

1. **Domain.** Is `tiehere.*` secured? The site, deep links and OG cards all key off it.
2. **Is the app live in the stores,** or does v1 need a waitlist CTA (§11)?
3. **Real launch numbers** for the proof strip — or do we drop counters?
4. **Typeface budget.** Free pairing (Geist / Instrument Sans + Instrument Serif), or is there budget for a licensed display face?
5. **Photography rights** on the 29 landing-collage images — were they licensed for marketing use, or in-app only?
6. **Dating intent prominence.** It's one of seven, but it changes how the brand is read. Equal weight with the other six, or deliberately de-emphasised on the marketing site?
7. **Scope check:** does this get built here with me, handed to a designer, or both?

---

## Sources

- glowww.one — fetched and inspected 2026-10-11 (wrapper HTML + `beloved-assistant-655483.framer.app` source)
- Arpeggio template by Tamas Bodo — Framer Marketplace
- Awwwards "Scrolling" collection — technique and tag survey
- 2026 app-landing-page trend roundups (Digital Gravity, DesignRush, AppLaunchFlow, A1 Gallery)
- GSAP + Lenis + Motion integration guidance for Next.js App Router
- TieHere product source: `frontend/lib/core/theme/app_palette.dart`, `frontend/lib/core/models/intent_type.dart`, `frontend/lib/features/landing/`, `docs/decisions/adr-002…adr-008`
