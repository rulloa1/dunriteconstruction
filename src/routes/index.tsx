import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect } from "react";
import { QuoteForm } from "@/components/QuoteForm";

const BUILD_0 = "/__l5e/assets-v1/80ca7c19-9218-438d-b058-288f8bc9eae0/developments.mp4";
const BUILD_1 = "/__l5e/assets-v1/642956b0-a026-4583-a83a-9e6b225515d2/full-shell.mp4";
const BUILD_3 = "/__l5e/assets-v1/4ff91b38-2864-4378-997c-6dc3b7507cc4/foundations-slab.mp4";
const BUILD_2 = "/__l5e/assets-v1/d26cd938-61cb-4692-80a0-2664b0fe5958/walls-that-stand.mp4";
const CONCRETE = "/__l5e/assets-v1/f66f7b1e-b259-4942-ab8e-df7526fd8a81/concrete-at-scale.mp4";
const P_FOUNDATION = "/__l5e/assets-v1/e6f5ae5d-937c-4ea0-83c4-3b26e51a90ec/foundation.webp";
const P_CONCRETE = "/__l5e/assets-v1/19574144-f700-439a-91ba-3815d54e4ad4/concrete.webp";
const P_WALLS = "/__l5e/assets-v1/2798cc5f-6d45-4efa-a1be-cc0ebb75bccb/walls.webp";
const P_SHELL = "/__l5e/assets-v1/e01f76f4-edb0-4ea3-aede-2adbcabcda13/shell.webp";
const P_NEIGHBORHOOD = "/__l5e/assets-v1/fad52a1d-74ef-4df3-a38b-4fa6f24a841a/neighborhood.webp";
const P_FINISHED = "/__l5e/assets-v1/ea25e3dd-54b1-4f51-bf9e-d7f1fb31b220/finished.webp";
const P_CUSTOM = "/__l5e/assets-v1/7b4b01f3-d5f4-4e0e-9bd1-6e178a33e30a/customhome.webp";
const P_EPPERSON = "/__l5e/assets-v1/f6ac5871-02c6-4498-afcd-a1dff4a11363/scaffold.webp";
const STONE = P_CUSTOM;
const LOGO = "/uploads/Dunrite-Logo_invert-e1758651959544.png";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "The Build — DunRite Construction Group" },
      {
        name: "description",
        content:
          "Watch a Florida build rise — slab to shell to delivered. DunRite is the trusted concrete and shell partner across 10 Central Florida counties.",
      },
      { property: "og:title", content: "The Build — DunRite Construction Group" },
      {
        property: "og:description",
        content:
          "From the ground to grand — a cinematic look at how DunRite pours, lays, and delivers Florida's strongest shells.",
      },
      { property: "og:url", content: "https://dun-rite.lovable.app/" },
    ],
    links: [
      { rel: "stylesheet", href: "/experience.css" },
      { rel: "canonical", href: "https://dun-rite.lovable.app/" },
    ],
    scripts: [
      {
        // Runs before <body> paints. Removes the SSR preloader instantly for
        // repeat visits / reduced motion so it never flashes over content,
        // and locks scroll on first visits so page doesn't jump. Also wires
        // an independent dismissal (skip button + click + key + hard 2.5s
        // timeout) so if experience.js / CDN scripts fail to load, visitors
        // are NEVER trapped on the splash.
        children:
          "(function(){try{var H=document.documentElement;var r=matchMedia('(prefers-reduced-motion: reduce)').matches;var s=false;try{s=sessionStorage.getItem('dr_pre_seen')==='1';}catch(e){}if(r||s){H.setAttribute('data-pre','off');return;}H.setAttribute('data-pre','on');var done=false;function kill(){if(done)return;done=true;H.setAttribute('data-pre','off');try{sessionStorage.setItem('dr_pre_seen','1');}catch(e){}var p=document.getElementById('pre');if(p&&p.parentNode)p.parentNode.removeChild(p);try{document.body.classList.remove('lock');}catch(e){}}window.__drPreKill=kill;function wire(){var p=document.getElementById('pre');if(!p)return;var sk=document.getElementById('preSkip');if(sk)sk.addEventListener('click',function(e){e.stopPropagation();kill();});p.addEventListener('click',kill,{once:true});}if(document.readyState!=='loading')wire();else document.addEventListener('DOMContentLoaded',wire,{once:true});document.addEventListener('keydown',function(e){if(e.key==='Escape'||e.key==='Enter'||e.key===' ')kill();},{once:true});setTimeout(kill,2500);}catch(e){try{document.documentElement.setAttribute('data-pre','off');}catch(_){}}})();",
      },
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "LocalBusiness",
          name: "DunRite Construction Group",
          telephone: "+1-352-588-4050",
          url: "https://dun-rite.lovable.app/",
          logo: "https://dun-rite.lovable.app/uploads/Dunrite-Logo_invert-e1758651959544.png",
          image: "https://dun-rite.lovable.app/uploads/Dunrite-Logo_invert-e1758651959544.png",
          areaServed: [
            "Citrus County, FL",
            "Hernando County, FL",
            "Hillsborough County, FL",
            "Lake County, FL",
            "Manatee County, FL",
            "Marion County, FL",
            "Pasco County, FL",
            "Pinellas County, FL",
            "Polk County, FL",
            "Sumter County, FL",
          ],
        }),
      },

      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Organization",
          name: "DunRite Construction Group",
          url: "https://dun-rite.lovable.app/",
          logo: "https://dun-rite.lovable.app/uploads/Dunrite-Logo_invert-e1758651959544.png",
        }),
      },
    ],
  }),
  component: TheBuild,
});

function loadScript(src: string, attrs: Record<string, string> = {}) {
  return new Promise<void>((resolve, reject) => {
    if (document.querySelector(`script[data-src="${src}"]`)) {
      resolve();
      return;
    }
    const s = document.createElement("script");
    s.src = src;
    s.async = false;
    s.dataset.src = src;
    Object.entries(attrs).forEach(([k, v]) => s.setAttribute(k, v));
    s.onload = () => resolve();
    s.onerror = () => reject(new Error(`Failed to load ${src}`));
    document.head.appendChild(s);
  });
}

function TheBuild() {
  useEffect(() => {
    let cancelled = false;
    (async () => {
      await loadScript("https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/gsap.min.js");
      await loadScript("https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/ScrollTrigger.min.js");
      await loadScript("https://cdn.jsdelivr.net/npm/lenis@1.1.14/dist/lenis.min.js");
      if (cancelled) return;
      await loadScript("/experience.js");
    })();
    const onScrollClick = (e: MouseEvent) => {
      const t = (e.target as HTMLElement)?.closest("[data-scroll-to]");
      if (!t) return;
      const id = t.getAttribute("data-scroll-to");
      const el = id ? document.getElementById(id) : null;
      if (el) {
        e.preventDefault();
        el.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    };
    document.addEventListener("click", onScrollClick);
    return () => {
      cancelled = true;
      document.removeEventListener("click", onScrollClick);
    };
  }, []);

  return (
    <>
      <div className="grain-fx" />
      <div className="vignette" />

      <div className="scrollbar">
        <i id="scrollbar" />
      </div>

      {/* SSR preloader — covers first paint on first visit. Inline head script
    sets html[data-pre="off"] on repeat visits / reduced motion so this
    is hidden BEFORE paint (see CSS: html[data-pre="off"] .pre{display:none}).
    experience.js drives the count-up and dismissal. */}
      <div className="pre" id="pre">
        <img src={LOGO} alt="DunRite" id="preLogo" />
        <div className="pre-count">
          <span id="preNum">0</span>
          <span className="pct">%</span>
        </div>
        <div className="pre-bar">
          <i id="preBar" />
        </div>
        <div className="pre-label">Pouring the foundation…</div>
        <button type="button" id="preSkip" className="pre-skip" aria-label="Skip intro">
          Skip →
        </button>
      </div>

      <div className="bar">
        <img className="b-logo" src={LOGO} alt="DunRite" />
        <div className="b-right">
          <a className="b-hide" href="tel:3525884050">
            (352) 588-4050
          </a>
          <a href="#hero">Full Site →</a>
        </div>
      </div>

      <header className="hero" id="hero">
        <div className="hero-bg" id="heroBg">
          <video
            src={BUILD_0}
            muted
            loop
            playsInline
            preload="metadata"
            width={1920}
            height={1080}
            poster={STONE}
          />
        </div>
        {/* Blueprint grid + technical overlays */}
        <div className="hero-blueprint" aria-hidden />
        <div className="hero-tag hero-tag--tl">DRC_OS // BUILD_MANIFEST.V3</div>
        <div className="hero-tag hero-tag--tr">COORD: 28.7648° N, 82.0779° W</div>
        <div className="hero-tag hero-tag--bl">— CENTRAL FLORIDA</div>
        <div className="hero-tag hero-tag--br">EST. 1998 · I-75 CORRIDOR</div>
        {/* Corner brackets */}
        <span className="hero-corner hero-corner--tl" aria-hidden />
        <span className="hero-corner hero-corner--tr" aria-hidden />
        <span className="hero-corner hero-corner--bl" aria-hidden />
        <span className="hero-corner hero-corner--br" aria-hidden />

        <div className="wrap">
          <div className="kick" data-hero-rv>
            Central Florida concrete &amp; shell contractor
          </div>
          <h1>
            <span className="ln">
              <span data-hero-line>From the</span>
            </span>
            <span className="ln">
              <span data-hero-line>
                <span className="thin">GROUND</span>
              </span>
            </span>
            <span className="ln">
              <span data-hero-line>
                to <em>ROOF.</em>
              </span>
            </span>
          </h1>
          <div className="sub" data-hero-rv>
            <p>
              Slabs, block, full shell packages, and large-scale concrete for builders, developers,
              and homeowners across the I-75 corridor — from Lake Panasoffkee and The Villages out
              to the Gulf. Scroll to see the work.
            </p>
          </div>
          <div className="hero-ctas" data-hero-rv>
            <a className="btn btn-gold hero-btn" href="#quote" data-scroll-to="quote">
              Request a Quote{" "}
              <span className="arr" aria-hidden>
                →
              </span>
            </a>
            <a className="btn btn-ghost hero-btn hero-btn--call" href="tel:3525884050">
              <span className="hero-btn__label">Call</span>
              <span className="hero-btn__num">(352) 588-4050</span>
            </a>
          </div>

        </div>
        <div className="scrollcue" data-hero-rv>
          Scroll
          <span className="ln" />
        </div>
      </header>

      <section className="statement">
        <div className="wrap">
          <p id="statement">
            To build with integrity, craftsmanship, and efficiency —{" "}
            <em>while honoring our family legacy in concrete.</em>
          </p>
        </div>
      </section>

      <section className="build" id="build">
        <div className="build-pin" id="buildPin">
          <div className="frames" id="frames">
            <div className="frame">
              <video
                data-fv
                src={BUILD_3}
                muted
                loop
                playsInline
                preload="metadata"
                poster={P_FOUNDATION}
                width={1920}
                height={1080}
              />
            </div>
            <div className="frame">
              <video
                data-fv
                src={CONCRETE}
                muted
                loop
                playsInline
                preload="metadata"
                poster={P_CONCRETE}
                width={1920}
                height={1080}
              />
            </div>
            <div className="frame">
              <video
                data-fv
                src={BUILD_2}
                muted
                loop
                playsInline
                preload="metadata"
                poster={P_WALLS}
                width={1920}
                height={1080}
              />
            </div>
            <div className="frame">
              <video
                data-fv
                src={BUILD_1}
                muted
                loop
                playsInline
                preload="metadata"
                poster={P_SHELL}
                width={1920}
                height={1080}
              />
            </div>
            <div className="frame">
              <video
                data-fv
                src={BUILD_0}
                muted
                loop
                playsInline
                preload="metadata"
                poster={P_NEIGHBORHOOD}
                width={1920}
                height={1080}
              />
            </div>
          </div>

          <div className="bnum" id="bnum">
            01
          </div>

          <div className="build-ui">
            <div className="wrap">
              <div className="bkick" id="bkick">
                Foundations / Slabs &amp; Flatwork
              </div>
              <h2 className="btitle" id="btitle">
                Poured Dead-Level
              </h2>
              <p className="bcap" id="bcap">
                Footers dug, forms set, and slabs finished by hand on raw Florida ground — the base
                everything else stands on.
              </p>
            </div>
          </div>

          <div className="rail" id="rail">
            <div className="tk on">
              <span className="dot" />
              <span className="lb">01 · Slabs &amp; Flatwork</span>
            </div>
            <div className="tk">
              <span className="dot" />
              <span className="lb">02 · Concrete at Scale</span>
            </div>
            <div className="tk">
              <span className="dot" />
              <span className="lb">03 · Block &amp; Walls</span>
            </div>
            <div className="tk">
              <span className="dot" />
              <span className="lb">04 · Full Shells</span>
            </div>
            <div className="tk">
              <span className="dot" />
              <span className="lb">05 · Developments</span>
            </div>
          </div>

          <div className="readout">
            <div className="day">
              Selected Work<b>Across Florida</b>
            </div>
            <div className="pct">
              <div className="pn">
                <span id="clipN">01</span> / 05
              </div>
              <div className="pl">The Reel</div>
            </div>
          </div>

          <div className="meter">
            <i id="meter" />
          </div>
        </div>
      </section>

      <section className="stats" id="stats">
        <div className="wrap">
          <div className="sh">By the Numbers</div>
          <div className="stat-grid">
            <div className="stat" role="group" aria-label="650+ Projects Completed">
              <div className="n">
                <span data-to="650">0</span>
                <span className="u">+</span>
              </div>
              <div className="l">Projects Completed</div>
            </div>
            <div className="stat" role="group" aria-label="$15M+ In Annual Projects">
              <div className="n">
                <span className="u">$</span>
                <span data-to="15">0</span>
                <span className="u">M+</span>
              </div>
              <div className="l">In Annual Projects</div>
            </div>
            <div className="stat" role="group" aria-label="99% Referral-Based Work">
              <div className="n">
                <span data-to="99">0</span>
                <span className="u">%</span>
              </div>
              <div className="l">Referral-Based Work</div>
            </div>
            <div className="stat" role="group" aria-label="25+ Years of Experience">
              <div className="n">
                <span data-to="25">0</span>
                <span className="u">+</span>
              </div>
              <div className="l">Years of Experience</div>
            </div>
          </div>
        </div>
      </section>

      <section className="creed" id="creed">
        <div className="wrap">
          <div className="sh rv">Built to Last</div>
          <div className="creed-grid">
            <div className="creed-left">
              <h2 className="rv">
                Crafting shells, concrete &amp; <em>communities that last.</em>
              </h2>
              <figure className="creed-fig rv">
                <img
                  src={P_FINISHED}
                  alt="DunRite full shell package — framed, roofed, and ready for finish"
                  loading="lazy"
                />
              </figure>
            </div>
            <div className="body rv">
              <p>
                From foundations to framing, every phase of our work is handled with precision,
                efficiency, and pride. We've grown from a small family concrete crew into one of
                Florida's most trusted shell contractors.
              </p>
              <p>
                Nearly all of our work comes from repeat clients and referrals — proof that when we
                say it's done rite, people believe it.
              </p>
              <div className="mv-row">
                <div className="mv">
                  <h4>Our Mission</h4>
                  <p>
                    To build with integrity, craftsmanship, and efficiency while honoring our family
                    legacy in concrete.
                  </p>
                </div>
                <div className="mv">
                  <h4>Our Vision</h4>
                  <p>
                    To be Florida's most reliable shell and concrete partner, known for quality,
                    relationships, and hard work.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="cap" id="cap">
        <div className="cap-pin">
          <div className="cap-track" id="capTrack">
            <div className="cap-intro">
              <div className="sh">What We Pour</div>
              <h2>
                One Crew,
                <br />
                Every Phase.
              </h2>
              <p>
                Turnkey shell packages and concrete services that help developers, builders, and
                homeowners save time, control costs, and trust the job gets done rite. Scroll on to
                move through the work.
              </p>
            </div>
            <div className="cap-card">
              <img
                src={P_SHELL}
                alt="Full shell packages"
              />
              <div className="cc">
                <div className="cn">01 · Builders · Developers · GCs</div>
                <h3>Full Shell Packages</h3>
                <p>Slabs, block, trusses, and framing delivered as one turnkey package.</p>
                <Link
                  className="cap-link"
                  to="/albums/$slug"
                  params={{ slug: "full-shell-packages" }}
                >
                  View Album <span className="arr">→</span>
                </Link>
              </div>
            </div>
            <div className="cap-card">
              <img src={STONE} alt="Custom home shells" />
              <div className="cc">
                <div className="cn">02 · Homeowners · Architects</div>
                <h3>Custom Home Shells</h3>
                <p>One-off shells for homeowners and architects — beach houses to estates.</p>
                <Link
                  className="cap-link"
                  to="/albums/$slug"
                  params={{ slug: "custom-home-shells" }}
                >
                  View Album <span className="arr">→</span>
                </Link>
              </div>
            </div>
            <div className="cap-card cap-card--wide">
              <img
                src={P_EPPERSON}
                alt="Developer concrete"
              />
              <div className="cc">
                <div className="cn">03 · Developers · Production Builders</div>
                <h3>Developer Projects</h3>
                <p>Neighborhood-scale concrete for production builds, clubhouses, and amenities.</p>
                <Link
                  className="cap-link"
                  to="/albums/$slug"
                  params={{ slug: "developer-projects" }}
                >
                  View Album <span className="arr">→</span>
                </Link>
              </div>
            </div>
            <div className="cap-card">
              <img
                src={P_CONCRETE}
                alt="Concrete & flatwork"
              />
              <div className="cc">
                <div className="cn">04 · Communities · Single Homes</div>
                <h3>Concrete &amp; Flatwork</h3>
                <p>Driveways, sidewalks, and patios — single home or whole community.</p>
                <Link
                  className="cap-link"
                  to="/albums/$slug"
                  params={{ slug: "concrete-flatwork" }}
                >
                  View Album <span className="arr">→</span>
                </Link>
              </div>
            </div>
            <div className="cap-end" />
          </div>
        </div>
      </section>

      <section className="voices" id="voices">
        <div className="qmark">&rdquo;</div>
        <div className="wrap">
          <div className="sh rv">In Their Words</div>
          <div className="rv">
            <div className="stars">★★★★★</div>
            <blockquote>
              "First time I've ever seen a crew so careful about cleaning up on site. Thank you for
              making our community look nice!"
            </blockquote>
            <div className="by">
              &mdash; <b>Wendy Johnson</b>
            </div>
          </div>
          <div className="more-q rv">
            <div className="q">
              <p>
                "Just an awesome experience from start to finish. Management and staff are top
                notch."
              </p>
              <div className="by">
                &mdash; <b>Sissi Antonini</b>
              </div>
            </div>
            <div className="q">
              <p>
                "Very professional and customer oriented. They show up with pride for their work."
              </p>
              <div className="by">
                &mdash; <b>Forest Lawrence</b>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="area" id="area">
        <div className="wrap">
          <div className="sh rv">Where We Build</div>
          <div className="area-head">
            <h2 className="rv">
              Serving Central Florida &mdash; <em>10 counties strong.</em>
            </h2>
            <div className="note rv">
              Home base is Sumter County. Crews dispatch daily from Lake Panasoffkee out through The
              Villages and across the I-75 corridor.
            </div>
          </div>
          <div className="counties rv">
            {[
              "Citrus",
              "Hernando",
              "Hillsborough",
              "Lake",
              "Manatee",
              "Marion",
              "Pasco",
              "Pinellas",
              "Polk",
              "Sumter",
            ].map((name, i) => (
              <div className="ct" key={name}>
                <div className="ci">{String(i + 1).padStart(2, "0")}</div>
                <div className="cnm">{name}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="quote" id="quote">
        <div className="quote-bg" aria-hidden>
          <video
            src={CONCRETE}
            muted
            loop
            playsInline
            preload="none"
            poster={STONE}
            width={1920}
            height={1080}
          />
        </div>
        <div className="wrap">
          <div className="quote-grid">
            <div className="quote-intro">
              <div className="kick">Free quotes · 10 Central Florida counties</div>
              <h2>
                Let's Build
                <br />
                It <em>Rite.</em>
              </h2>
              <p className="quote-lead">
                Tell us a little about the job and we'll get back within one business day with next
                steps. Most quotes take under a week once we've walked the site.
              </p>
              <div className="quote-meta">
                <div>
                  <div className="qm-lb">Phone</div>
                  <a className="qm-val" href="tel:3525884050">
                    (352) 588-4050
                  </a>
                </div>
                <div>
                  <div className="qm-lb">Service Area</div>
                  <div className="qm-val">I-75 Corridor · Sumter County HQ</div>
                </div>
              </div>
            </div>
            <div className="quote-card">
              <QuoteForm />
            </div>
          </div>
        </div>
      </section>

      <footer className="foot">
        <div className="wrap">
          <span>DunRite Construction Group, LLC © 2026</span>
          <span className="fcontact">
            <a href="tel:3525884050">(352) 588-4050</a> · Free quotes · 10 Central Florida counties
          </span>
          <span>
            <a href="#hero">Back to top →</a>
          </span>
        </div>
      </footer>
    </>
  );
}
