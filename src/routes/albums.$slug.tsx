import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { getAlbum, ALBUMS } from "@/lib/albums";

export const Route = createFileRoute("/albums/$slug")({
  loader: ({ params }) => {
    const album = getAlbum(params.slug);
    if (!album) throw notFound();
    return { album };
  },
  head: ({ loaderData }) => {
    const a = loaderData?.album;
    const title = a ? `${a.title} — Dun Rite Construction Group` : "Album — Dun Rite";
    const desc = a?.description ?? "Project album by Dun Rite Construction Group.";
    return {
      meta: [
        { title },
        { name: "description", content: desc },
        { property: "og:title", content: title },
        { property: "og:description", content: desc },
        ...(a ? [{ property: "og:image", content: a.cover }] : []),
      ],
    };
  },
  notFoundComponent: () => (
    <div style={{ minHeight: "70vh", display: "grid", placeItems: "center", color: "#eee", background: "#0b0b0c" }}>
      <div style={{ textAlign: "center" }}>
        <h1 style={{ fontFamily: "'Libre Franklin', sans-serif", letterSpacing: ".12em" }}>ALBUM NOT FOUND</h1>
        <Link to="/" className="album-notfound-link">← Back to home</Link>
      </div>
    </div>
  ),
  errorComponent: ({ error, reset }) => (
    <div style={{ padding: 40, color: "#eee", background: "#0b0b0c", minHeight: "70vh" }}>
      <h1>Something went wrong</h1>
      <p>{error.message}</p>
      <button onClick={reset} className="album-retry">Retry</button>
    </div>
  ),
  component: AlbumPage,
});

function AlbumPage() {
  const { album } = Route.useLoaderData();
  return (
    <>
      <style>{`
        .album-back, .album-notfound-link {
          transition: color .18s ease, outline-offset .18s ease;
          outline: none;
        }
        .album-back:hover, .album-back:focus-visible,
        .album-notfound-link:hover, .album-notfound-link:focus-visible {
          color: #1CB3E8 !important;
        }
        .album-back:active, .album-notfound-link:active {
          color: #1490bf !important;
        }

        .album-cta {
          transition: background .18s ease, color .18s ease, border-color .18s ease, box-shadow .18s ease, outline-offset .18s ease;
          outline: none;
        }
        .album-cta:hover, .album-cta:focus-visible {
          background: #1CB3E8 !important;
          color: #0b0b0c !important;
          border-color: #1CB3E8 !important;
          box-shadow: 0 0 0 3px rgba(28,179,232,.25);
        }
        .album-cta:active {
          background: #1490bf !important;
          border-color: #1490bf !important;
          color: #0b0b0c !important;
        }

        .album-thumb {
          transition: transform .22s ease, box-shadow .22s ease, outline-offset .18s ease;
          outline: none;
          cursor: pointer;
        }
        .album-thumb:hover, .album-thumb:focus-within {
          transform: translateY(-2px) scale(1.01);
          box-shadow: 0 0 0 2px #1CB3E8;
        }
        .album-thumb:active {
          transform: translateY(0) scale(.995);
          box-shadow: 0 0 0 2px #1490bf;
        }
        .album-thumb img {
          transition: transform .28s ease;
        }
        .album-thumb:hover img, .album-thumb:focus-within img {
          transform: scale(1.04);
        }

        .album-link {
          transition: color .18s ease, border-color .18s ease, outline-offset .18s ease;
          outline: none;
        }
        .album-link:hover, .album-link:focus-visible {
          color: #1CB3E8 !important;
          border-bottom-color: #1CB3E8 !important;
          box-shadow: 0 1px 0 0 #1CB3E8;
        }
        .album-link:active {
          color: #1490bf !important;
          border-bottom-color: #1490bf !important;
        }

        .album-retry {
          transition: background .18s ease, color .18s ease, border-color .18s ease, box-shadow .18s ease;
          background: transparent;
          color: #eee;
          border: 1px solid rgba(255,255,255,.25);
          padding: 8px 16px;
          font-family: 'Libre Franklin', sans-serif;
          font-size: 12px;
          letter-spacing: .12em;
          text-transform: uppercase;
          cursor: pointer;
          outline: none;
        }
        .album-retry:hover, .album-retry:focus-visible {
          background: #1CB3E8;
          color: #0b0b0c;
          border-color: #1CB3E8;
          box-shadow: 0 0 0 3px rgba(28,179,232,.25);
        }
        .album-retry:active {
          background: #1490bf;
          border-color: #1490bf;
          color: #0b0b0c;
        }
      `}</style>
      <main style={{ background: "#0b0b0c", color: "#eee", minHeight: "100vh" }}>
        <header
          style={{
            padding: "clamp(80px, 12vh, 140px) clamp(20px, 6vw, 80px) 40px",
            borderBottom: "1px solid rgba(255,255,255,.08)",
          }}
        >
          <Link
            to="/"
            className="album-back"
            style={{
              color: "rgba(255,255,255,.55)",
              textDecoration: "none",
              fontFamily: "'Libre Franklin', sans-serif",
              fontSize: 12,
              letterSpacing: ".22em",
              textTransform: "uppercase",
            }}
          >
            ← DUNRITE
          </Link>
          <div
            style={{
              marginTop: 24,
              color: "#1CB3E8",
              fontFamily: "'Libre Franklin', sans-serif",
              fontSize: 12,
              letterSpacing: ".22em",
              textTransform: "uppercase",
            }}
          >
            {album.kicker}
          </div>
          <h1
            style={{
              fontFamily: "'Libre Franklin', sans-serif",
              fontWeight: 600,
              fontSize: "clamp(40px, 6vw, 84px)",
              lineHeight: 1.02,
              margin: "12px 0 18px",
              letterSpacing: "-.01em",
            }}
          >
            {album.title}
          </h1>
          <p
            style={{
              fontFamily: "'Source Serif 4', serif",
              maxWidth: 720,
              fontSize: "clamp(16px, 1.4vw, 19px)",
              lineHeight: 1.55,
              color: "rgba(235,235,235,.8)",
            }}
          >
            {album.description}
          </p>
          <a
            href={album.externalUrl}
            target="_blank"
            rel="noreferrer"
            className="album-cta"
            style={{
              display: "inline-block",
              marginTop: 28,
              padding: "12px 22px",
              border: "1px solid #1CB3E8",
              color: "#1CB3E8",
              textDecoration: "none",
              fontFamily: "'Libre Franklin', sans-serif",
              fontSize: 12,
              letterSpacing: ".22em",
              textTransform: "uppercase",
            }}
          >
            View on dunriteconstructiongroup.com →
          </a>
        </header>

        <section
          style={{
            padding: "60px clamp(20px, 6vw, 80px)",
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
            gap: 18,
          }}
        >
          {album.images.map((img: { src: string; alt: string }, i: number) => (
            <figure key={i} className="album-thumb" style={{ margin: 0, overflow: "hidden", borderRadius: 4, background: "#151517" }}>
              <img
                src={img.src}
                alt={img.alt}
                loading="lazy"
                referrerPolicy="no-referrer"
                style={{ width: "100%", height: "100%", display: "block", objectFit: "cover", aspectRatio: "4/3" }}
              />
            </figure>
          ))}
        </section>

        <nav
          style={{
            padding: "20px clamp(20px, 6vw, 80px) 80px",
            borderTop: "1px solid rgba(255,255,255,.08)",
            display: "flex",
            flexWrap: "wrap",
            gap: 18,
          }}
        >
          <div
            style={{
              width: "100%",
              color: "rgba(255,255,255,.5)",
              fontFamily: "'Libre Franklin', sans-serif",
              fontSize: 11,
              letterSpacing: ".22em",
              textTransform: "uppercase",
              marginBottom: 6,
            }}
          >
            Other Albums
          </div>
          {ALBUMS.filter((a) => a.slug !== album.slug).map((a) => (
            <Link
              key={a.slug}
              to="/albums/$slug"
              params={{ slug: a.slug }}
              className="album-link"
              style={{
                color: "#eee",
                textDecoration: "none",
                fontFamily: "'Libre Franklin', sans-serif",
                fontSize: 14,
                letterSpacing: ".08em",
                borderBottom: "1px solid rgba(28,179,232,.6)",
                paddingBottom: 2,
              }}
            >
              {a.title} →
            </Link>
          ))}
        </nav>
      </main>
    </>
  );
}
