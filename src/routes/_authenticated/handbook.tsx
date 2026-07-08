import { useMemo, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { BookOpen, Download, ExternalLink, FileDown } from "lucide-react";
import { AppShell } from "@/components/dashboard/AppShell";

export const Route = createFileRoute("/_authenticated/handbook")({
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

const BASE = "/handbook/";

const BOOKS = [
  {
    slug: "book-1-employee-handbook",
    num: "1",
    title: "Employee Handbook",
    sub: "Read & sign · Every employee",
    desc: "Employee Handbook · New Hire Orientation Guide · Drug-Free Workplace Program · Employee Sign-Off Forms — the complete Binder 1, merged and print-ready.",
  },
  {
    slug: "book-2-safety-manual",
    num: "2",
    title: "Safety Manual",
    sub: "Field & fleet · One per truck",
    desc: "Safety Manual · Fleet Safety Program — the complete Binder 2. The In-Vehicle Report Packet prints separately, one per truck.",
  },
  {
    slug: "book-3-forms-book",
    num: "3",
    title: "Forms Book",
    sub: "Office · Print as needed",
    desc: "HR, Field, Financial and Project & Closeout form packs — the complete Binder 3.",
  },
];

const FILLABLES = [
  {
    file: "DunRite_New_Hire_Packet_FILLABLE.pdf",
    title: "Complete New-Hire Packet",
    desc: "Application, IRS Form W-4 (2026), Form I-9 & supplements, ESI payroll & direct deposit — one duplex-ready file.",
  },
  {
    file: "DunRite_ESI_New_Hire_Form_FILLABLE.pdf",
    title: "ESI Payroll Information",
    desc: "New-hire payroll setup — employee info, pay type, deductions. Completed with ESI Payroll Services.",
  },
  {
    file: "DunRite_ESI_Direct_Deposit_Authorization_FILLABLE.pdf",
    title: "Direct Deposit Authorization",
    desc: "ESI ACH authorization — attach a voided check or mobile-banking screenshot.",
  },
  {
    file: "DunRite_I9_FILLABLE.pdf",
    title: "Form I-9",
    desc: "Employment eligibility verification with Lists of Acceptable Documents.",
  },
];

type Doc = { slug: string; title: string; cat: string; desc: string };

const DOCS: Doc[] = [
  { slug: "employee-handbook", title: "Employee Handbook", cat: "HR", desc: "Policies, benefits, conduct, and the at-will relationship — all 17 sections." },
  { slug: "new-hire-orientation-guide", title: "New Hire Orientation Guide", cat: "HR", desc: "What to bring, the first-day checklist, and the first 30 days." },
  { slug: "application-for-employment", title: "Application for Employment", cat: "HR", desc: "DunRite new-hire application — personal info, work history, references, certification." },
  { slug: "hr-forms-pack", title: "HR Forms Pack", cat: "HR", desc: "Employment Application, Corrective Action, Time-Off Request, Performance Review & Exit Checklist." },
  { slug: "employee-sign-off-forms", title: "Employee Sign-Off Forms", cat: "HR", desc: "Handbook, safety & policy receipts, PPE / equipment issue, and driver MVR authorization." },
  { slug: "employee-handbook-review-log", title: "Employee Handbook — Review Log", cat: "HR", desc: "Open review items and decisions for the handbook (internal)." },
  { slug: "safety-manual", title: "Safety Manual", cat: "Safety", desc: "OSHA 29 CFR 1926 jobsite safety programs and employee acknowledgement." },
  { slug: "drug-free-workplace-program", title: "Drug-Free Workplace Program", cat: "Safety", desc: "Fla. Stat. § 440.102 testing policy, employee rights, and acknowledgement." },
  { slug: "toolbox-talk-library", title: "Toolbox Talk Library", cat: "Safety", desc: "Twelve ready-to-run field safety talks with attendance sign-off." },
  { slug: "fleet-safety-program", title: "Fleet Safety Program", cat: "Fleet", desc: "Driver qualification, vehicle care, DOT/CDL, and accident response." },
  { slug: "in-vehicle-report-packet", title: "In-Vehicle Report Packet", cat: "Fleet", desc: "Glovebox kit — binder assignment, accident steps, inspection (DR-VIR-01), accident & incident report, mileage & fuel log." },
  { slug: "sop-manual", title: "SOP Manual", cat: "Operations", desc: "Standard operating procedures across field, project management, and finance." },
  { slug: "supervisor-handbook", title: "Supervisor Handbook", cat: "Operations", desc: "Leading crews, discipline, documentation, FLSA, and legal landmines." },
  { slug: "project-management-workbook", title: "Project Management Workbook", cat: "Operations", desc: "Per-project record — budget, bids, POs, RFIs, submittals, schedule & procurement." },
  { slug: "bid-packet-progress", title: "Bid Packet Progress", cat: "Operations", desc: "Bid package tracker — coverage by trade, bids received, leveling & award status." },
  { slug: "dropbox-project-folder-template", title: "Dropbox Project Folder Template", cat: "Operations", desc: "Standard project filing structure and what goes in each folder." },
  { slug: "field-forms-pack", title: "Field Forms Pack", cat: "Forms", desc: "Daily Field Report, Job Hazard Analysis (JHA) & Daily Safety Inspection." },
  { slug: "financial-forms-pack", title: "Financial Forms Pack", cat: "Forms", desc: "Purchase Order, Expense Report, Credit Card Log, Vendor/W-9 Setup & Change Order." },
  { slug: "project-closeout-forms", title: "Project & Closeout Forms", cat: "Forms", desc: "RFI, Submittal Transmittal, Florida lien waivers, Punch List & Closeout Checklist." },
  { slug: "binder-index", title: "Binder Index", cat: "Binder Kit", desc: "What lives in each binder — print insert for the front pocket of all three books." },
  { slug: "binder-cover-sheets", title: "Binder Cover Sheets", cat: "Binder Kit", desc: "Cover & spine inserts for the three printed binders." },
];

const CATS = ["All", "HR", "Safety", "Fleet", "Operations", "Forms", "Binder Kit"];

function CompanyDocuments() {
  const [cat, setCat] = useState("All");
  const docs = useMemo(() => (cat === "All" ? DOCS : DOCS.filter((d) => d.cat === cat)), [cat]);

  return (
    <AppShell eyebrow="Library" title="Company Documents">
      <p className="text-muted text-sm mb-6 max-w-2xl">
        The complete company document system — 2026 edition. Open any document to read it or print to PDF.
      </p>

      <SectionLabel>The Three Binders</SectionLabel>
      <div className="mb-8 grid gap-4 md:grid-cols-3">
        {BOOKS.map((b) => (
          <a
            key={b.slug}
            href={BASE + b.slug + ".html"}
            target="_blank"
            rel="noopener"
            className="group flex flex-col gap-3 rounded-xl border bg-sidebar p-5 text-sidebar-foreground shadow-sm transition-shadow hover:shadow-md"
          >
            <div className="flex items-center gap-3">
              <div className="grid h-10 w-10 shrink-0 place-items-center rounded-lg bg-primary/15 font-display text-lg font-bold text-primary">
                {b.num}
              </div>
              <div className="min-w-0">
                <h3 className="font-display text-sm font-semibold">Book {b.num} — {b.title}</h3>
                <p className="text-[11px] uppercase tracking-wide text-sidebar-foreground/60">{b.sub}</p>
              </div>
            </div>
            <p className="flex-1 text-sm leading-relaxed text-sidebar-foreground/80">{b.desc}</p>
            <span className="inline-flex items-center gap-1.5 text-sm font-medium text-primary">
              <ExternalLink className="h-3.5 w-3.5" /> Open Book {b.num}
            </span>
          </a>
        ))}
      </div>

      <SectionLabel>Fillable PDFs — fill on a computer, no printing required</SectionLabel>
      <div className="mb-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {FILLABLES.map((f) => (
          <div key={f.file} className="flex flex-col gap-3 rounded-xl border bg-card p-5 shadow-sm">
            <div className="flex-1">
              <h3 className="font-display text-sm font-semibold">{f.title}</h3>
              <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{f.desc}</p>
            </div>
            <a
              href={BASE + "fillable/" + f.file}
              download
              className="inline-flex items-center justify-center gap-1.5 rounded-lg border px-3 py-2 text-sm font-medium text-primary transition-colors hover:bg-muted"
            >
              <FileDown className="h-4 w-4" /> Download Fillable PDF
            </a>
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
            <a
              href={BASE + d.slug + ".html"}
              target="_blank"
              rel="noopener"
              className="inline-flex items-center justify-center gap-1.5 rounded-lg bg-primary px-3 py-2 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90"
            >
              <ExternalLink className="h-4 w-4" /> Open · Print to PDF
            </a>
          </div>
        ))}
      </div>

      <p className="mt-8 flex items-start gap-2 text-xs text-muted-foreground">
        <Download className="mt-0.5 h-3.5 w-3.5 shrink-0" />
        Every document opens print-ready — use your browser&apos;s Print → Save as PDF for a
        download. Retired versions live in the office archive, not here.
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
