import { createFileRoute } from "@tanstack/react-router";
import { useEffect } from "react";

const BUILD_0 = "/__l5e/assets-v1/90b8ea44-de98-4f9c-a8b8-4c8438e67c70/build-0.mp4";
const BUILD_1 = "/__l5e/assets-v1/ac6110d4-2614-47b0-8446-408921111559/build-1.mp4";
const BUILD_3 = "/__l5e/assets-v1/c29d23e7-e5c0-4460-ba8a-035f0e4d3b10/build-3.mp4";
const BUILD_2 = "/assets/build-2.mp4";
const CONCRETE = "/assets/concrete-hero.mp4";
const STONE = "/assets/stone-frame-shell.jpg";
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
        content: "From the ground to grand — a cinematic look at how DunRite pours, lays, and delivers Florida's strongest shells.",
      },
      { property: "og:url", content: "https://dun-rite.lovable.app/" },
    ],
    links: [
      { rel: "stylesheet", href: "/experience.css" },
      { rel: "canonical", href: "https://dun-rite.lovable.app/" },
    ],
    scripts: [
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
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <>
      <div className="grain-fx" />
      <div className="vignette" />

      <div className="scrollbar">
        <i id="scrollbar" />
      </div>

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
          <video src={BUILD_0} autoPlay muted loop playsInline preload="auto" />
        </div>
        <div className="wrap">
          <div className="kick" data-hero-rv>
            Building Florida's Strongest Foundations
          </div>
          <h1>
            <span className="ln">
              <span data-hero-line>From the</span>
            </span>
            <span className="ln">
              <span data-hero-line>
                <span className="thin">Ground</span>
              </span>
            </span>
            <span className="ln">
              <span data-hero-line>
                to <em>Grand.</em>
              </span>
            </span>
          </h1>
          <div className="sub" data-hero-rv>
            <p>
              From slabs and block walls to full shell packages and large-scale concrete, DunRite is the trusted partner Florida's
              builders, developers, and homeowners rely on. Scroll to watch a project rise — slab to shell to delivered.
            </p>
          </div>
        </div>
        <div className="scrollcue" data-hero-rv>
          Scroll<span className="ln" />
        </div>
      </header>

      <section className="statement">
        <div className="wrap">
          <p id="statement">
            To build with integrity, craftsmanship, and efficiency — <em>while honoring our family legacy in concrete.</em>
          </p>
        </div>
      </section>

      <section className="build" id="build">
        <div className="build-pin" id="buildPin">
          <div className="frames" id="frames">
            <div className="frame">
              <video data-fv src={BUILD_3} muted loop playsInline preload="auto" />
            </div>
            <div className="frame">
              <video data-fv src={CONCRETE} muted loop playsInline preload="metadata" />
            </div>
            <div className="frame">
              <video data-fv src={BUILD_2} muted loop playsInline preload="metadata" />
            </div>
            <div className="frame">
              <video data-fv src={BUILD_1} muted loop playsInline preload="metadata" />
            </div>
            <div className="frame">
              <video data-fv src={BUILD_0} muted loop playsInline preload="metadata" />
            </div>
          </div>

          <div className="bnum" id="bnum">01</div>

          <div className="build-ui">
            <div className="wrap">
              <div className="bkick" id="bkick">Foundations / Slabs &amp; Flatwork</div>
              <h2 className="btitle" id="btitle">Poured Dead-Level</h2>
              <p className="bcap" id="bcap">
                Footers dug, forms set, and slabs finished by hand on raw Florida ground — the base everything else stands on.
              </p>
            </div>
          </div>

          <div className="rail" id="rail">
            <div className="tk on"><span className="dot" /><span className="lb">01 · Slabs &amp; Flatwork</span></div>
            <div className="tk"><span className="dot" /><span className="lb">02 · Concrete at Scale</span></div>
            <div className="tk"><span className="dot" /><span className="lb">03 · Block &amp; Walls</span></div>
            <div className="tk"><span className="dot" /><span className="lb">04 · Full Shells</span></div>
            <div className="tk"><span className="dot" /><span className="lb">05 · Developments</span></div>
          </div>

          <div className="readout">
            <div className="day">Selected Work<b>Across Florida</b></div>
            <div className="pct">
              <div className="pn"><span id="clipN">01</span> / 05</div>
              <div className="pl">The Reel</div>
            </div>
          </div>

          <div className="meter"><i id="meter" /></div>
        </div>
      </section>

      <section className="stats" id="stats">
        <div className="wrap">
          <div className="sh">By the Numbers</div>
          <div className="stat-grid">
            <div className="stat"><div className="n"><span data-to="650">0</span><span className="u">+</span></div><div className="l">Projects Completed</div></div>
            <div className="stat"><div className="n"><span className="u">$</span><span data-to="15">0</span><span className="u">M+</span></div><div className="l">In Annual Projects</div></div>
            <div className="stat"><div className="n"><span data-to="99">0</span><span className="u">%</span></div><div className="l">Referral-Based Work</div></div>
            <div className="stat"><div className="n"><span data-to="25">0</span><span className="u">+</span></div><div className="l">Years of Experience</div></div>
          </div>
        </div>
      </section>

      <section className="creed" id="creed">
        <div className="wrap">
          <div className="sh rv">Built to Last</div>
          <div className="creed-grid">
            <h2 className="rv">
              Crafting shells, concrete &amp; <em>communities that last.</em>
            </h2>
            <div className="body rv">
              <p>
                From foundations to framing, every phase of our work is handled with precision, efficiency, and pride. We've grown
                from a small family concrete crew into one of Florida's most trusted shell contractors.
              </p>
              <p>
                Nearly all of our work comes from repeat clients and referrals — proof that when we say it's done rite, people
                believe it.
              </p>
              <div className="mv-row">
                <div className="mv">
                  <h4>Our Mission</h4>
                  <p>To build with integrity, craftsmanship, and efficiency while honoring our family legacy in concrete.</p>
                </div>
                <div className="mv">
                  <h4>Our Vision</h4>
                  <p>To be Florida's most reliable shell and concrete partner, known for quality, relationships, and hard work.</p>
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
                One Crew,<br />Every Phase.
              </h2>
              <p>
                Turnkey shell packages and concrete services that help developers, builders, and homeowners save time, control
                costs, and trust the job gets done rite. Scroll on to move through the work.
              </p>
            </div>
            <div className="cap-card">
              <img
                src="https://www.dunriteconstructiongroup.com/wp-content/uploads/elementor/thumbs/building-frame-by-dunrite-florida-re9vcqpw742qr71cxipdfot8pq6tbwoc2b1ghskia0.webp"
                alt="Full shell packages"
              />
              <div className="cc">
                <div className="cn">01 · Builders · Developers · GCs</div>
                <h3>Full Shell Packages</h3>
                <p>Slabs, block walls, trusses, and framing for residential and commercial builds — quality you can trust.</p>
                <a className="cap-link" href="https://www.dunriteconstructiongroup.com/full-shell-packages/" target="_blank" rel="noreferrer">
                  View Album <span className="arr">→</span>
                </a>
              </div>
            </div>
            <div className="cap-card">
              <img src={STONE} alt="Custom home shells" />
              <div className="cc">
                <div className="cn">02 · Homeowners · Architects</div>
                <h3>Custom Home Shells</h3>
                <p>Direct-to-consumer shells, from beach homes to one-off builds, with fast timelines and premium quality.</p>
                <a className="cap-link" href="https://www.dunriteconstructiongroup.com/custom-home-shells/" target="_blank" rel="noreferrer">
                  View Album <span className="arr">→</span>
                </a>
              </div>
            </div>
            <div className="cap-card">
              <img
                src="https://www.dunriteconstructiongroup.com/wp-content/uploads/elementor/thumbs/EPPERSON_LAGOON-rcc4gj0v57y78urryzkabukyz5wlclupmdyj1u07t4.webp"
                alt="Developer concrete"
              />
              <div className="cc">
                <div className="cn">03 · Developers · Production Builders</div>
                <h3>Developer Projects</h3>
                <p>Large-scale concrete packages for neighborhoods, clubhouses, and community developments.</p>
                <a className="cap-link" href="https://www.dunriteconstructiongroup.com/developer-projects/" target="_blank" rel="noreferrer">
                  View Album <span className="arr">→</span>
                </a>
              </div>
            </div>
            <div className="cap-card">
              <img src="https://www.drchomesfl.com/wp-content/uploads/2025/12/cd-5.webp" alt="Concrete & flatwork" />
              <div className="cc">
                <div className="cn">04 · Communities · Single Homes</div>
                <h3>Concrete &amp; Flatwork</h3>
                <p>Driveways, sidewalks, and patios poured with speed and precision — neighborhood scale or a single home.</p>
                <a className="cap-link" href="https://www.dunriteconstructiongroup.com/concrete-flatwork/" target="_blank" rel="noreferrer">
                  View Album <span className="arr">→</span>
                </a>
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
              "First time I've ever seen a crew so careful about cleaning up on site. Thank you for making our community look
              nice!"
            </blockquote>
            <div className="by">
              &mdash; <b>Wendy Johnson</b>
            </div>
          </div>
          <div className="more-q rv">
            <div className="q">
              <p>"Just an awesome experience from start to finish. Management and staff are top notch."</p>
              <div className="by">
                &mdash; <b>Sissi Antonini</b>
              </div>
            </div>
            <div className="q">
              <p>"Very professional and customer oriented. They show up with pride for their work."</p>
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
            <div className="note rv">From the Gulf coast to the heart of the state, our crews show up ready to pour.</div>
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

      <section className="close">
        <div className="close-bg">
          <video src={CONCRETE} muted loop playsInline preload="none" />
        </div>
        <div className="wrap">
          <div className="kick">Free Quotes · 10 Counties</div>
          <h2>
            Let's Build<br />It <em>Rite.</em>
          </h2>
          <div className="actions">
            <a className="btn btn-gold" href="tel:3525884050">
              Start Your Project <span className="arr">→</span>
            </a>
            <a className="btn btn-ghost" href="tel:3525884050">
              Call (352) 588-4050 <span className="arr">→</span>
            </a>
          </div>
        </div>
      </section>

      <footer className="foot">
        <div className="wrap">
          <span>DunRite Construction Group, LLC © 2026</span>
          <span>
            <a href="#hero">Back to top →</a>
          </span>
        </div>
      </footer>
    </>
  );
}
