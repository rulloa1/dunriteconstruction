import { createFileRoute, Link, notFound, useParams } from "@tanstack/react-router";
import { useMemo } from "react";
import { useSuspenseQuery, queryOptions } from "@tanstack/react-query";
import { AppShell } from "@/components/dashboard/AppShell";
import { KpiCard } from "@/components/dashboard/KpiCard";
import { CostSection, LineRow } from "@/components/dashboard/CostSection";
import {
  jobTotals, fmtUSD, fmtPct, marginTone,
  laborTotal, materialsTotal, subsTotal, equipmentTotal, sum,
  type Job,
} from "@/lib/dashboard/data";
import { getJobById } from "@/lib/dashboard/queries.functions";
import { ArrowLeft } from "lucide-react";
import { LoadingBlock, ErrorBlock } from "./app.index";

const jobQO = (id: string) =>
  queryOptions({
    queryKey: ["job", id],
    queryFn: async () => {
      const j = await getJobById({ data: { id } });
      if (!j) throw notFound();
      return j as Job;
    },
  });

export const Route = createFileRoute("/_authenticated/app/jobs/$jobId")({
  loader: ({ context, params }) => {
    context.queryClient.ensureQueryData(jobQO(params.jobId));
  },
  component: JobDetail,
  pendingComponent: () => <AppShell title="Loading job…"><LoadingBlock /></AppShell>,
  errorComponent: ErrorBlock,
  notFoundComponent: () => (
    <AppShell title="Job not found">
      <p className="text-muted">That job ID doesn't exist. <Link to="/app/jobs" className="text-blue underline">Back to jobs</Link>.</p>
    </AppShell>
  ),
});

function groupBy<T, K extends string>(items: T[], key: (t: T) => K): Record<K, T[]> {
  return items.reduce((acc, item) => {
    const k = key(item);
    (acc[k] ||= []).push(item);
    return acc;
  }, {} as Record<K, T[]>);
}

function JobDetail() {
  const { jobId } = useParams({ from: "/_authenticated/app/jobs/$jobId" });
  const { data: job } = useSuspenseQuery(jobQO(jobId));
  const t = jobTotals(job);
  const subsByTrade = useMemo(() => groupBy(job.subs, (s) => s.trade), [job.subs]);
  const equipByCat = useMemo(() => groupBy(job.equipment, (e) => e.category), [job.equipment]);

  return (
    <AppShell
      eyebrow={`${job.client} · ${job.county} County`}
      title={job.name}
      actions={
        <>
          <span className={`pill ${job.status === "active" ? "pill-active" : "pill-closed"}`}>{job.status}</span>
          <Link to="/app/jobs" className="btn focus-ring"><ArrowLeft size={14} /> Jobs</Link>
        </>
      }
    >
      <section className="grid grid-cols-2 lg:grid-cols-5 gap-3 sm:gap-4">
        <KpiCard label="Revenue" value={fmtUSD(t.revenue)} tone="blue"
          sub={`${fmtUSD(t.contract)} contract${t.changeOrders ? ` + ${fmtUSD(t.changeOrders)} COs` : ""}`} />
        <KpiCard label="Total cost" value={fmtUSD(t.totalCost)} />
        <KpiCard label="Gross profit" value={fmtUSD(t.grossProfit)} tone="gold" />
        <KpiCard label="Margin" value={fmtPct(t.margin)} />
        <KpiCard label="Started" value={new Date(job.startDate).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
          sub={job.closedDate ? `Closed ${new Date(job.closedDate).toLocaleDateString("en-US")}` : "In progress"} />
      </section>

      <section className="mt-8">
        <div className="kbd-label mb-3">Revenue</div>
        <div className="card overflow-hidden">
          <LineRow primary={<span className="font-semibold">Contract amount</span>} secondary="Base award" amount={job.contractAmount} />
          {job.changeOrders.map((c) => (
            <LineRow key={c.id} primary={<span>Change order — {c.description}</span>} secondary={new Date(c.date).toLocaleDateString("en-US")} amount={c.amount} />
          ))}
          <div className="px-4 sm:px-5 py-3 flex items-center justify-between" style={{ background: "var(--bg-elev)" }}>
            <div className="font-display font-semibold">Total revenue</div>
            <div className="font-display num font-semibold text-blue">{fmtUSD(t.revenue)}</div>
          </div>
        </div>
      </section>

      <section className="mt-8">
        <div className="kbd-label mb-3">Cost breakdown</div>
        <div className="grid gap-3 sm:gap-4">
          <CostSection title="Labor" subtotal={laborTotal(job.labor)} count={job.labor.length}>
            {job.labor.map((l) => (
              <LineRow
                key={l.id}
                primary={<><span className="font-semibold">{l.worker}</span> <span className="text-dim">· {l.role}</span></>}
                secondary={`${l.hours} hrs @ ${fmtUSD(l.rate)}/hr`}
                qty={`${l.hours} × ${fmtUSD(l.rate)}`}
                amount={l.hours * l.rate}
              />
            ))}
          </CostSection>

          <CostSection title="Materials" subtotal={materialsTotal(job.materials)} count={job.materials.length}>
            {job.materials.map((m) => (
              <LineRow
                key={m.id}
                primary={<span className="font-semibold">{m.item}</span>}
                secondary={`${m.qty} ${m.unit} @ ${fmtUSD(m.unitCost)}`}
                qty={`${m.qty} ${m.unit}`}
                amount={m.qty * m.unitCost}
              />
            ))}
          </CostSection>

          <CostSection title="Subcontractors" subtotal={subsTotal(job.subs)} count={job.subs.length}>
            {Object.entries(subsByTrade).map(([trade, lines]) => (
              <div key={trade}>
                <div className="px-4 sm:px-5 py-2 kbd-label" style={{ background: "var(--bg-elev)" }}>
                  {trade} · {fmtUSD(sum(lines.map((s) => s.amount)))}
                </div>
                {lines.map((s) => (
                  <LineRow key={s.id} primary={<span className="font-semibold">{s.vendor}</span>} secondary={s.trade} amount={s.amount} />
                ))}
              </div>
            ))}
          </CostSection>

          <CostSection title="Equipment" subtotal={equipmentTotal(job.equipment)} count={job.equipment.length}>
            {Object.entries(equipByCat).map(([cat, lines]) => (
              <div key={cat}>
                <div className="px-4 sm:px-5 py-2 kbd-label" style={{ background: "var(--bg-elev)" }}>
                  {cat} · {fmtUSD(sum(lines.map((e) => e.days * e.dayRate)))}
                </div>
                {lines.map((e) => (
                  <LineRow
                    key={e.id}
                    primary={<span className="font-semibold">{e.machine}</span>}
                    secondary={`${e.days} days @ ${fmtUSD(e.dayRate)}/day`}
                    qty={`${e.days} × ${fmtUSD(e.dayRate)}`}
                    amount={e.days * e.dayRate}
                  />
                ))}
              </div>
            ))}
          </CostSection>
        </div>
      </section>

      <section className="mt-8">
        <div className="kbd-label mb-3">Reconciliation</div>
        <div className="card p-5 sm:p-6">
          <div className="grid sm:grid-cols-4 gap-4 items-end">
            <ReconCell label="Revenue" value={fmtUSD(t.revenue)} tone="blue" />
            <ReconCell label="− Total cost" value={fmtUSD(t.totalCost)} />
            <ReconCell label="= Gross profit" value={fmtUSD(t.grossProfit)} tone={t.margin >= 0.08 ? "gold" : "negative"} big />
            <ReconCell label="Margin" value={fmtPct(t.margin)} tone={t.margin >= 0.08 ? "gold" : "negative"} />
          </div>
          <div className="mt-4 divider pt-4 text-dim text-xs font-ui">
            Margin band: <span className={marginTone(t.margin)}>{marginLabel(t.margin)}</span>
          </div>
        </div>
      </section>
    </AppShell>
  );
}

function marginLabel(m: number) {
  if (m >= 0.2) return "Healthy (≥20%)";
  if (m >= 0.08) return "On track (8–20%)";
  if (m >= 0) return "Thin (<8%)";
  return "Underwater";
}

function ReconCell({ label, value, tone, big }: { label: string; value: string; tone?: "blue" | "gold" | "negative"; big?: boolean }) {
  const toneClass = tone === "gold" ? "text-gold" : tone === "blue" ? "text-blue" : tone === "negative" ? "text-negative" : "";
  return (
    <div>
      <div className="kbd-label">{label}</div>
      <div className={`font-display num font-semibold ${big ? "text-3xl" : "text-2xl"} ${toneClass}`}>{value}</div>
    </div>
  );
}
