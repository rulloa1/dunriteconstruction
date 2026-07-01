import { createFileRoute, Link } from "@tanstack/react-router";
import { useSuspenseQuery, queryOptions } from "@tanstack/react-query";
import { AppShell } from "@/components/dashboard/AppShell";
import { KpiCard } from "@/components/dashboard/KpiCard";
import { LoadingBlock, EmptyJobs, ErrorBlock } from "@/components/dashboard/States";
import { portfolioKPIs, jobTotals, fmtUSD, fmtPct, marginTone } from "@/lib/dashboard/data";
import { getAllJobs } from "@/lib/dashboard/queries.functions";
import { HERO_IMAGE_PATH } from "@/lib/docs/documents";
import { ArrowUpRight } from "lucide-react";
import { useState } from "react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Cell,
  Tooltip as RTooltip,
} from "recharts";


const jobsQO = () => queryOptions({ queryKey: ["jobs"], queryFn: () => getAllJobs() });

export const Route = createFileRoute("/_authenticated/app/")({
  loader: ({ context }) => {
    context.queryClient.ensureQueryData(jobsQO());
  },
  component: OverviewPage,
  pendingComponent: () => <AppShell title="Overview"><LoadingBlock /></AppShell>,
  errorComponent: ErrorBlock,
});

function OverviewPage() {
  const { data: jobs } = useSuspenseQuery(jobsQO());
  const k = portfolioKPIs(jobs);
  const [heroOk, setHeroOk] = useState(true);
  const topJobs = [...jobs]
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
      <section
        className="relative mb-6 overflow-hidden rounded-2xl border"
        style={{
          height: 200,
          borderColor: "var(--border-soft)",
          background:
            "linear-gradient(120deg, color-mix(in oklch, var(--brand-blue-deep) 60%, transparent), var(--bg-elev))",
        }}
      >
        {heroOk && (
          <img
            src={HERO_IMAGE_PATH}
            alt=""
            onError={() => setHeroOk(false)}
            className="absolute inset-0 w-full h-full object-cover"
            style={{ opacity: 0.55 }}
          />
        )}
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(180deg, transparent 30%, color-mix(in oklch, var(--bg) 85%, transparent))",
          }}
        />
        <div className="relative h-full flex flex-col justify-end p-5 sm:p-6">
          <div className="kbd-label" style={{ color: "var(--brand-gold)" }}>Dun Rite Construction Group</div>
          <h2 className="font-display text-2xl sm:text-3xl font-semibold tracking-tight">
            Operations at a glance
          </h2>
        </div>
      </section>

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
        {topJobs.length === 0 ? (
          <EmptyJobs />
        ) : (
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
        )}
      </section>
    </AppShell>
  );
}
