import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { AppShell } from "@/components/dashboard/AppShell";
import { KpiCard } from "@/components/dashboard/KpiCard";
import { PageHeader } from "@/components/controls/PageHeader";
import { StatusBadge, OverdueBadge, DataCard } from "@/components/controls/primitives";
import {
  PUNCH_ITEMS,
  countByStatus,
  overdueCount,
  isOverdue,
  formatPunchDate,
  type PunchStatus,
} from "@/lib/field/punchList";

export const Route = createFileRoute("/_authenticated/app/punch-list")({
  head: () => ({
    meta: [
      { title: "Punch List — Dun Rite OS" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: PunchListPage,
});

const FILTERS: { id: PunchStatus | "all"; label: string }[] = [
  { id: "all", label: "All" },
  { id: "open", label: "Open" },
  { id: "ready-for-review", label: "Ready for Review" },
  { id: "closed", label: "Closed" },
];

function PunchListPage() {
  const [filter, setFilter] = useState<PunchStatus | "all">("all");
  const [q, setQ] = useState("");

  const rows = useMemo(() => {
    const needle = q.trim().toLowerCase();
    return PUNCH_ITEMS.filter((p) => {
      if (filter !== "all" && p.status !== filter) return false;
      if (!needle) return true;
      return [p.number, p.title, p.location, p.trade, p.assignee, p.responsibleCompany]
        .some((v) => v.toLowerCase().includes(needle));
    });
  }, [filter, q]);

  return (
    <AppShell title="Punch List" eyebrow="Field">
      <PageHeader
        title="Punch List"
        subtitle="Longleaf Amenity Center"
        breadcrumb={[{ label: "App", to: "/app" }, { label: "Punch List" }]}
      />

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-6">
        <KpiCard label="Open" value={countByStatus("open")} tone="gold" />
        <KpiCard label="Ready for Review" value={countByStatus("ready-for-review")} tone="blue" />
        <KpiCard label="Closed" value={countByStatus("closed")} tone="positive" />
        <KpiCard label="Overdue" value={overdueCount()} tone="negative" />
      </div>

      <DataCard
        title={
          <div className="flex items-center gap-2 flex-wrap">
            {FILTERS.map((f) => (
              <button
                key={f.id}
                type="button"
                onClick={() => setFilter(f.id)}
                className="pill focus-ring"
                style={{
                  cursor: "pointer",
                  background: filter === f.id ? "color-mix(in oklch, var(--brand-blue) 14%, transparent)" : "transparent",
                  color: filter === f.id ? "var(--brand-blue)" : "var(--fg-muted)",
                  borderColor: filter === f.id ? "color-mix(in oklch, var(--brand-blue) 50%, transparent)" : "var(--border-strong)",
                }}
              >
                {f.label}
              </button>
            ))}
          </div>
        }
        action={
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search items…"
            className="btn"
            style={{ minWidth: 200 }}
          />
        }
      >
        <table>
          <thead>
            <tr>
              <th>#</th><th>Title</th><th>Location</th><th>Trade</th><th>Assignee</th>
              <th>Priority</th><th>Due</th><th>Status</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((p) => (
              <tr key={p.id}>
                <td className="num text-muted">{p.number}</td>
                <td>
                  <div className="font-display font-semibold">{p.title}</div>
                  <div className="text-dim text-xs mt-0.5">{p.responsibleCompany}</div>
                </td>
                <td className="text-muted">{p.location}</td>
                <td className="text-muted">{p.trade}</td>
                <td>{p.assignee}</td>
                <td><StatusBadge status={p.priority} /></td>
                <td className="num">
                  <div className="flex items-center gap-2">
                    <span>{formatPunchDate(p.dueDate)}</span>
                    {isOverdue(p) && <OverdueBadge />}
                  </div>
                </td>
                <td><StatusBadge status={p.status} /></td>
              </tr>
            ))}
            {!rows.length && (
              <tr><td colSpan={8} className="text-center text-muted py-8">No items match.</td></tr>
            )}
          </tbody>
        </table>
      </DataCard>
    </AppShell>
  );
}
