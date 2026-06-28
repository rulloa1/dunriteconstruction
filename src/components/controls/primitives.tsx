import type { ReactNode } from "react";
import { Link } from "@tanstack/react-router";
import type { LogStatus, MilestoneStatus, ProcStatus } from "@/lib/controls/projectData";
import { currency } from "@/lib/controls/projectData";

/* ---------------- StatusBadge ---------------- */
export function StatusBadge({ status }: { status: MilestoneStatus | LogStatus | ProcStatus }) {
  const map: Record<string, { label: string; cls: string }> = {
    complete: { label: "Complete", cls: "bg-[color-mix(in_oklch,var(--positive)_18%,transparent)] text-positive border-[color-mix(in_oklch,var(--positive)_45%,transparent)]" },
    "in-progress": { label: "In Progress", cls: "bg-[color-mix(in_oklch,var(--brand-blue)_14%,transparent)] text-blue border-[color-mix(in_oklch,var(--brand-blue)_45%,transparent)]" },
    upcoming: { label: "Upcoming", cls: "text-muted border-[color:var(--border-strong)]" },
    "not-started": { label: "Not Started", cls: "text-muted border-[color:var(--border-strong)]" },
    open: { label: "Open", cls: "bg-[color-mix(in_oklch,var(--brand-gold)_14%,transparent)] text-gold border-[color-mix(in_oklch,var(--brand-gold)_45%,transparent)]" },
    closed: { label: "Closed", cls: "text-muted border-[color:var(--border-strong)]" },
  };
  const v = map[status] ?? map.upcoming;
  return (
    <span className={`pill ${v.cls}`} style={{ borderWidth: 1, borderStyle: "solid" }}>{v.label}</span>
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
