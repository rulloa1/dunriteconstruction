import { createFileRoute } from "@tanstack/react-router";
import { useState, type ReactNode } from "react";
import { Download } from "lucide-react";
import { AppShell } from "@/components/dashboard/AppShell";
import { KpiCard } from "@/components/dashboard/KpiCard";
import { PageHeader } from "@/components/controls/PageHeader";
import { SectionActions } from "@/components/controls/SectionActions";
import { StatusBadge, OverdueBadge, Variance, DataCard } from "@/components/controls/primitives";
import {
  PROJECT,
  CONTRACTS,
  BIDS,
  MILESTONES,
  DELAYS,
  DELAY_NOTE,
  RFIS,
  SUBMITTALS,
  PROCUREMENT,
  currency,
  formatDate,
  formatDateRange,
  daysOpen,
  isOverdue,
  poForCode,
  getCurrentBudget,
  getCommittedToDate,
  getCommittedPct,
  getNetVariance,
  getContingencyVariance,
  getOpenRfiCount,
  getOpenSubmittalCount,
  getMilestoneProgress,
  getTotalDelayDays,
  getTotalBudget,
  getTotalContracted,
  getCompletedMilestones,
} from "@/lib/controls/projectData";

export const Route = createFileRoute("/_authenticated/app/controls")({
  head: () => ({
    meta: [
      { title: "Project Controls — Dun Rite OS" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: ControlsPage,
});

type Tab = "overview" | "schedule" | "budget" | "bids" | "logs" | "procurement";

const TABS: { id: Tab; label: string }[] = [
  { id: "overview", label: "Overview" },
  { id: "schedule", label: "Schedule" },
  { id: "budget", label: "Budget" },
  { id: "bids", label: "Bids" },
  { id: "logs", label: "Logs" },
  { id: "procurement", label: "Procurement" },
];

function ControlsPage() {
  const [tab, setTab] = useState<Tab>("overview");
  return (
    <AppShell
      eyebrow="Project Controls"
      title={PROJECT.name}
      actions={
        <>
          {tab === "bids" && (
            <a
              href="/docs/bid-packet-bp-2026-014.pdf"
              target="_blank"
              rel="noreferrer"
              className="btn btn-primary focus-ring"
            >
              <Download size={14} /> <span className="hidden sm:inline">Download Bid Packet</span>
            </a>
          )}
          <SectionActions />
        </>
      }
    >
      <PageHeader
        eyebrow="Flagship project"
        title={PROJECT.name}
        subtitle={
          <span>
            {PROJECT.location} · {formatDateRange(PROJECT.startDate, PROJECT.targetCompletion)} ·{" "}
            <span className="text-muted">{PROJECT.scheduleMonths} mo schedule</span>
          </span>
        }
        breadcrumb={[{ label: "App", to: "/app" }, { label: "Project Controls" }]}
      />

      <div className="flex flex-wrap gap-1 mb-6 border-b" style={{ borderColor: "var(--border-soft)" }}>
        {TABS.map((t) => {
          const active = tab === t.id;
          return (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className="px-4 py-2 text-sm font-display focus-ring -mb-px transition-colors"
              style={{
                color: active ? "var(--fg)" : "var(--fg-muted)",
                borderBottom: `2px solid ${active ? "var(--brand-gold)" : "transparent"}`,
              }}
            >
              {t.label}
            </button>
          );
        })}
      </div>

      {tab === "overview" && <OverviewTab />}
      {tab === "schedule" && <ScheduleTab />}
      {tab === "budget" && <BudgetTab />}
      {tab === "bids" && <BidsTab />}
      {tab === "logs" && <LogsTab />}
      {tab === "procurement" && <ProcurementTab />}
    </AppShell>
  );
}

/* ----------------- Overview ----------------- */
function OverviewTab() {
  const netVar = getNetVariance();
  const contVar = getContingencyVariance();
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
        <KpiCard label="Current Budget" value={currency(getCurrentBudget())} sub="Original + approved NOCIs" />
        <KpiCard
          label="Committed to Date"
          value={currency(getCommittedToDate())}
          sub={`${getCommittedPct()}% of current budget`}
          tone="blue"
        />
        <KpiCard
          label="Net Variance"
          value={<Variance value={netVar} />}
          sub={netVar >= 0 ? "Under budget" : "Over budget"}
          tone={netVar >= 0 ? "positive" : "negative"}
        />
        <KpiCard
          label="Contingency"
          value={<Variance value={contVar} />}
          sub={contVar >= 0 ? "Remaining" : "Overdrawn"}
          tone={contVar >= 0 ? "gold" : "negative"}
        />
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
        <KpiCard label="Open RFIs" value={getOpenRfiCount()} sub={`${RFIS.length} total`} />
        <KpiCard label="Open Submittals" value={getOpenSubmittalCount()} sub={`${SUBMITTALS.length} total`} />
        <KpiCard
          label="Milestone Progress"
          value={`${getMilestoneProgress()}%`}
          sub={`${getCompletedMilestones()} of ${MILESTONES.length} complete`}
          tone="positive"
        />
        <KpiCard label="Total Delay Days" value={getTotalDelayDays()} sub={`${DELAYS.length} events`} tone="gold" />
      </div>

      <DataCard title="Milestone Snapshot">
        <table>
          <thead>
            <tr>
              <th>Milestone</th>
              <th>Scheduled</th>
              <th>Actual</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {MILESTONES.map((m) => (
              <tr key={m.name}>
                <td className="font-display">{m.name}</td>
                <td className="num">{formatDate(m.scheduled)}</td>
                <td className="num">{formatDate(m.actual)}</td>
                <td><StatusBadge status={m.status} /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </DataCard>
    </div>
  );
}

/* ----------------- Schedule ----------------- */
function ScheduleTab() {
  return (
    <div className="space-y-6">
      <DataCard title={`Milestones · ${getCompletedMilestones()} of ${MILESTONES.length} complete`}>
        <table>
          <thead>
            <tr><th>Milestone</th><th>Scheduled</th><th>Actual</th><th>Variance</th><th>Status</th></tr>
          </thead>
          <tbody>
            {MILESTONES.map((m) => {
              const diff = m.actual
                ? Math.round((new Date(m.actual).getTime() - new Date(m.scheduled).getTime()) / 86_400_000)
                : null;
              return (
                <tr key={m.name}>
                  <td className="font-display">{m.name}</td>
                  <td className="num">{formatDate(m.scheduled)}</td>
                  <td className="num">{formatDate(m.actual)}</td>
                  <td className="num">
                    {diff === null ? <span className="text-dim">—</span>
                      : diff === 0 ? <span className="text-positive">On time</span>
                      : diff > 0 ? <span className="text-negative">+{diff}d</span>
                      : <span className="text-positive">{diff}d</span>}
                  </td>
                  <td><StatusBadge status={m.status} /></td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </DataCard>

      <DataCard title={`Delays · ${getTotalDelayDays()} total days`}>
        <table>
          <thead>
            <tr><th>#</th><th>Description</th><th>Period</th><th className="text-right">Days</th></tr>
          </thead>
          <tbody>
            {DELAYS.map((d) => (
              <tr key={d.num}>
                <td className="text-dim num">{d.num}</td>
                <td>{d.description}</td>
                <td className="num">{formatDateRange(d.start, d.end)}</td>
                <td className="num text-right font-display">{d.days}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="px-5 py-3 text-sm text-muted border-t" style={{ borderColor: "var(--border-soft)" }}>
          {DELAY_NOTE}
        </div>
      </DataCard>
    </div>
  );
}

/* ----------------- Budget ----------------- */
function BudgetTab() {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
        <KpiCard label="Total Budget" value={currency(getTotalBudget())} />
        <KpiCard label="Total Contracted" value={currency(getTotalContracted())} tone="blue" />
        <KpiCard label="Net Variance" value={<Variance value={getNetVariance()} />} tone={getNetVariance() >= 0 ? "positive" : "negative"} />
        <KpiCard label="Committed %" value={`${getCommittedPct()}%`} tone="gold" />
      </div>
      <DataCard title="Contracts by Cost Code">
        <table>
          <thead>
            <tr>
              <th>Code</th>
              <th>Description</th>
              <th className="text-right">Budget</th>
              <th className="text-right">Contract</th>
              <th className="text-right">Variance</th>
              <th>Subcontractor</th>
            </tr>
          </thead>
          <tbody>
            {CONTRACTS.map((c) => (
              <tr key={c.code}>
                <td className="num text-dim">{c.code}</td>
                <td className="font-display">{c.description}</td>
                <td className="num text-right">{currency(c.originalBudget)}</td>
                <td className="num text-right">{currency(c.contractAmount)}</td>
                <td className="text-right"><Variance value={c.originalBudget - c.contractAmount} /></td>
                <td className="text-muted">{c.subcontractor}</td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr style={{ background: "color-mix(in oklch, var(--brand-blue) 8%, transparent)" }}>
              <td colSpan={2} className="font-display p-4">Totals</td>
              <td className="num text-right font-display p-4">{currency(getTotalBudget())}</td>
              <td className="num text-right font-display p-4">{currency(getTotalContracted())}</td>
              <td className="text-right p-4"><Variance value={getNetVariance()} /></td>
              <td className="p-4" />
            </tr>
          </tfoot>
        </table>
      </DataCard>
    </div>
  );
}

/* ----------------- Bids ----------------- */
function BidsTab() {
  return (
    <div className="space-y-4">
      {BIDS.map((b) => {
        const variance = b.budget - b.awardedAmount;
        return (
          <DataCard
            key={b.code}
            title={
              <span className="flex items-baseline gap-3 flex-wrap">
                <span className="text-dim num">{b.code}</span>
                <span>{b.description}</span>
              </span>
            }
            action={
              <div className="flex items-center gap-4 text-sm">
                <span className="text-muted">Budget <span className="num font-display">{currency(b.budget)}</span></span>
                <span><Variance value={variance} /></span>
              </div>
            }
          >
            <table>
              <thead>
                <tr><th>Bidder</th><th className="text-right">Amount</th><th>Status</th><th>Note</th></tr>
              </thead>
              <tbody>
                {b.bids.map((e, i) => (
                  <tr key={i}>
                    <td className={e.status === "awarded" ? "font-display text-blue" : ""}>{e.bidder}</td>
                    <td className="num text-right">{currency(e.amount)}</td>
                    <td>
                      <span
                        className="pill"
                        style={
                          e.status === "awarded"
                            ? { color: "var(--positive)", borderColor: "color-mix(in oklch, var(--positive) 50%, transparent)", background: "color-mix(in oklch, var(--positive) 14%, transparent)" }
                            : e.status === "rejected"
                            ? { color: "var(--negative)", borderColor: "color-mix(in oklch, var(--negative) 50%, transparent)", background: "color-mix(in oklch, var(--negative) 12%, transparent)" }
                            : undefined
                        }
                      >
                        {e.status}
                      </span>
                    </td>
                    <td className="text-muted text-sm">{e.note ?? ""}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            {b.footnote && (
              <div className="px-5 py-3 text-xs text-muted border-t" style={{ borderColor: "var(--border-soft)" }}>{b.footnote}</div>
            )}
          </DataCard>
        );
      })}
    </div>
  );
}

/* ----------------- Logs ----------------- */
function LogsTab() {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4">
        <KpiCard label="Open RFIs" value={getOpenRfiCount()} tone="gold" />
        <KpiCard label="Open Submittals" value={getOpenSubmittalCount()} tone="gold" />
        <KpiCard label="Delay Days" value={getTotalDelayDays()} />
      </div>

      <DataCard title="RFIs">
        <table>
          <thead>
            <tr><th>#</th><th>Description</th><th>Issued</th><th>Required</th><th>Received</th><th className="text-right">Cost Impact</th><th>Days Open</th><th>Status</th></tr>
          </thead>
          <tbody>
            {RFIS.map((r) => (
              <tr key={r.num}>
                <td className="num text-dim">{r.num}</td>
                <td>{r.description}</td>
                <td className="num">{formatDate(r.issueDate)}</td>
                <td className="num">{formatDate(r.required)}</td>
                <td className="num">{formatDate(r.received)}</td>
                <td className="num text-right">{r.costImpact ? currency(r.costImpact) : <span className="text-dim">—</span>}</td>
                <td className="num">{daysOpen(r)}</td>
                <td className="flex items-center gap-2">
                  <StatusBadge status={r.status} />
                  {isOverdue(r) && <OverdueBadge />}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </DataCard>

      <DataCard title="Submittals">
        <table>
          <thead>
            <tr><th>#</th><th>Description</th><th>Vendor</th><th>Issued</th><th>Required</th><th>Received</th><th>Days Open</th><th>Status</th></tr>
          </thead>
          <tbody>
            {SUBMITTALS.map((s) => (
              <tr key={s.num}>
                <td className="num text-dim">{s.num}</td>
                <td>{s.description}</td>
                <td className="text-muted">{s.vendor ?? "—"}</td>
                <td className="num">{formatDate(s.issueDate)}</td>
                <td className="num">{formatDate(s.required)}</td>
                <td className="num">{formatDate(s.received)}</td>
                <td className="num">{daysOpen(s)}</td>
                <td className="flex items-center gap-2">
                  <StatusBadge status={s.status} />
                  {isOverdue(s) && <OverdueBadge />}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </DataCard>

      <DataCard title="Delays">
        <table>
          <thead>
            <tr><th>#</th><th>Description</th><th>Period</th><th className="text-right">Days</th></tr>
          </thead>
          <tbody>
            {DELAYS.map((d) => (
              <tr key={d.num}>
                <td className="text-dim num">{d.num}</td>
                <td>{d.description}</td>
                <td className="num">{formatDateRange(d.start, d.end)}</td>
                <td className="num text-right font-display">{d.days}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </DataCard>
    </div>
  );
}

/* ----------------- Procurement ----------------- */
function ProcurementTab(): ReactNode {
  return (
    <DataCard title="Buyout Log">
      <table>
        <thead>
          <tr>
            <th>Item</th>
            <th>PO #</th>
            <th>Vendor</th>
            <th>Committed</th>
            <th>Purchased</th>
            <th>Expected Delivery</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {PROCUREMENT.map((p) => {
            const pos = p.costCodes.map(poForCode).filter((x) => x !== "—");
            return (
              <tr key={p.item}>
                <td className="font-display">{p.item}</td>
                <td className="num text-dim">{pos.length ? pos.join(", ") : "—"}</td>
                <td className="text-muted">{p.vendor}</td>
                <td>{p.committed ? <span className="text-positive">✓</span> : <span className="text-dim">—</span>}</td>
                <td>{p.purchased ? <span className="text-positive">✓</span> : <span className="text-dim">—</span>}</td>
                <td className="num">{p.expectedDelivery}</td>
                <td><StatusBadge status={p.status} /></td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </DataCard>
  );
}
