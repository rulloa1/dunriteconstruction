import { useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { AppShell } from "@/components/dashboard/AppShell";
import { findHandbookEntry } from "@/lib/docs/handbook";
import { PdfFormFiller } from "@/components/handbook/PdfFormFiller";
import { ArrowLeft, Download, ExternalLink, PenLine, Printer } from "lucide-react";

export const Route = createFileRoute("/_authenticated/handbook/$slug")({
  head: () => ({
    meta: [
      { title: "Handbook Viewer | DunRite Construction Group" },
      {
        name: "description",
        content: "Read, print, or download a DunRite handbook document in-app.",
      },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: HandbookViewer,
});

function NotFound() {
  return (
    <AppShell eyebrow="Handbook" title="Not found">
      <div className="card p-8 text-center">
        <div className="font-display text-lg font-semibold">Document not found</div>
        <div className="text-muted text-sm mt-1">
          That document isn&apos;t in the handbook library.
        </div>
        <Link to="/handbook" className="btn btn-primary mt-4 inline-flex">
          Back to Handbook
        </Link>
      </div>
    </AppShell>
  );
}

function HandbookViewer() {
  const { slug } = Route.useParams();
  const entry = findHandbookEntry(slug);
  const [mode, setMode] = useState<"view" | "fill">("view");

  if (!entry) return <NotFound />;

  const src = entry.kind === "pdf" ? `${entry.file}#view=FitH` : entry.file;

  function printDoc() {
    const w = window.open(entry!.file, "_blank");
    if (w) w.addEventListener("load", () => w.print());
  }

  return (
    <AppShell
      eyebrow={entry.cat}
      title={entry.title}
      actions={
        <>
          <a href={entry.file} target="_blank" rel="noreferrer" className="btn focus-ring">
            <ExternalLink size={14} /> <span className="hidden sm:inline">New tab</span>
          </a>
          <a href={entry.file} download className="btn focus-ring">
            <Download size={14} /> <span className="hidden sm:inline">Download</span>
          </a>
          <button onClick={printDoc} className="btn focus-ring" type="button">
            <Printer size={14} /> <span className="hidden sm:inline">Print</span>
          </button>
        </>
      }
    >
      <div className="mb-4 flex flex-wrap items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-muted max-w-2xl text-sm">{entry.desc}</p>
        </div>
        <Link to="/handbook" className="btn focus-ring shrink-0">
          <ArrowLeft size={14} /> Back to Handbook
        </Link>
      </div>

      {entry.kind === "pdf" && (
        <div className="mb-4 inline-flex rounded-lg border p-1">
          {(
            [
              ["view", "PDF viewer"],
              ["fill", "Fill in app"],
            ] as const
          ).map(([m, label]) => (
            <button
              key={m}
              type="button"
              onClick={() => setMode(m)}
              className={`inline-flex items-center gap-1.5 rounded-md px-3 py-1.5 text-sm font-medium transition-colors ${
                mode === m
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {m === "fill" && <PenLine className="h-3.5 w-3.5" />}
              {label}
            </button>
          ))}
        </div>
      )}

      {entry.kind === "pdf" && mode === "fill" ? (
        <PdfFormFiller src={entry.file} fileName={entry.file.split("/").pop()} />
      ) : (
        <div className="card overflow-hidden" style={{ background: "#fff", padding: 0 }}>
          <iframe
            src={src}
            title={entry.title}
            className="block w-full"
            style={{ height: "calc(100vh - 260px)", minHeight: 520, border: 0, background: "#fff" }}
          />
        </div>
      )}

      <p className="text-muted mt-3 text-xs">
        {entry.kind === "pdf"
          ? "Fillable PDF — use “Fill in app” to complete the detected fields and download your filled copy."
          : "Print-ready document — use Print → Save as PDF for a downloadable copy."}
      </p>
    </AppShell>
  );
}
