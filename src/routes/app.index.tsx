import { createFileRoute, Link } from "@tanstack/react-router";
import { AppShell } from "@/components/dashboard/AppShell";
import { KpiCard } from "@/components/dashboard/KpiCard";
import { JOBS, portfolioKPIs, jobTotals, fmtUSD, fmtPct, marginTone } from "@/lib/dashboard/data";
import { ArrowUpRight } from "lucide-react";

export const Route = createFileRoute("/app/")({
  component: OverviewPage,
});

function OverviewPage() {
  const k = portfolioKPIs(JOBS);
  const topJobs = [...JOBS]
    .map((j) => ({ job: j, t: jobTotals(j) }))
    .sort((a, b) => b.t.grossProfit - a.t.grossProfit)
    .slice(0, 4);

  return (
    <AppShell
      eyebrow="Operations"
      title="Overview"
      actions={
        <Link to="/app/jobs" className="btn btn-primary focus-ring">
          View jobs <ArrowUpRight size={14} />
        </Link>
      }
    >
      <section className="grid grid-cols-2 lg:grid-cols-5 gap-3 sm:gap-4">
        <KpiCard label="Revenue (all)" value={fmtUSD(k.revenue)} tone="blue" />
        <KpiCard label="Total cost" value={fmtUSD(k.totalCost)} />
        <KpiCard label="Gross profit" value={fmtUSD(k.grossProfit)} tone="gold" />
        <KpiCard label="Blended margin" value={fmtPct(k.margin)} sub={`${k.activeJobs} active · ${k.closedJobs} closed`} />
        <KpiCard label="Active jobs" value={k.activeJobs} sub="open work-in-place" />
      </section>

      <section className="mt-8">
        <div className="flex items-end justify-between mb-3">
          <div>
            <div className="kbd-label">Top performing</div>
            <h2 className="font-display text-lg font-semibold">Jobs by gross profit</h2>
          </div>
          <Link to="/app/jobs" className="text-blue text-sm font-ui hover:underline">All jobs →</Link>
        </div>
        <div className="grid sm:grid-cols-2 gap-3 sm:gap-4">
          {topJobs.map(({ job, t }) => (
            <Link
              key={job.id}
              to="/app/jobs/$jobId"
              params={{ jobId: job.id }}
              className="card card-hover p-5 block focus-ring transition"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <div className="kbd-label">{job.client} · {job.county} Co.</div>
                  <div className="font-display text-base font-semibold mt-1 truncate">{job.name}</div>
                </div>
                <span className={`pill ${job.status === "active" ? "pill-active" : "pill-closed"}`}>
                  {job.status}
                </span>
              </div>
              <div className="mt-4 grid grid-cols-3 gap-3 num">
                <div>
                  <div className="kbd-label">Revenue</div>
                  <div className="font-display font-semibold">{fmtUSD(t.revenue)}</div>
                </div>
                <div>
                  <div className="kbd-label">GP</div>
                  <div className={`font-display font-semibold ${marginTone(t.margin)}`}>{fmtUSD(t.grossProfit)}</div>
                </div>
                <div>
                  <div className="kbd-label">Margin</div>
                  <div className={`font-display font-semibold ${marginTone(t.margin)}`}>{fmtPct(t.margin)}</div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </AppShell>
  );
}
