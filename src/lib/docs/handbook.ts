export const HANDBOOK_BASE = "/handbook/";

export type HandbookEntry = {
  slug: string;
  title: string;
  cat: string;
  desc: string;
  kind: "html" | "pdf";
  file: string;
  sub?: string;
  num?: string;
};

export const BOOKS: HandbookEntry[] = [
  {
    slug: "book-1-employee-handbook",
    num: "1",
    title: "Employee Handbook",
    cat: "Binder",
    sub: "Read & sign · Every employee",
    kind: "html",
    file: HANDBOOK_BASE + "book-1-employee-handbook.html",
    desc: "Employee Handbook · New Hire Orientation Guide · Drug-Free Workplace Program · Employee Sign-Off Forms — the complete Binder 1, merged and print-ready.",
  },
  {
    slug: "book-2-safety-manual",
    num: "2",
    title: "Safety Manual",
    cat: "Binder",
    sub: "Field & fleet · One per truck",
    kind: "html",
    file: HANDBOOK_BASE + "book-2-safety-manual.html",
    desc: "Safety Manual · Fleet Safety Program — the complete Binder 2. The In-Vehicle Report Packet prints separately, one per truck.",
  },
  {
    slug: "book-3-forms-book",
    num: "3",
    title: "Forms Book",
    cat: "Binder",
    sub: "Office · Print as needed",
    kind: "html",
    file: HANDBOOK_BASE + "book-3-forms-book.html",
    desc: "HR, Field, Financial and Project & Closeout form packs — the complete Binder 3.",
  },
];

export const FILLABLES: HandbookEntry[] = [
  {
    slug: "fillable-new-hire-packet",
    title: "Complete New-Hire Packet",
    cat: "Fillable",
    kind: "pdf",
    file: HANDBOOK_BASE + "fillable/DunRite_New_Hire_Packet_FILLABLE.pdf",
    desc: "Application, IRS Form W-4 (2026), Form I-9 & supplements, ESI payroll & direct deposit — one duplex-ready file.",
  },
  {
    slug: "fillable-esi-new-hire",
    title: "ESI Payroll Information",
    cat: "Fillable",
    kind: "pdf",
    file: HANDBOOK_BASE + "fillable/DunRite_ESI_New_Hire_Form_FILLABLE.pdf",
    desc: "New-hire payroll setup — employee info, pay type, deductions. Completed with ESI Payroll Services.",
  },
  {
    slug: "fillable-direct-deposit",
    title: "Direct Deposit Authorization",
    cat: "Fillable",
    kind: "pdf",
    file: HANDBOOK_BASE + "fillable/DunRite_ESI_Direct_Deposit_Authorization_FILLABLE.pdf",
    desc: "ESI ACH authorization — attach a voided check or mobile-banking screenshot.",
  },
  {
    slug: "fillable-i9",
    title: "Form I-9",
    cat: "Fillable",
    kind: "pdf",
    file: HANDBOOK_BASE + "fillable/DunRite_I9_FILLABLE.pdf",
    desc: "Employment eligibility verification with Lists of Acceptable Documents.",
  },
];

const RAW_DOCS: Omit<HandbookEntry, "kind" | "file">[] = [
  {
    slug: "employee-handbook",
    title: "Employee Handbook",
    cat: "HR",
    desc: "Policies, benefits, conduct, and the at-will relationship — all 17 sections.",
  },
  {
    slug: "new-hire-orientation-guide",
    title: "New Hire Orientation Guide",
    cat: "HR",
    desc: "What to bring, the first-day checklist, and the first 30 days.",
  },
  {
    slug: "application-for-employment",
    title: "Application for Employment",
    cat: "HR",
    desc: "DunRite new-hire application — personal info, work history, references, certification.",
  },
  {
    slug: "hr-forms-pack",
    title: "HR Forms Pack",
    cat: "HR",
    desc: "Employment Application, Corrective Action, Time-Off Request, Performance Review & Exit Checklist.",
  },
  {
    slug: "employee-sign-off-forms",
    title: "Employee Sign-Off Forms",
    cat: "HR",
    desc: "Handbook, safety & policy receipts, PPE / equipment issue, and driver MVR authorization.",
  },
  {
    slug: "employee-handbook-review-log",
    title: "Employee Handbook — Review Log",
    cat: "HR",
    desc: "Open review items and decisions for the handbook (internal).",
  },
  {
    slug: "safety-manual",
    title: "Safety Manual",
    cat: "Safety",
    desc: "OSHA 29 CFR 1926 jobsite safety programs and employee acknowledgement.",
  },
  {
    slug: "drug-free-workplace-program",
    title: "Drug-Free Workplace Program",
    cat: "Safety",
    desc: "Fla. Stat. § 440.102 testing policy, employee rights, and acknowledgement.",
  },
  {
    slug: "toolbox-talk-library",
    title: "Toolbox Talk Library",
    cat: "Safety",
    desc: "Twelve ready-to-run field safety talks with attendance sign-off.",
  },
  {
    slug: "fleet-safety-program",
    title: "Fleet Safety Program",
    cat: "Fleet",
    desc: "Driver qualification, vehicle care, DOT/CDL, and accident response.",
  },
  {
    slug: "in-vehicle-report-packet",
    title: "In-Vehicle Report Packet",
    cat: "Fleet",
    desc: "Glovebox kit — binder assignment, accident steps, inspection (DR-VIR-01), accident & incident report, mileage & fuel log.",
  },
  {
    slug: "sop-manual",
    title: "SOP Manual",
    cat: "Operations",
    desc: "Standard operating procedures across field, project management, and finance.",
  },
  {
    slug: "supervisor-handbook",
    title: "Supervisor Handbook",
    cat: "Operations",
    desc: "Leading crews, discipline, documentation, FLSA, and legal landmines.",
  },
  {
    slug: "project-management-workbook",
    title: "Project Management Workbook",
    cat: "Operations",
    desc: "Per-project record — budget, bids, POs, RFIs, submittals, schedule & procurement.",
  },
  {
    slug: "bid-packet-progress",
    title: "Bid Packet Progress",
    cat: "Operations",
    desc: "Bid package tracker — coverage by trade, bids received, leveling & award status.",
  },
  {
    slug: "dropbox-project-folder-template",
    title: "Dropbox Project Folder Template",
    cat: "Operations",
    desc: "Standard project filing structure and what goes in each folder.",
  },
  {
    slug: "field-forms-pack",
    title: "Field Forms Pack",
    cat: "Forms",
    desc: "Daily Field Report, Job Hazard Analysis (JHA) & Daily Safety Inspection.",
  },
  {
    slug: "financial-forms-pack",
    title: "Financial Forms Pack",
    cat: "Forms",
    desc: "Purchase Order, Expense Report, Credit Card Log, Vendor/W-9 Setup & Change Order.",
  },
  {
    slug: "project-closeout-forms",
    title: "Project & Closeout Forms",
    cat: "Forms",
    desc: "RFI, Submittal Transmittal, Florida lien waivers, Punch List & Closeout Checklist.",
  },
  {
    slug: "binder-index",
    title: "Binder Index",
    cat: "Binder Kit",
    desc: "What lives in each binder — print insert for the front pocket of all three books.",
  },
  {
    slug: "binder-cover-sheets",
    title: "Binder Cover Sheets",
    cat: "Binder Kit",
    desc: "Cover & spine inserts for the three printed binders.",
  },
];

export const DOCS: HandbookEntry[] = RAW_DOCS.map((d) => ({
  ...d,
  kind: "html" as const,
  file: HANDBOOK_BASE + d.slug + ".html",
}));

export const ALL_HANDBOOK: HandbookEntry[] = [...BOOKS, ...FILLABLES, ...DOCS];

export function findHandbookEntry(slug: string): HandbookEntry | undefined {
  return ALL_HANDBOOK.find((e) => e.slug === slug);
}
