import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft } from "lucide-react";
import { AppShell } from "@/components/dashboard/AppShell";
import { PdfFormFiller } from "@/components/handbook/PdfFormFiller";

export const Route = createFileRoute("/_authenticated/handbook/fill")({
  head: () => ({
    meta: [
      { title: "Fill a PDF | DunRite Construction Group" },
      {
        name: "description",
        content:
          "Upload any fillable PDF and complete it in-app — fields are detected automatically in your browser.",
      },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: FillPage,
});

function FillPage() {
  return (
    <AppShell eyebrow="Handbook" title="Fill a PDF">
      <div className="mb-4 flex flex-wrap items-start justify-between gap-3">
        <p className="text-muted max-w-2xl text-sm">
          Upload any fillable PDF. Its form fields are detected in your browser and rendered as an
          editable page — fill it in, then download the completed file.
        </p>
        <Link to="/handbook" className="btn focus-ring shrink-0">
          <ArrowLeft size={14} /> Back to Handbook
        </Link>
      </div>
      <PdfFormFiller />
    </AppShell>
  );
}
