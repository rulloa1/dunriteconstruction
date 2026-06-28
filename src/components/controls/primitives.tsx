import type { ReactNode } from "react";
import { Link } from "@tanstack/react-router";
import type { LogStatus, MilestoneStatus, ProcStatus } from "@/lib/controls/projectData";
import { currency } from "@/lib/controls/projectData";

/* ---------------- StatusBadge ---------------- */
const GREEN_CLS = "bg-[color-mix(in_oklch,var(--positive)_18%,transparent)] text-positive border-[color-mix(in_oklch,var(--positive)_45%,transparent)]";
const BLUE_CLS = "bg-[color-mix(in_oklch,var(--brand-blue)_14%,transparent)] text-blue border-[color-mix(in_oklch,var(--brand-blue)_45%,transparent)]";
const GOLD_CLS = "bg-[color-mix(in_oklch,var(--brand-gold)_14%,transparent)] text-gold border-[color-mix(in_oklch,var(--brand-gold)_45%,transparent)]";
const RED_CLS = "bg-[color-mix(in_oklch,var(--negative)_12%,transparent)] text-negative border-[color-mix(in_oklch,var(--negative)_50%,transparent)]";
const MUTED_CLS = "text-muted border-[color:var(--border-strong)]";

const STATUS_MAP: Record<string, { label: string; cls: string }> = {
  complete: { label: "Complete", cls: GREEN_CLS },
  "in-progress": { label: "In Progress", cls: BLUE_CLS },
  upcoming: { label: "Upcoming", cls: MUTED_CLS },
  "not-started": { label: "Not Started", cls: MUTED_CLS },
  open: { label: "Open", cls: GOLD_CLS },
  closed: { label: "Closed", cls: MUTED_CLS },
  "ready-for-review": { label: "Ready for Review", cls: BLUE_CLS },
  passed: { label: "Passed", cls: GREEN_CLS },
  failed: { label: "Failed", cls: RED_CLS },
  scheduled: { label: "Scheduled", cls: BLUE_CLS },
  pending: { label: "Pending", cls: GOLD_CLS },
  low: { label: "Low", cls: MUTED_CLS },
  medium: { label: "Medium", cls: GOLD_CLS },
  high: { label: "High", cls: RED_CLS },
  subcontractor: { label: "Subcontractor", cls: BLUE_CLS },
  vendor: { label: "Vendor", cls: GOLD_CLS },
  owner: { label: "Owner", cls: GREEN_CLS },
  architect: { label: "Architect", cls: MUTED_CLS },
  gc: { label: "GC", cls: GREEN_CLS },
};

export function StatusBadge({ status, label }: { status: string; label?: string }) {
  const v = STATUS_MAP[status] ?? { label: label ?? status, cls: MUTED_CLS };
  return (
    <span className={`pill ${v.cls}`} style={{ borderWidth: 1, borderStyle: "solid" }}>{label ?? v.label}</span>
  );
}

/* ---------------- OverdueBadge ---------------- */
export function OverdueBadge() {
  return (
    <span className="pill" style={{ color: "var(--negative)", borderColor: "color-mix(in oklch, var(--negative) 50%, transparent)", background: "color-mix(in oklch, var(--negative) 12%, transparent)" }}>
      Overdue
    </span>
  );
}

/* ---------------- Variance ---------------- */
export function Variance({ value, hidePositiveSign = false }: { value: number; hidePositiveSign?: boolean }) {
  if (value === 0) return <span className="num text-muted">{currency(0)}</span>;
  const positive = value > 0; // under budget = positive (good)
  const cls = positive ? "text-positive" : "text-negative";
  const sign = positive && !hidePositiveSign ? "+" : positive ? "" : "−";
  return <span className={`num font-semibold ${cls}`}>{sign}{currency(Math.abs(value))}</span>;
}

/* ---------------- DataCard ---------------- */
export function DataCard({ title, action, children }: { title?: ReactNode; action?: ReactNode; children: ReactNode }) {
  return (
    <div className="card overflow-hidden">
      {(title || action) && (
        <div className="flex items-center justify-between px-4 sm:px-5 py-4 gap-3 border-b" style={{ borderColor: "var(--border-soft)" }}>
          {title && <div className="font-display font-semibold">{title}</div>}
          {action && <div className="flex items-center gap-2">{action}</div>}
        </div>
      )}
      <div className="overflow-x-auto">{children}</div>
    </div>
  );
}

/* ---------------- Breadcrumb ---------------- */
export function Breadcrumb({ items }: { items: { label: string; to?: string }[] }) {
  return (
    <nav className="kbd-label flex items-center gap-2 flex-wrap" aria-label="Breadcrumb">
      {items.map((it, i) => (
        <span key={i} className="flex items-center gap-2">
          {it.to ? (
            <Link to={it.to} className="hover:text-blue focus-ring">{it.label}</Link>
          ) : (
            <span className="text-muted">{it.label}</span>
          )}
          {i < items.length - 1 && <span className="text-dim">/</span>}
        </span>
      ))}
    </nav>
  );
}
