import { useMemo, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { BookOpen, Download, ExternalLink, Eye, FileDown, FileUp } from "lucide-react";
import { AppShell } from "@/components/dashboard/AppShell";
import { BOOKS, DOCS, FILLABLES } from "@/lib/docs/handbook";

export const Route = createFileRoute("/_authenticated/handbook/")({
  head: () => ({
    meta: [
      { title: "Company Documents | DunRite Construction Group" },
      {
        name: "description",
        content:
          "The complete DunRite document system — employee handbook, safety manual, forms book, and fillable onboarding PDFs.",
      },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: CompanyDocuments,
});

const CATS = ["All", "HR", "Safety", "Fleet", "Operations", "Forms", "Binder Kit"];

function CompanyDocuments() {
  const [cat, setCat] = useState("All");
  const docs = useMemo(() => (cat === "All" ? DOCS : DOCS.filter((d) => d.cat === cat)), [cat]);

  return (
    <AppShell eyebrow="Library" title="Company Documents">
      <p className="text-muted mb-6 max-w-2xl text-sm">
        The complete company document system — 2026 edition. Preview any document in-app, then print
        or download it.
      </p>

      <SectionLabel>The Three Binders</SectionLabel>
      <div className="mb-8 grid gap-4 md:grid-cols-3">
        {BOOKS.map((b) => (
          <div
            key={b.slug}
            className="flex flex-col gap-3 rounded-xl border bg-sidebar p-5 text-sidebar-foreground shadow-sm"
          >
            <div className="flex items-center gap-3">
              <div className="grid h-10 w-10 shrink-0 place-items-center rounded-lg bg-primary/15 font-display text-lg font-bold text-primary">
                {b.num}
              </div>
              <div className="min-w-0">
                <h3 className="font-display text-sm font-semibold">
                  Book {b.num} — {b.title}
                </h3>
                <p className="text-[11px] uppercase tracking-wide text-sidebar-foreground/60">
                  {b.sub}
                </p>
              </div>
            </div>
            <p className="flex-1 text-sm leading-relaxed text-sidebar-foreground/80">{b.desc}</p>
            <div className="flex flex-wrap items-center gap-2">
              <Link
                to="/handbook/$slug"
                params={{ slug: b.slug }}
                className="inline-flex items-center gap-1.5 rounded-lg bg-primary px-3 py-2 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90"
              >
                <Eye className="h-4 w-4" /> Preview
              </Link>
              <a
                href={b.file}
                target="_blank"
                rel="noopener"
                className="inline-flex items-center gap-1.5 rounded-lg border px-3 py-2 text-sm font-medium transition-colors hover:bg-muted"
              >
                <ExternalLink className="h-3.5 w-3.5" /> New tab
              </a>
            </div>
          </div>
        ))}
      </div>

      <div className="mb-6 flex flex-wrap items-center justify-between gap-3 rounded-xl border bg-card p-4">
        <div>
          <h3 className="font-display text-sm font-semibold">Have another PDF to fill out?</h3>
          <p className="text-sm text-muted-foreground">
            Upload it and we&apos;ll detect its fields and render an editable form page.
          </p>
        </div>
        <Link
          to="/handbook/fill"
          className="inline-flex items-center gap-1.5 rounded-lg bg-primary px-3 py-2 text-sm font-medium text-primary-foreground"
        >
          <FileUp className="h-4 w-4" /> Upload a PDF
        </Link>
      </div>

      <SectionLabel>Fillable PDFs — fill on a computer, no printing required</SectionLabel>
      <div className="mb-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {FILLABLES.map((f) => (
          <div key={f.slug} className="flex flex-col gap-3 rounded-xl border bg-card p-5 shadow-sm">
            <div className="flex-1">
              <h3 className="font-display text-sm font-semibold">{f.title}</h3>
              <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{f.desc}</p>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <Link
                to="/handbook/$slug"
                params={{ slug: f.slug }}
                className="inline-flex items-center gap-1.5 rounded-lg bg-primary px-3 py-2 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90"
              >
                <Eye className="h-4 w-4" /> Preview
              </Link>
              <a
                href={f.file}
                download
                className="inline-flex items-center gap-1.5 rounded-lg border px-3 py-2 text-sm font-medium text-primary transition-colors hover:bg-muted"
              >
                <FileDown className="h-4 w-4" /> Download
              </a>
            </div>
          </div>
        ))}
      </div>

      <SectionLabel>All Documents</SectionLabel>
      <div className="mb-4 flex flex-wrap gap-2">
        {CATS.map((c) => (
          <button
            key={c}
            onClick={() => setCat(c)}
            className={`rounded-full border px-3.5 py-1.5 text-xs font-medium transition-colors ${
              cat === c
                ? "border-primary bg-primary text-primary-foreground"
                : "bg-card text-muted-foreground hover:text-foreground"
            }`}
          >
            {c}
          </button>
        ))}
      </div>
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {docs.map((d) => (
          <div key={d.slug} className="flex flex-col gap-3 rounded-xl border bg-card p-5 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-primary/10 text-primary">
                <BookOpen className="h-4 w-4" />
              </div>
              <span className="rounded-full border px-2.5 py-0.5 text-[10.5px] font-semibold uppercase tracking-wide text-muted-foreground">
                {d.cat}
              </span>
            </div>
            <div className="flex-1">
              <h3 className="font-display text-sm font-semibold">{d.title}</h3>
              <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{d.desc}</p>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <Link
                to="/handbook/$slug"
                params={{ slug: d.slug }}
                className="inline-flex items-center gap-1.5 rounded-lg bg-primary px-3 py-2 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90"
              >
                <Eye className="h-4 w-4" /> Preview
              </Link>
              <a
                href={d.file}
                target="_blank"
                rel="noopener"
                className="inline-flex items-center gap-1.5 rounded-lg border px-3 py-2 text-sm font-medium transition-colors hover:bg-muted"
              >
                <ExternalLink className="h-3.5 w-3.5" /> New tab
              </a>
            </div>
          </div>
        ))}
      </div>

      <p className="mt-8 flex items-start gap-2 text-xs text-muted-foreground">
        <Download className="mt-0.5 h-3.5 w-3.5 shrink-0" />
        Every document opens print-ready — use the Print action in the viewer, or your
        browser&apos;s Print → Save as PDF for a download. Retired versions live in the office
        archive, not here.
      </p>
    </AppShell>
  );
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="mb-3 text-[11px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">
      {children}
    </h2>
  );
}
