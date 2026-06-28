import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { AppShell } from "@/components/dashboard/AppShell";
import { PageHeader } from "@/components/controls/PageHeader";
import { findDoc } from "@/lib/docs/documents";
import { ArrowLeft, ExternalLink, Printer } from "lucide-react";

export const Route = createFileRoute("/_authenticated/app/documents/$docId")({
  head: () => ({ meta: [{ title: "Document — Dun Rite OS" }, { name: "robots", content: "noindex" }] }),
  component: DocumentReader,
  notFoundComponent: () => (
    <AppShell eyebrow="Documents" title="Not found">
      <div className="card p-8 text-center">
        <div className="font-display text-lg font-semibold">Document not found</div>
        <div className="text-muted text-sm mt-1">That document isn't in the library.</div>
        <Link to="/app/documents" className="btn btn-primary mt-4 inline-flex">Back to Documents</Link>
      </div>
    </AppShell>
  ),
});

function DocumentReader() {
  const { docId } = Route.useParams();
  const doc = findDoc(docId);
  const [errored, setErrored] = useState(false);

  if (!doc) {
    return (
      <AppShell eyebrow="Documents" title="Not found">
        <div className="card p-8 text-center">
          <div className="font-display text-lg font-semibold">Document not found</div>
          <Link to="/app/documents" className="btn btn-primary mt-4 inline-flex">Back to Documents</Link>
        </div>
      </AppShell>
    );
  }

  function printDoc() {
    const w = window.open(doc!.file, "_blank");
    if (w) w.addEventListener("load", () => w.print());
  }

  return (
    <AppShell
      eyebrow="Document"
      title={doc.title}
      actions={
        <>
          <a href={doc.file} target="_blank" rel="noreferrer" className="btn focus-ring">
            <ExternalLink size={14} /> <span className="hidden sm:inline">Open in new tab</span>
          </a>
          <button onClick={printDoc} className="btn focus-ring" type="button">
            <Printer size={14} /> <span className="hidden sm:inline">Print</span>
          </button>
        </>
      }
    >
      <PageHeader
        eyebrow={doc.group}
        title={doc.title}
        subtitle={doc.description}
        breadcrumb={[
          { label: "App", to: "/app" },
          { label: "Documents", to: "/app/documents" },
          { label: doc.title },
        ]}
        actions={
          <Link to="/app/documents" className="btn focus-ring">
            <ArrowLeft size={14} /> <span className="hidden sm:inline">Back to Documents</span>
          </Link>
        }
      />

      <div className="text-dim text-xs mb-2 font-ui">
        If this is blank, upload the file to <span className="num">public{doc.file}</span>
      </div>

      <div
        className="card overflow-hidden"
        style={{ background: "#fff", padding: 0 }}
      >
        <iframe
          src={doc.file}
          title={doc.title}
          onError={() => setErrored(true)}
          className="w-full block"
          style={{ height: "calc(100vh - 240px)", minHeight: 480, border: 0, background: "#fff" }}
        />
        {errored && (
          <div className="p-6 text-sm" style={{ color: "#444" }}>
            Could not load <code>{doc.file}</code>. Drop the file into <code>public{doc.file}</code>.
          </div>
        )}
      </div>
    </AppShell>
  );
}
