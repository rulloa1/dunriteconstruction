/* =====================================================================
   DunRite — "THE BUILD" scroll experience engine
   Lenis smooth scroll + GSAP ScrollTrigger
   ===================================================================== */
(function () {
  "use strict";

  var reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var hasGSAP = window.gsap && window.ScrollTrigger;
  var isMobile = window.matchMedia("(max-width: 760px)").matches;
  var isTouch = window.matchMedia("(pointer: coarse)").matches;

  /* ---------- video viewport manager ----------
     iOS Safari limits how many videos can decode/play at once. This site has
     7 <video> tags; left unmanaged they fight for decoders and stutter or
     fail to start on phones. We play a clip only while it's on screen and
     pause it the moment it leaves. The pinned build reel ([data-fv]) is driven
     separately by playOnly(); here we just make sure it stops when the whole
     section scrolls away. */
  function manageVideos() {
    // Reduced motion: pause every video and show its poster. Done.
    if (reduced) {
      document.querySelectorAll("video").forEach(function (v) {
        try { v.pause(); v.removeAttribute("autoplay"); } catch (_) {}
      });
      return;
    }
    if (!("IntersectionObserver" in window)) return;
    // Skip autoplay on save-data / slow-2g / 2g connections — leave the
    // poster in place so we don't burn cellular data.
    var conn = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
    var skipPlay = !!(conn && (conn.saveData ||
      conn.effectiveType === "2g" || conn.effectiveType === "slow-2g"));

    var solo = document.querySelectorAll("video:not([data-fv])");
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        var v = e.target;
        if (e.isIntersecting) {
          if (skipPlay) return;
          // lazy: only load when near the viewport
          if (v.preload === "none") { try { v.load(); } catch (_) {} }
          try { v.playbackRate = window.__vrate || 0.6; } catch (_) {}
          var p = v.play(); if (p && p.catch) p.catch(function () {});
        } else { try { v.pause(); } catch (_) {} }
      });
    }, { threshold: 0.12, rootMargin: "200px 0px" });
    solo.forEach(function (v) { io.observe(v); });

    var build = document.getElementById("build");
    if (build) {
      var bio = new IntersectionObserver(function (entries) {
        entries.forEach(function (e) {
          if (!e.isIntersecting) {
            document.querySelectorAll("video[data-fv]").forEach(function (v) {
              try { v.pause(); } catch (_) {}
            });
          }
        });
      }, { threshold: 0 });
      bio.observe(build);
    }
  }



  /* ---------- reel data: each clip is a DISTINCT kind of work, not one project ---------- */
  var STAGES = [
    { num: "01", kick: "Foundations / Slabs & Flatwork", title: "Poured Dead-Level",
      cap: "Footers dug, forms set, and slabs finished by hand on raw Florida ground — the base everything else stands on." },
    { num: "02", kick: "Concrete / At Scale", title: "The Pour",
      cap: "Thousands of yards placed, screeded, and finished at golden hour. The kind of flatwork that holds for decades." },
    { num: "03", kick: "Masonry / Block & Walls", title: "Walls That Stand",
      cap: "Engineered block laid and topped to spec — square, plumb, and built to last." },
    { num: "04", kick: "Shells / Turnkey Packages", title: "Full Shell, One Crew",
      cap: "Complete shell packages handled end-to-end: framed, decked, and delivered standing strong." },
    { num: "05", kick: "Developments / Community Scale", title: "Built for Builders",
      cap: "Large-scale concrete for whole neighborhoods, clubhouses, and amenity centers across ten counties." }
  ];
  var N = STAGES.length;

  /* ---------- preloader ----------
     Rules:
     - injected from JS (not SSR) so first paint isn't blocked
     - skipped entirely on prefers-reduced-motion or if seen this session
     - hard cap total runtime ≤ 1.2s (0.6s counter + 1100ms backstop + 150ms exit beat)
     - counter is driven by real load signals: BUILD_0 loadedmetadata + logo decode
       + document.fonts.ready, with a time-based fallback that always wins
     - visible "Skip →" button plus click / key / wheel / touch dismiss */
  var PRE_KEY = "dr_pre_seen";
  var LOGO_SRC = "/uploads/Dunrite-Logo_invert-e1758651959544.png";
  var BUILD_0_SRC = "/__l5e/assets-v1/80ca7c19-9218-438d-b058-288f8bc9eae0/developments.mp4";

  function injectPreloader() {
    // Preloader is SSR-rendered in the route so it covers first paint.
    // If it's not in the DOM (e.g. removed by the inline head script for
    // repeat visits / reduced motion), we skip entirely.
    return document.getElementById("pre");
  }

  function runPreloader(done) {
    // sessionStorage / reduced motion → skip entirely
    var seen = false;
    try { seen = sessionStorage.getItem(PRE_KEY) === "1"; } catch (_) {}
    var existing = document.getElementById("pre");
    if (reduced || !hasGSAP || seen) {
      if (existing && existing.parentNode) existing.parentNode.removeChild(existing);
      document.body.classList.remove("lock");
      done();
      return;
    }
    if (!existing) { done(); return; }

    var pre = existing;

    var num = document.getElementById("preNum");
    var bar = document.getElementById("preBar");
    var logo = document.getElementById("preLogo");
    var skip = document.getElementById("preSkip");

    var finished = false;
    function finish() {
      if (finished) return;
      finished = true;
      try { sessionStorage.setItem(PRE_KEY, "1"); } catch (_) {}
      if (pre && pre.parentNode) pre.parentNode.removeChild(pre);
      document.documentElement.setAttribute("data-pre", "off");
      done();
    }


    // hard backstop — cap total runtime to 1.1s from boot
    var backstop = setTimeout(exit, 1100);

    var exited = false;
    function exit() {
      if (exited) return;
      exited = true;
      clearTimeout(backstop);
      pre.classList.add("hide");
      gsap.to(pre, {
        yPercent: -100, duration: 0.25, ease: "power3.inOut",
        onComplete: finish
      });
      // GSAP-ticker safety net
      setTimeout(finish, 300);
    }

    function onKey(e) {
      if (e.key === "Escape" || e.key === "Enter" || e.key === " ") exit();
    }
    pre.addEventListener("click", exit, { once: true });
    pre.addEventListener("wheel", exit, { once: true, passive: true });
    pre.addEventListener("touchstart", exit, { once: true, passive: true });
    document.addEventListener("keydown", onKey, { once: true });
    if (skip) skip.addEventListener("click", function (e) { e.stopPropagation(); exit(); });

    gsap.to(logo, { opacity: 1, y: 0, duration: 0.4, ease: "power3.out" });

    // race counter (0.6s cap) vs real load signals
    var obj = { v: 0 };
    var counterTween = gsap.to(obj, {
      v: 100, duration: 0.6, ease: "power2.out",
      onUpdate: function () {
        var v = Math.round(obj.v);
        if (num) num.textContent = v;
        if (bar) bar.style.width = v + "%";
      },
      onComplete: exit
    });

    function onReady() {
      counterTween.kill();
      if (num) num.textContent = "100";
      if (bar) bar.style.width = "100%";
      setTimeout(exit, 150); // small beat so 100% is visible
    }

    // Real load signals — resolve when all settle (or ignore failures)
    var signals = [];
    // 1) hero video metadata
    signals.push(new Promise(function (res) {
      try {
        var probe = document.createElement("video");
        probe.preload = "metadata";
        probe.muted = true;
        probe.src = BUILD_0_SRC;
        probe.addEventListener("loadedmetadata", function () { res(); }, { once: true });
        probe.addEventListener("error", function () { res(); }, { once: true });
      } catch (_) { res(); }
    }));
    // 2) logo decode
    signals.push(new Promise(function (res) {
      try {
        var img = new Image();
        img.src = LOGO_SRC;
        (img.decode ? img.decode() : Promise.resolve()).then(res, res);
      } catch (_) { res(); }
    }));
    // 3) fonts
    if (document.fonts && document.fonts.ready) {
      signals.push(document.fonts.ready.catch(function () {}));
    }
    Promise.all(signals).then(onReady);
  }




  /* ---------- hero intro ---------- */
  function heroIntro() {
    if (reduced || !hasGSAP) {
      document.querySelectorAll("[data-hero-line],[data-hero-rv]").forEach(function (el) {
        el.style.opacity = 1; el.style.transform = "none";
      });
      return;
    }
    var tl = gsap.timeline({ defaults: { ease: "power4.out" } });
    tl.from("[data-hero-line]", { yPercent: 118, duration: 1.15, ease: "expo.out", stagger: 0.09 }, 0)
      .from("[data-hero-rv]", { opacity: 0, y: 22, duration: 0.9, stagger: 0.1 }, 0.4);
    // visibility backstop (in case the ticker is throttled before focus)
    setTimeout(function () {
      document.querySelectorAll("[data-hero-line],[data-hero-rv]").forEach(function (el) {
        el.style.opacity = 1; el.style.transform = "none";
      });
    }, 2600);
  }

  /* ---------- main scroll setup ---------- */
  function setupScroll() {
    if (!hasGSAP) return;
    gsap.registerPlugin(ScrollTrigger);
    // Don't re-layout pinned sections when mobile browser chrome shows/hides
    // (the address bar collapsing changes vh and otherwise causes scroll jumps).
    ScrollTrigger.config({ ignoreMobileResize: true });

    /* Lenis smooth scroll — desktop only. On touch devices it fights native
       momentum scrolling and makes the page feel laggy/janky. */
    var lenis = null;
    if (window.Lenis && !reduced && !isTouch && !isMobile) {
      lenis = new Lenis({ duration: 1.1, smoothWheel: true, lerp: .09 });
      lenis.on("scroll", ScrollTrigger.update);
      gsap.ticker.add(function (time) { lenis.raf(time * 1000); });
      gsap.ticker.lagSmoothing(0);
    }

    /* top scroll progress bar */
    var sb = document.getElementById("scrollbar");
    ScrollTrigger.create({
      start: 0, end: "max",
      onUpdate: function (self) { if (sb) sb.style.width = (self.progress * 100).toFixed(2) + "%"; }
    });

    /* hero parallax */
    var heroBg = document.getElementById("heroBg");
    if (heroBg && !reduced) {
      gsap.to(heroBg, {
        yPercent: isMobile ? 12 : 22, ease: "none",
        scrollTrigger: { trigger: "#hero", start: "top top", end: "bottom top", scrub: true }
      });
    }

    /* statement words reveal */
    var stmt = document.getElementById("statement");
    if (stmt) {
      var html = stmt.innerHTML;
      // wrap words (preserve <em>)
      var tmp = document.createElement("div"); tmp.innerHTML = html;
      function wrapNode(node, out) {
        node.childNodes.forEach(function (c) {
          if (c.nodeType === 3) {
            c.textContent.split(/(\s+)/).forEach(function (w) {
              if (w.trim()) { var s = document.createElement("span"); s.className = "word"; s.textContent = w; out.appendChild(s); }
              else out.appendChild(document.createTextNode(w));
            });
          } else {
            var clone = c.cloneNode(false);
            if (c.tagName === "EM") clone.classList.add ? null : null;
            wrapNode(c, clone); out.appendChild(clone);
          }
        });
      }
      var holder = document.createElement("span");
      wrapNode(tmp, holder);
      stmt.innerHTML = holder.innerHTML;
      var words = stmt.querySelectorAll(".word");
      if (!reduced) {
        gsap.to(words, {
          opacity: 1, ease: "none", stagger: .5,
          scrollTrigger: { trigger: stmt, start: "top 78%", end: "bottom 70%", scrub: true }
        });
      } else { words.forEach(function (w) { w.style.opacity = 1; }); }
    }

    /* ============ THE BUILD — pinned timelapse ============ */
    var frames = gsap.utils.toArray("#frames .frame");
    var imgs = frames.map(function (f) { return f.querySelector("video, img"); });
    var vids = frames.map(function (f) { return f.querySelector("video"); });
    function playOnly(i) {
      vids.forEach(function (v, k) {
        if (!v) return;
        if (k === i) { v.playbackRate = (window.__vrate || 0.6); var p = v.play(); if (p && p.catch) p.catch(function(){}); }
        else { try { v.pause(); } catch (e) {} }
      });
    }
    var bnum = document.getElementById("bnum");
    var bkick = document.getElementById("bkick");
    var btitle = document.getElementById("btitle");
    var bcap = document.getElementById("bcap");
    var clipN = document.getElementById("clipN");
    var meter = document.getElementById("meter");
    var railTk = gsap.utils.toArray("#rail .tk");
    var ui = document.querySelector(".build-ui .wrap");
    var curStage = 0;

    function pad(n) { return n < 10 ? "00" + n : n < 100 ? "0" + n : "" + n; }

    function setStage(i) {
      if (i === curStage) return;
      curStage = i;
      var s = STAGES[i];
      bnum.textContent = s.num;
      if (clipN) clipN.textContent = s.num;
      bkick.textContent = s.kick;
      btitle.textContent = s.title;
      bcap.textContent = s.cap;
      railTk.forEach(function (t, k) { t.classList.toggle("on", k === i); });
      playOnly(i);
      if (!reduced) {
        gsap.fromTo(ui, { y: 26, opacity: .25 }, { y: 0, opacity: 1, duration: .6, ease: "power3.out", overwrite: true });
        gsap.fromTo(bnum, { opacity: 0, scale: 1.08 }, { opacity: 1, scale: 1, duration: .6, ease: "power3.out", overwrite: true });
      }
    }

    if (reduced) {
      // static: show last frame, full progress
      frames.forEach(function (f, i) { f.style.opacity = i === 0 ? 1 : 0; });
      if (meter) meter.style.width = "0%";
    } else {
      // crossfade timeline scrubbed across the pin
      // pace (per-stage scroll length, %) is live-tweakable via window.__pace
      // Reduced — substantially tightened so the reel doesn't hijack the wheel.
      if (window.__pace == null) window.__pace = 130;
      var effPace = function () {
        var p = window.__pace || 130;
        return isMobile ? Math.min(p, 95) : p;
      };
      var buildEnd = function () { return "+=" + (N * effPace()) + "%"; };
      var segs = N - 1; // transitions
      var tl = gsap.timeline({
        scrollTrigger: {
          trigger: "#build",
          start: "top top",
          end: buildEnd,
          invalidateOnRefresh: true,
          scrub: isTouch ? 0.4 : 0.8,
          pin: "#buildPin",
          anticipatePin: 1,
          onUpdate: function (self) {
            var p = self.progress;
            if (meter) meter.style.width = Math.round(p * 100) + "%";
            var idx = Math.min(N - 1, Math.floor(p * N + 0.0001));
            setStage(idx);
          }
        }
      });
      // ken-burns the first frame in
      gsap.to(imgs[0], { scale: 1.0, ease: "none",
        scrollTrigger: { trigger: "#build", start: "top top", end: buildEnd, invalidateOnRefresh: true, scrub: .8 } });
      for (var i = 1; i < N; i++) {
        var pos = (i - 1) / segs;
        tl.to(frames[i], { opacity: 1, duration: 1 / segs, ease: "power1.inOut" }, pos)
          .fromTo(imgs[i], { scale: 1.16 }, { scale: 1.0, duration: 1 / segs, ease: "none" }, pos);
      }
      playOnly(0); // start the first clip immediately
    }


    /* ============ STATS count-up ============ */
    var counters = gsap.utils.toArray("#stats [data-to]");
    counters.forEach(function (el) {
      var to = parseFloat(el.getAttribute("data-to"));
      ScrollTrigger.create({
        trigger: "#stats", start: "top 72%", once: true,
        onEnter: function () {
          if (reduced) { el.textContent = to; return; }
          var o = { v: 0 };
          gsap.to(o, { v: to, duration: 1.8, ease: "power2.out",
            onUpdate: function () { el.textContent = Math.round(o.v); } });
        }
      });
    });

    /* ============ HORIZONTAL capabilities ============ */
    var track = document.getElementById("capTrack");
    if (track && !reduced && !isMobile) {
      var getX = function () { return -(track.scrollWidth - window.innerWidth); };
      gsap.to(track, {
        x: getX, ease: "none",
        scrollTrigger: {
          trigger: "#cap", start: "top top",
          end: function () { return "+=" + (track.scrollWidth - window.innerWidth + window.innerHeight); },
          scrub: 1, pin: ".cap-pin",
          anticipatePin: 1, invalidateOnRefresh: true
        }
      });
    }

    /* generic reveals for .rv elements (creed, testimonials, etc.) */
    var rvEls = gsap.utils.toArray(".rv");
    if (rvEls.length) {
      if (reduced) {
        rvEls.forEach(function (el) { el.style.opacity = 1; el.style.transform = "none"; });
      } else {
        ScrollTrigger.batch(rvEls, {
          start: "top 86%",
          onEnter: function (batch) {
            gsap.to(batch, { opacity: 1, y: 0, duration: .9, ease: "power3.out", stagger: .12, overwrite: true });
          }
        });
        // safety: if a section never triggers, don't leave it hidden
        setTimeout(function () {
          rvEls.forEach(function (el) {
            if (getComputedStyle(el).opacity === "0" &&
                el.getBoundingClientRect().top < window.innerHeight) {
              gsap.to(el, { opacity: 1, y: 0, duration: .6 });
            }
          });
        }, 1200);
      }
    }

    /* ============ EXTRA SCROLL ANIMATIONS ============ */
    if (!reduced) {
      /* section headers (.sh) — wipe-in underline + slide */
      gsap.utils.toArray(".sh").forEach(function (el) {
        gsap.fromTo(el,
          { opacity: 0, x: -28, letterSpacing: "0.02em" },
          { opacity: 1, x: 0, letterSpacing: "0.18em", duration: 1, ease: "power3.out",
            scrollTrigger: { trigger: el, start: "top 88%", toggleActions: "play none none reverse" } });
      });

      /* statement section — subtle scale + drift as it scrubs */
      var stmtSection = document.querySelector(".statement");
      if (stmtSection) {
        gsap.fromTo(stmtSection, { backgroundPositionY: "0%" },
          { backgroundPositionY: "20%", ease: "none",
            scrollTrigger: { trigger: stmtSection, start: "top bottom", end: "bottom top", scrub: true } });
      }

      /* stats — counter group lifts and labels stagger in */
      gsap.utils.toArray("#stats .stat").forEach(function (el, i) {
        gsap.from(el, {
          opacity: 0, y: 60, duration: .9, ease: "power3.out", delay: i * 0.08,
          scrollTrigger: { trigger: "#stats", start: "top 78%", toggleActions: "play none none reverse" }
        });
      });
      gsap.to("#stats .wrap", {
        yPercent: -8, ease: "none",
        scrollTrigger: { trigger: "#stats", start: "top bottom", end: "bottom top", scrub: true }
      });

      /* creed — heading character-style mask reveal via clip-path */
      gsap.utils.toArray(".creed h2").forEach(function (el) {
        gsap.fromTo(el,
          { clipPath: "inset(0 100% 0 0)" },
          { clipPath: "inset(0 0% 0 0)", duration: 1.4, ease: "power4.out",
            scrollTrigger: { trigger: el, start: "top 82%", toggleActions: "play none none reverse" } });
      });
      gsap.utils.toArray(".creed .mv").forEach(function (el, i) {
        gsap.from(el, {
          opacity: 0, y: 40, duration: .8, ease: "power3.out", delay: i * 0.12,
          scrollTrigger: { trigger: ".creed-grid", start: "top 70%", toggleActions: "play none none reverse" }
        });
      });

      /* voices — giant quote mark scroll-driven scale + rotation */
      var qmark = document.querySelector(".voices .qmark");
      if (qmark) {
        gsap.fromTo(qmark,
          { scale: .6, rotation: -12, opacity: 0 },
          { scale: 1, rotation: 0, opacity: 1, ease: "none",
            scrollTrigger: { trigger: "#voices", start: "top bottom", end: "center center", scrub: 1 } });
      }
      gsap.utils.toArray("#voices .more-q .q").forEach(function (el, i) {
        gsap.from(el, {
          opacity: 0, y: 50, duration: .9, ease: "power3.out", delay: i * 0.15,
          scrollTrigger: { trigger: "#voices .more-q", start: "top 80%", toggleActions: "play none none reverse" }
        });
      });

      /* area / counties — staggered tile drop with directional bias */
      gsap.utils.toArray("#area .ct").forEach(function (el, i) {
        gsap.from(el, {
          opacity: 0, y: 28, x: (i % 2 ? 16 : -16), duration: .7, ease: "power3.out", delay: (i % 5) * 0.06,
          scrollTrigger: { trigger: "#area .counties", start: "top 82%", toggleActions: "play none none reverse" }
        });
      });
      gsap.from("#area .area-head h2", {
        yPercent: 30, opacity: 0, duration: 1.1, ease: "power4.out",
        scrollTrigger: { trigger: "#area", start: "top 75%", toggleActions: "play none none reverse" }
      });

      /* close section — background video zoom + headline rise */
      var closeBg = document.querySelector(".close .close-bg");
      if (closeBg) {
        gsap.fromTo(closeBg, { scale: 1.25 },
          { scale: 1.0, ease: "none",
            scrollTrigger: { trigger: ".close", start: "top bottom", end: "bottom top", scrub: true } });
      }
      gsap.from(".close h2", {
        yPercent: 50, opacity: 0, duration: 1.1, ease: "power4.out",
        scrollTrigger: { trigger: ".close", start: "top 75%", toggleActions: "play none none reverse" }
      });
      gsap.from(".close .actions .btn", {
        opacity: 0, y: 24, duration: .8, ease: "power3.out", stagger: 0.12,
        scrollTrigger: { trigger: ".close .actions", start: "top 85%", toggleActions: "play none none reverse" }
      });

      /* top bar — fade logo intensity based on scroll, and flip off mix-blend
         once we have a real backdrop so contrast stays predictable */
      var topBar = document.querySelector(".bar");
      if (topBar) {
        ScrollTrigger.create({
          start: 0, end: 200,
          onUpdate: function (self) {
            topBar.style.backdropFilter = "blur(" + (6 + self.progress * 8) + "px)";
            topBar.style.background = "rgba(11,11,12," + (0.2 + self.progress * 0.55) + ")";
            if (self.progress > 0.18) document.body.setAttribute("data-scrolled", "1");
            else document.body.removeAttribute("data-scrolled");
          }
        });
      }


      /* capabilities cards — soft float-in as the horizontal track scrolls past */
      gsap.utils.toArray(".cap-card").forEach(function (el, i) {
        gsap.from(el, {
          opacity: 0, y: 40, duration: .9, ease: "power3.out", delay: i * 0.1,
          scrollTrigger: { trigger: "#cap", start: "top 70%", toggleActions: "play none none reverse" }
        });
      });

      /* hero scroll cue — fade out as user leaves hero */
      var cue = document.querySelector(".scrollcue");
      if (cue) {
        gsap.to(cue, {
          opacity: 0, y: 20, ease: "none",
          scrollTrigger: { trigger: "#hero", start: "20% top", end: "bottom top", scrub: true }
        });
      }
    }

    /* generic reveals (cards already inside pinned track animate via hover) */
    window.addEventListener("load", function () { ScrollTrigger.refresh(); });
    setTimeout(function () { ScrollTrigger.refresh(); }, 400);

  }

  /* ---------- video playback speed (slowed for cinematic feel; tweakable) ---------- */
  if (window.__vrate == null) window.__vrate = 0.6;
  function applyVideoRate() {
    document.querySelectorAll("video").forEach(function (v) {
      try { v.playbackRate = window.__vrate; } catch (e) {}
    });
  }
  window.applyVideoRate = applyVideoRate;
  document.querySelectorAll("video").forEach(function (v) {
    v.addEventListener("loadedmetadata", function () { try { v.playbackRate = window.__vrate; } catch (e) {} });
    v.addEventListener("play", function () { try { v.playbackRate = window.__vrate; } catch (e) {} });
  });
  applyVideoRate();

  /* ---------- boot ---------- */
  if (reduced) document.body.classList.add("reduced");
  document.body.classList.add("lock");
  runPreloader(function () {
    document.body.classList.remove("lock");
    heroIntro();
    setupScroll();
    applyVideoRate();
    manageVideos();
  });
})();
