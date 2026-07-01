
# Landing Polish — Prioritized Plan

Scope: `src/routes/index.tsx`, `public/experience.js`, `public/experience.css`. No dashboard changes.

---

## 1. PRELOADER

### How it works today
- **Markup (SSR'd, first paint)** — `src/routes/index.tsx:126–136`: renders `<div class="pre" id="pre">` containing the logo, a big `<span id="preNum">0</span>%`, a `.pre-bar` fill, and the label `"Pouring the foundation…"`. This is in the server HTML, so before JS runs a visitor sees a black screen with "0%".
- **Logic** — `public/experience.js:88–165` `runPreloader()`:
  - Skips instantly (`finish()`) when `prefers-reduced-motion`, GSAP is missing, or `sessionStorage.dr_pre_seen === "1"` (108).
  - Otherwise starts a GSAP counter tween from 0→100 with `duration: 0.8s` (141–151).
  - Races the counter against `window.load`: whichever fires first calls `exit()` (152–164).
  - Hard backstop `setTimeout(exit, 1300)` (111) and a second `setTimeout(finish, 400)` (126) inside the exit tween in case rAF is throttled.
  - Dismiss on click / wheel / touchstart / Escape / Enter / Space (130–136).
  - On finish sets `sessionStorage.dr_pre_seen = "1"` and `display:none` on the overlay.

Reality: most of what the brief asks for is **already implemented** (session-gated, reduced-motion aware, ~1.3s cap, dismissible). The remaining problems are about first paint / SEO, not the runtime behavior.

### What to change
1. **Stop shipping the preloader in SSR HTML.** Move `<div class="pre">` out of the returned JSX and inject it from `experience.js` (or a tiny inline `<script>` in `head`) only when the session-seen check passes. This removes the "0%" from the first paint, keeps LCP element = hero, and prevents crawlers from indexing "Pouring the foundation…" as visible text.
2. **Tighten the cap to ≤1.2s explicitly.** Change counter `capDuration` from `0.8` → `0.6` and backstop `1300` → `1100` so the worst case matches the spec. The `onReady` 280ms "beat" (161) should drop to ~150ms.
3. **Make the counter follow real progress, not a linear tween.** Drive `preNum`/`preBar` from an actual signal: number of hero-critical assets loaded (`BUILD_0` video `loadedmetadata` + `LOGO` decode + `document.fonts.ready`). Fall back to time-based only if the signal stalls. Prevents "100% → still waiting" and "0% → snap to done" jumps on fast/cached loads.
4. **Skippable affordance visible.** Add a small `"Skip →"` button (bottom-right of `.pre`) wired to the existing `exit()`; today it's dismissible but undiscoverable.
5. **Reduced-motion**: already correct — verify by keeping the early-return at 108 and confirming no CSS animation on `.pre` runs in that mode.

Files: `src/routes/index.tsx` (remove `.pre` block), `public/experience.js:88–165` (inject markup, retune timings, wire real load signals, add skip button), `public/experience.css:53–75` (skip-button styling).

---

## 2. "BY THE NUMBERS"

### What's actually in the code
`src/routes/index.tsx:283–288` — targets ARE set via `data-to` attributes. They are real, not zeros. The `0` in the DOM is just the initial value the count-up tween interpolates from.

```
Projects Completed     data-to="650"   → 650+
In Annual Projects     data-to="15"    → $15M+
Referral-Based Work    data-to="99"    → 99%
Years of Experience    data-to="25"    → 25+
```

Animation: `public/experience.js:338–350`. `ScrollTrigger` fires once at `top 72%`; a GSAP tween counts `0 → data-to` over 1.8s and writes `Math.round` into `textContent`. Reduced-motion snaps directly to `to`.

### What to change
- **Nothing on the numbers themselves** until you supply real values — code is wired correctly. If any of `650 / 15 / 99 / 25` are wrong, just edit those four `data-to` attributes on lines 284–287.
- Minor: `15` renders as `$15M+`. If you want a decimal (`$15.2M+`), the counter needs to switch from `Math.round` to `toFixed(1)` — flag only, no change until you confirm.
- Minor a11y: the `.n` numeric block has no `aria-label`; screen readers read "6 5 0 plus Projects Completed". Wrap each stat in `role="group"` with `aria-label="650+ Projects Completed"`.

Files: `src/routes/index.tsx:284–287` (values, if any), `public/experience.js:338–350` (only if decimals needed).

---

## 3. MOBILE

### Autoplay & posters
- **6 `<video>` tags total**: hero (`BUILD_0`, line 150) + 5 build reel (`BUILD_3, CONCRETE, BUILD_2, BUILD_1, BUILD_0`, lines 231–243). All have `playsInline muted loop preload="metadata"` and a `poster`. Good.
- **How many autoplay at once on mobile?** Only the hero and the currently-visible build frame play. `experience.js:35–48` (IntersectionObserver on non-`[data-fv]` videos) and `playOnly(i)` (257–263) pause the rest. `manageVideos()` also pauses the entire build reel when `#build` leaves viewport (50–62). This part is correct.
- **Cellular guard**: already present via `navigator.connection.saveData / effectiveType` (31–33) — skips play, poster stays. Keep.
- **Gap**: hero video (`autoPlay` attribute in JSX) is NOT gated by that guard because the browser starts playback before `manageVideos()` runs. Fix: remove `autoPlay` from the hero `<video>` and let `manageVideos()` start it (so save-data users get the poster instead of a downloading video).

### Layout shift / CLS
- Videos have `width={1920} height={1080}` — good, reserves aspect ratio.
- `.hero-bg` uses `inset:-8% 0 0 0; height:116%` (css:88). Fine on desktop, but on iOS Safari it can cause a jump when the URL bar collapses. `ignoreMobileResize: true` (js:193) protects ScrollTrigger, not this element.
- Hero corner tags `.hero-tag--tl/tr/bl/br` (index.tsx:164–167) are positioned in all four corners and can crash into the h1 on ≤360px screens. Hide `--bl/--br` under 560px.
- `.hero-ctas` wraps at narrow widths (good) but `.hero-live` chip + `.kick` + h1 stack takes near-full viewport height on iPhone SE, hiding the scroll cue. Already handled by `@media(max-height:640px){ .scrollcue{display:none} }` (css:117) — verify still true after any hero copy changes.
- Stats grid drops to 1 column at ≤460px (css:219). Numbers stay `clamp(46px,8vw,72px)` — fine.

### Tap targets
- `.hero .hero-btn { min-height:54px }` (css:367) — good.
- `.bar` phone link (`.b-hide`) has no explicit tap size; fine because full-header height, but the "Full Site →" link is small text-only. Bump to 44px min-height.
- Rail dots `.rail .tk` on mobile: check they're not interactive (`experience.js` never binds click). If purely visual, add `aria-hidden="true"` to reduce SR noise.

Files: `src/routes/index.tsx:150` (drop `autoPlay`), `public/experience.js:20–48` (start hero video from manager), `public/experience.css` (hide bottom corner tags under 560px, bump `.bar` link min-height).

---

## 4. DESIGN POLISH + COPY

### Spacing / hierarchy
- **Stats section header** (`.stats .sh`, css:209) has `margin-bottom:50px` fixed; feels distant from the grid on tall desktops. Change to `clamp(28px, 4vh, 56px)`.
- **Statement section** (`#statement`) — the word-reveal scrub (`js:246–249`) ends at `bottom 55%`, so on short viewports the section scrolls past before all words appear. Change end to `bottom 70%`.
- **Hero h1 → sub gap**: `margin-top:44px` (css:102) is heavy on mobile; use `clamp(20px, 4vh, 44px)`.
- **Creed grid**: at 820px it collapses to single column (css:312) but the `<figure>` still sits below the heading; on tablets it reads awkwardly. Consider two-column at ≥720px so the image anchors the eye earlier.
- **Cap track cards**: card #3 has `style={{ width: "min(84vw, 500px)" }}` inline (index.tsx:370). Move that to a `.cap-card--wide` class in CSS for consistency.

### Contrast
- `.hero-tag` mono labels use `var(--dim-2)` on a video background — sometimes reads as noise. Add a 6px `text-shadow: 0 0 12px rgba(0,0,0,.6)` for legibility without changing color.
- `.scrollcue` "Scroll" label same issue; same fix.
- Rail inactive `.tk` labels (`.dot` off state) — verify contrast ≥4.5:1 against `#0a0a0a`; if not, bump to `var(--dim)`.

### Copy (light tightening only, per instructions)
- Hero sub (line 199–201): reads well. Optional trim: "Slabs, block, full shell packages, and large-scale concrete — for builders, developers, and homeowners across Florida's I-75 corridor. Scroll to see the work." (drops the Lake Panasoffkee/Villages/Gulf specificity, which is already covered by the "10 counties" mention elsewhere).
- `.hero-live` chip "NOW BUILDING · 6 ACTIVE JOBS" (line 177): if `6` is hardcoded, note it — flag only, don't change.
- `.bkick` line 252 "Foundations / Slabs & Flatwork" — matches STAGES[0] in js:69, good.
- Do NOT add "dirt, refined into gold" anywhere.

Files: `public/experience.css` (spacing tweaks, text-shadow on tags/scrollcue), `src/routes/index.tsx` (optional hero-sub tighten, wide-card class), `public/experience.js:249` (statement scrub end).

---

## Priority order
1. Preloader — pull from SSR, tighten cap, wire real progress, add Skip.
2. Mobile — hero autoplay through manager, hide bottom corner tags on small screens, tap-target bumps.
3. Design polish — text-shadow on hero tags, spacing tokens on stats/hero-sub, statement scrub end.
4. Stats numbers — waiting on your real values; code path already correct.
