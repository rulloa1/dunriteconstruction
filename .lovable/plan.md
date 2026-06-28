# Landing polish plan (public landing only)

Scope: `src/routes/index.tsx`, `public/experience.js`, `public/experience.css`. The `/app` dashboard, Supabase, and field tools stay untouched.

---

## 1) Preloader

### How it works today
- Markup: `src/routes/index.tsx` 115–125 — fixed `.pre` overlay (`#pre`, `z-index:10000`) with logo, `0` counter, gold `#preBar`, and "Pouring the foundation…" label.
- Styling: `public/experience.css` 52–61 — full-bleed black panel, 2px gold progress bar, 11px uppercase mono label.
- Logic: `public/experience.js` 65–110 — `runPreloader()` tweens a dummy `{v:0}` to 100 over **1.9s** (`power2.inOut`) updating `#preNum`/`#preBar`. On complete it waits **0.15s** then slides the panel up over **1.0s**. Total best case ≈ **3.05s** of forced wait. A `setTimeout` backstop fires at **3.2s**. The counter is decoupled from real asset readiness — pure vanity tween. `prefers-reduced-motion` is honored (instant skip). No session memory (fires every navigation). No skip control.

### Changes (priority order)
1. **Session-gate.** Top of `runPreloader` (`experience.js` ~66): if `sessionStorage.getItem('dr_pre_seen')`, hide `#pre` immediately and `done()`. Set the flag inside `finish()`.
2. **Hard cap ≤ 1.2s.** Drop counter tween 1.9s → 0.8s, exit slide 1.0s → 0.3s, remove the 0.15s delay, lower backstop 3.2s → 1.3s (`experience.js` 88, 96, 103–104).
3. **Tie progress to real readiness, not a fake clock.** Race `window.load` (or `document.readyState === 'complete'`) against the 0.8s cap; whichever wins triggers the exit. Counter still ticks to whatever percentage of elapsed-vs-cap so it never claims more progress than has actually happened.
4. **Skippable.** Add a small `.pre-skip` mono "Skip →" button in `index.tsx` (inside `.pre`); in `experience.js` listen for `click`, `keydown` (Esc/Enter/Space), `wheel`, and `touchstart` on `#pre` to short-circuit to the exit tween.
5. **Reduced motion already skips** — keep, and also set `sessionStorage` flag so behavior is consistent.
6. Copy stays "POURING THE FOUNDATION…" (on-brand).

---

## 2) Visual design & polish (no redesign)

Brand tokens (`experience.css` 8–28) are correct — `--gold #eaa83b`, `--white #f5f2ea`, `--black #0b0b0c`, Archivo / Saira / Spline Mono. Note: the dashboard blue (#4A82A7) is intentionally absent from the landing's warm-grayscale palette — leave it that way; mixing it in would clash. Issues:

1. **Top bar legibility** (`experience.css` 64–71). `mix-blend-mode:difference` makes the logo + phone link unpredictable over video. After ~40px scroll, add a `body[data-scrolled]` hook (already used elsewhere) and switch the bar to `mix-blend-mode:normal`, `backdrop-filter:blur(10px)`, `background:rgba(11,11,12,.6)`. Solid contrast, no shimmer.
2. **Hero sub rhythm** (`experience.css` 94–96). `padding-top:26px` + `gap:24px 40px` feels cramped under the giant H1. Bump to `padding-top:32px`, `gap:28px 48px`. Paragraph already caps at 46ch — fine.
3. **Statement floor opacity** (`experience.css` 110). Pre-scroll `opacity:.16` reads as a broken render on first paint. Raise to `.28`.
4. **Stats cell padding** (`experience.css` 194). `padding:40px 8px 38px 0` lets the gold `+`/`%`/`M+` collide with the next column's divider on 4-col layouts. Use symmetric `40px 24px`. Also add a 1px gold underline to `.stats .sh` to match `.creed .sh`.
5. **Section transitions.** `.stats`, `.creed`, `.voices`, `.area` all sit on near-identical dark backgrounds with a 1px hairline border that disappears. Add a 6px top fade (`linear-gradient(180deg, rgba(255,255,255,.045), transparent)`) so the horizon between dark panels reads.
6. **Capability cards** (`experience.css` 209–225). `height:64vh` overflows on 13" laptops once the new "View Album →" link wraps. Switch to `min-height:clamp(360px,60vh,520px)`, drop `.cc` padding to `28px 28px 32px`.
7. **Gold discipline.** Gold currently appears on: hero eyebrow + em + scrollcue + scrollbar, stats unit suffix, creed eyebrow + em, voices stars, area em, close eyebrow + em + button, preloader bar, cap-link underline, meter `box-shadow`. Pull gold off `.voices .stars` (use `--white` @ 85%) and drop the `box-shadow:0 0 18px var(--gold)` on `.meter i` (`experience.css` 149) so gold reads as deliberate emphasis on numbers + CTAs, not decoration.
8. **Section vertical rhythm.** Currently varies — `clamp(80px,14vh,170px)`, `clamp(90px,16vh,200px)`, `clamp(80px,15vh,180px)`. Normalize to one token: `clamp(88px,14vh,176px)` for `.statement`, `.stats`, `.creed`, `.voices`, `.area`.
9. **Footer** (`experience.css` 258–261). Currently just copyright + back-to-top. Add a mono line with phone + "Free quotes · 10 Central Florida counties" so the page ends on contact, not legalese.

---

## 3) Copy & messaging

Hard constraints: no fabricated stats / years / license #s / counts / testimonials. Several items already in the code must be **confirmed by you, not invented by me** — flagged below. "Dirt, refined into gold" is not present and stays out.

Locale framing: I-75 corridor / Lake Panasoffkee / The Villages / Sumter–Marion–Lake–Citrus–Hernando. Existing 10-county list covers this; just anchor it.

### Hero (`index.tsx` 170–203)
- **Eyebrow:** `Building Florida's Strongest Foundations` → **`Central Florida concrete & shell contractor`** — answers "what is this" in 5 words.
- **H1 "From the Ground to Grand."** — keep verbatim.
- **Sub paragraph:**
  > "Slabs, block, full shell packages, and large-scale concrete for builders, developers, and homeowners across the I-75 corridor — from Lake Panasoffkee and The Villages out to the Gulf. Scroll to see the work."
- **Add an in-hero CTA.** Today the only above-the-fold contact is the top-bar phone, which is hidden under 640px (`experience.css` 71). Add a mono `Call (352) 588-4050 →` button beneath the sub paragraph.

### Statement (`index.tsx` 218)
Leave verbatim — it's the mission and earns the scrub reveal.

### Capabilities (`index.tsx` 285–325)
Keep titles + audience tags. Tighten descriptions to one sentence each:
- Full Shell Packages → "Slabs, block, trusses, and framing delivered as one turnkey package."
- Custom Home Shells → "One-off shells for homeowners and architects — beach houses to estates."
- Developer Projects → "Neighborhood-scale concrete for production builds, clubhouses, and amenities."
- Concrete & Flatwork → "Driveways, sidewalks, and patios — single home or whole community."

### Area note (`index.tsx` 365–366)
Replace "From the Gulf coast to the heart of the state, our crews show up ready to pour." with: **"Home base is Sumter County. Crews dispatch daily from Lake Panasoffkee out through The Villages and across the I-75 corridor."** — anchors local-first.

### Closing CTA (`index.tsx` 388–404)
Both buttons currently `tel:` — secondary just repeats the number. Change primary label to **"Request a Quote →"**, keep secondary as **"Call (352) 588-4050"**. **If you give me an inbound email**, primary becomes `mailto:`; otherwise both stay `tel:` for now. Eyebrow `Free Quotes · 10 Counties` → **`Free quotes · serving 10 Central Florida counties`**.

### JSON-LD (`index.tsx` 42–79)
Add `address` (PostalAddress / FL / postalCode) and `sameAs` (FB/IG URLs) **[NEEDS CONFIRMATION]** once you supply them.

### `[NEEDS CONFIRMATION]` — do NOT ship without your sign-off
- **Stats (`index.tsx` 244–249):** 650+ projects, $15M+ annual, 99% referral, 25+ years. Confirm each. Any number you can't defend gets swapped for a non-numeric proof point ("Family-owned · Florida-based · Referral-driven").
- **Testimonials (`index.tsx` 322–352):** three named quotes (Wendy Johnson, Sissi Antonini, Forest Lawrence). Confirm sources (Google / Houzz reviews?) or replace.
- **Mission / Vision block (`index.tsx` 282–303):** confirm this is the company's actual mission/vision language, not paraphrased.

---

## 4) Mobile responsiveness

### Layout / type / tap-target issues
1. **Hero H1 floor** (`experience.css` 88). `clamp(48px,9.2vw,168px)` ≈ 36px at 390px — too small for the section. Raise floor to 56px; verify "Ground" still fits inside `.ln` overflow:hidden — drop to 52px if it wraps.
2. **Hero kick rule** (`experience.css` 85–87). The 46px gold rule + 14px gap eats half a 360px viewport. Under 600px, shorten the rule to 28px.
3. **Top bar phone hidden under 640px** (`experience.css` 71). Replace `.b-hide` with a compact gold-stroke phone-icon button so contact stays one tap away.
4. **Build pin overlay** (`experience.css` 160–187). On 360×640 the 4-line `.bcap` can still kiss the readout band. Bump `.build-ui .wrap` `padding-bottom` to `clamp(120px,22vh,180px)`.
5. **Cap-link tap target** (`experience.css` 219–222). 12px text + `padding:10px 0` ≈ 36px tall; below the 44px minimum. Raise to `padding:14px 0`.
6. **Close-section buttons** (`experience.css` 248–256). `flex-wrap` can orphan one button. Under 520px: `flex-direction:column` and `width:min(360px,100%)` per button.
7. **Counties grid** (`index.tsx` 367–377). Confirm `.counties` collapses to 2 cols under 520px — add `grid-template-columns:repeat(2,1fr)` if missing.
8. **Scrollcue** (`experience.css` 97–104). Overlaps the hero sub on short Android viewports (~640h). Hide under 600px height via `@media (max-height:600px)`.

### Hero / build video graceful degradation
Today (`index.tsx` 184, 224–238, 380–382): all `<video>` use `autoPlay muted loop playsInline`, mixed `preload`. `manageVideos()` (`experience.js` 20–47) pauses off-screen. Gaps:

1. **No `poster=""`.** Pre-play frame is black. Add a poster JPG (~120KB, first-frame still) to every `<video>` — hero especially. **[NEEDS CONFIRMATION]** OK to generate posters from the existing MP4s via ffmpeg, or will you provide images?
2. **No cellular guard.** Extend `manageVideos`: if `navigator.connection?.saveData` or `effectiveType` ∈ {`2g`,`slow-2g`}, skip `.play()` and leave the poster up.
3. **Hero `preload="auto"` is heavy on phones** (`index.tsx` 184). Switch to `preload="metadata"` when `matchMedia('(pointer:coarse)')` matches, and let IO trigger play on visibility.
4. **CLS.** Add explicit `width`/`height` attributes (e.g. `1920`×`1080`) on every `<video>` so the box is reserved before metadata arrives.
5. **Build reel videos (`data-fv`)** — already managed by `playOnly()`; just add posters so the crossfade has something to fade from.

---

## Open items needing your input before/at implementation
1. Confirm or replace the four `#stats` numbers.
2. Confirm the three named testimonials (or supply real review sources).
3. Confirm inbound email (or confirm `tel:` is the only contact channel).
4. Confirm postal address + social URLs for JSON-LD.
5. Poster images for the videos — I generate via ffmpeg, or you provide?
