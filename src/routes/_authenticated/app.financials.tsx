import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { useSuspenseQuery, queryOptions } from "@tanstack/react-query";
import { Pencil, Trash2, Plus } from "lucide-react";
import { AppShell } from "@/components/dashboard/AppShell";
import { KpiCard } from "@/components/dashboard/KpiCard";
import { periodSummary, jobsInPeriod, jobTotals, fmtUSD, fmtPct, marginTone } from "@/lib/dashboard/data";
import { getFinancialsBundle } from "@/lib/dashboard/queries.functions";
import {
  PeriodLineFormDialog,
  DeletePeriodLineDialog,
  usePeriodDialogs,
  type PeriodKind,
} from "@/components/dashboard/PeriodDialogs";
import { LoadingBlock, ErrorBlock } from "./app.index";

const finQO = () =>
  queryOptions({ queryKey: ["financials"], queryFn: () => getFinancialsBundle() });

export const Route = createFileRoute("/_authenticated/app/financials")({
  loader: ({ context }) => {
    context.queryClient.ensureQueryData(finQO());
  },
  component: FinancialsPage,
  pendingComponent: () => <AppShell title="Financials"><LoadingBlock /></AppShell>,
  errorComponent: ErrorBlock,
});

type Preset = "month" | "quarter" | "ytd";

function rangeFor(preset: Preset): { from: string; to: string; label: string } {
  if (preset === "month") return { from: "2026-05-01", to: "2026-05-31", label: "May 2026" };
  if (preset === "quarter") return { from: "2026-04-01", to: "2026-06-30", label: "Q2 2026" };
  return { from: "2026-01-01", to: "2026-12-31", label: "YTD 2026" };
}

function FinancialsPage() {
  const { data } = useSuspenseQuery(finQO());
  const [preset, setPreset] = useState<Preset>("quarter");
  const range = rangeFor(preset);
  const s = useMemo(
    () => periodSummary({ jobs: data.jobs, overhead: data.overhead, draws: data.draws, from: range.from, to: range.to }),
    [data, range.from, range.to]
  );
  const periodJobs = useMemo(() => jobsInPeriod(data.jobs, range.from, range.to), [data.jobs, range.from, range.to]);
  const dialogs = usePeriodDialogs();
  const defaultPeriod = range.from.slice(0, 7);

  const overheadRows = data.overhead.filter((o) => o.period >= range.from.slice(0, 7) && o.period <= range.to.slice(0, 7));
  const drawRows = data.draws.filter((d) => d.period >= range.from.slice(0, 7) && d.period <= range.to.slice(0, 7));



  return (
    <AppShell
      eyebrow="Period rollup"
      title="Financials"
      actions={
        <div className="flex gap-1 p-1 rounded-lg" style={{ background: "var(--bg-card)", border: "1px solid var(--border-soft)" }}>
          {(["month", "quarter", "ytd"] as const).map((p) => (
            <button
              key={p}
              onClick={() => setPreset(p)}
              className="px-3 py-1.5 rounded-md font-ui text-xs uppercase tracking-wider focus-ring"
              style={{
                background: preset === p ? "var(--brand-blue-deep)" : "transparent",
                color: preset === p ? "white" : "var(--fg-muted)",
              }}
            >
              {p === "ytd" ? "YTD" : p}
            </button>
          ))}
        </div>
      }
    >
      <div className="kbd-label mb-3">Period · {range.label}</div>

      <section className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <KpiCard label="Jobs gross profit" value={fmtUSD(s.jobsGrossProfit)} tone="gold"
          sub={`${s.jobsCount} jobs · ${fmtUSD(s.jobsRevenue)} rev`} />
        <KpiCard label="Overhead" value={fmtUSD(s.overhead)} />
        <KpiCard label="Owner draws" value={fmtUSD(s.ownerDraws)} />
        <KpiCard label="Net to company" value={fmtUSD(s.netToCompany)}
          tone={s.netToCompany >= 0 ? "positive" : "negative"} />
      </section>

      <section className="mt-8 card p-5 sm:p-7">
        <div className="kbd-label mb-4">Reconciliation</div>
        <div className="grid sm:grid-cols-[1fr_auto_1fr_auto_1fr_auto_1fr] gap-3 sm:gap-4 items-center">
          <Step label="Jobs gross profit" value={fmtUSD(s.jobsGrossProfit)} tone="gold" />
          <Op>−</Op>
          <Step label="Overhead" value={fmtUSD(s.overhead)} />
          <Op>−</Op>
          <Step label="Owner draws" value={fmtUSD(s.ownerDraws)} />
          <Op>=</Op>
          <Step label="Net to company" value={fmtUSD(s.netToCompany)} tone={s.netToCompany >= 0 ? "positive" : "negative"} big />
        </div>
      </section>

      <section className="mt-8">
        <div className="flex items-end justify-between mb-3">
          <div>
            <div className="kbd-label">Jobs in period</div>
            <h2 className="font-display text-lg font-semibold">Contributing jobs</h2>
          </div>
        </div>
        <div className="card overflow-hidden">
          {periodJobs.length === 0 ? (
            <div className="p-8 text-center text-muted">No jobs fall in this window.</div>
          ) : (
            <div className="hidden md:block">
              <table>
                <thead>
                  <tr>
                    <th>Job</th>
                    <th>Status</th>
                    <th className="text-right">Revenue</th>
                    <th className="text-right">Cost</th>
                    <th className="text-right">GP</th>
                    <th className="text-right">Margin</th>
                  </tr>
                </thead>
                <tbody>
                  {periodJobs.map((j) => {
                    const t = jobTotals(j);
                    return (
                      <tr key={j.id}>
                        <td>
                          <div className="font-display font-semibold">{j.name}</div>
                          <div className="text-dim" style={{ fontSize: 12 }}>{j.client}</div>
                        </td>
                        <td><span className={`pill ${j.status === "active" ? "pill-active" : "pill-closed"}`}>{j.status}</span></td>
                        <td className="text-right num">{fmtUSD(t.revenue)}</td>
                        <td className="text-right num text-muted">{fmtUSD(t.totalCost)}</td>
                        <td className={`text-right num font-semibold ${marginTone(t.margin)}`}>{fmtUSD(t.grossProfit)}</td>
                        <td className={`text-right num font-semibold ${marginTone(t.margin)}`}>{fmtPct(t.margin)}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
          <div className="md:hidden divide-y" style={{ borderColor: "var(--border-soft)" }}>
            {periodJobs.map((j) => {
              const t = jobTotals(j);
              return (
                <div key={j.id} className="p-4">
                  <div className="font-display font-semibold">{j.name}</div>
                  <div className="text-dim text-xs">{j.client}</div>
                  <div className="mt-3 grid grid-cols-3 gap-2 num text-sm">
                    <div><div className="kbd-label">Rev</div><div className="font-semibold">{fmtUSD(t.revenue)}</div></div>
                    <div><div className="kbd-label">GP</div><div className={`font-semibold ${marginTone(t.margin)}`}>{fmtUSD(t.grossProfit)}</div></div>
                    <div><div className="kbd-label">%</div><div className={`font-semibold ${marginTone(t.margin)}`}>{fmtPct(t.margin)}</div></div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="mt-8 grid lg:grid-cols-2 gap-4">
        <PeriodCard
          title="Overhead detail"
          kind="overhead"
          rows={overheadRows.map((o) => ({ id: o.id, primary: o.category, period: o.period, amount: o.amount, raw: o }))}
          onAdd={() => dialogs.openCreate("overhead")}
          onEdit={(row) => dialogs.openEdit("overhead", row.raw)}
          onDelete={(row) => dialogs.openDelete("overhead", row.id, row.primary)}
        />
        <PeriodCard
          title="Owner draws"
          kind="draws"
          rows={drawRows.map((d) => ({ id: d.id, primary: d.owner, period: d.period, amount: d.amount, raw: d }))}
          onAdd={() => dialogs.openCreate("draws")}
          onEdit={(row) => dialogs.openEdit("draws", row.raw)}
          onDelete={(row) => dialogs.openDelete("draws", row.id, row.primary)}
        />
      </section>

      {(dialogs.state.mode === "create" || dialogs.state.mode === "edit") && (
        <PeriodLineFormDialog
          open
          onOpenChange={(v) => { if (!v) dialogs.close(); }}
          kind={dialogs.state.kind}
          row={dialogs.state.mode === "edit" ? dialogs.state.row : undefined}
          defaultPeriod={defaultPeriod}
        />
      )}
      {dialogs.state.mode === "delete" && (
        <DeletePeriodLineDialog
          open
          onOpenChange={(v) => { if (!v) dialogs.close(); }}
          kind={dialogs.state.kind}
          id={dialogs.state.id}
          label={dialogs.state.label}
        />
      )}
    </AppShell>
  );
}

type PeriodCardRow = {
  id: string;
  primary: string;
  period: string;
  amount: number;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  raw: any;
};

function PeriodCard({
  title, kind, rows, onAdd, onEdit, onDelete,
}: {
  title: string;
  kind: PeriodKind;
  rows: PeriodCardRow[];
  onAdd: () => void;
  onEdit: (row: PeriodCardRow) => void;
  onDelete: (row: PeriodCardRow) => void;
}) {
  void kind;
  return (
    <div className="card p-5">
      <div className="flex items-center justify-between mb-3">
        <div className="kbd-label">{title}</div>
        <button
          onClick={onAdd}
          className="btn focus-ring inline-flex items-center gap-1 text-xs"
        >
          <Plus size={14} /> Add
        </button>
      </div>
      {rows.length === 0 ? (
        <div className="text-dim text-sm py-4 text-center">No entries in this window.</div>
      ) : (
        <ul className="divide-y" style={{ borderColor: "var(--border-soft)" }}>
          {rows.map((r) => (
            <li key={r.id} className="flex items-center justify-between gap-3 py-2.5 text-sm">
              <span className="min-w-0 truncate">
                {r.primary} <span className="text-dim text-xs">· {r.period}</span>
              </span>
              <div className="flex items-center gap-2 shrink-0">
                <span className="num">{fmtUSD(r.amount)}</span>
                <button
                  onClick={() => onEdit(r)}
                  className="p-1.5 rounded-md focus-ring text-dim hover:text-fg"
                  aria-label="Edit"
                  style={{ border: "1px solid var(--border-soft)" }}
                >
                  <Pencil size={13} />
                </button>
                <button
                  onClick={() => onDelete(r)}
                  className="p-1.5 rounded-md focus-ring text-dim hover:text-fg"
                  aria-label="Delete"
                  style={{ border: "1px solid var(--border-soft)" }}
                >
                  <Trash2 size={13} />
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}


function Step({ label, value, tone, big }: { label: string; value: string; tone?: "gold" | "positive" | "negative"; big?: boolean }) {
  const toneClass = tone === "gold" ? "text-gold" : tone === "positive" ? "text-positive" : tone === "negative" ? "text-negative" : "";
  return (
    <div>
      <div className="kbd-label">{label}</div>
      <div className={`font-display num font-semibold ${big ? "text-3xl" : "text-2xl"} ${toneClass}`}>{value}</div>
    </div>
  );
}
function Op({ children }: { children: React.ReactNode }) {
  return <div className="hidden sm:flex justify-center text-dim font-display text-2xl">{children}</div>;
}
