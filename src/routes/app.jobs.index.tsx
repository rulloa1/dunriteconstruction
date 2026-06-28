import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { AppShell } from "@/components/dashboard/AppShell";
import { KpiCard } from "@/components/dashboard/KpiCard";
import { JOBS, portfolioKPIs, jobTotals, fmtUSD, fmtPct, marginTone, type JobStatus } from "@/lib/dashboard/data";
import { Search } from "lucide-react";

export const Route = createFileRoute("/app/jobs/")({
  component: JobsIndex,
});

function JobsIndex() {
  const navigate = useNavigate();
  const [filter, setFilter] = useState<"all" | JobStatus>("all");
  const [q, setQ] = useState("");

  const filtered = useMemo(() => {
    return JOBS.filter((j) => (filter === "all" ? true : j.status === filter))
      .filter((j) =>
        q.trim() === ""
          ? true
          : (j.name + j.client + j.county).toLowerCase().includes(q.trim().toLowerCase())
      );
  }, [filter, q]);

  const k = portfolioKPIs(JOBS);

  return (
    <AppShell eyebrow="Financial core" title="Jobs">
      <section className="grid grid-cols-2 lg:grid-cols-5 gap-3 sm:gap-4 mb-6">
        <KpiCard label="Revenue" value={fmtUSD(k.revenue)} tone="blue" />
        <KpiCard label="Total cost" value={fmtUSD(k.totalCost)} />
        <KpiCard label="Gross profit" value={fmtUSD(k.grossProfit)} tone="gold" />
        <KpiCard label="Blended margin" value={fmtPct(k.margin)} />
        <KpiCard label="Active jobs" value={k.activeJobs} sub={`${k.closedJobs} closed`} />
      </section>

      <div className="flex flex-col sm:flex-row sm:items-center gap-3 mb-4">
        <div className="relative flex-1 max-w-md">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-dim" />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search jobs, clients, counties…"
            className="w-full pl-9 pr-3 py-2.5 rounded-lg focus-ring font-ui text-sm"
            style={{ background: "var(--bg-card)", border: "1px solid var(--border-soft)", color: "var(--fg)" }}
          />
        </div>
        <div className="flex gap-1 p-1 rounded-lg" style={{ background: "var(--bg-card)", border: "1px solid var(--border-soft)" }}>
          {(["all", "active", "closed"] as const).map((s) => (
            <button
              key={s}
              onClick={() => setFilter(s)}
              className="px-3 py-1.5 rounded-md font-ui text-xs uppercase tracking-wider focus-ring transition"
              style={{
                background: filter === s ? "var(--brand-blue-deep)" : "transparent",
                color: filter === s ? "white" : "var(--fg-muted)",
              }}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      <div className="card overflow-hidden">
        {/* Desktop table */}
        <div className="hidden md:block">
          <table>
            <thead>
              <tr>
                <th>Job</th>
                <th>Client</th>
                <th>Status</th>
                <th className="text-right">Revenue</th>
                <th className="text-right">Cost</th>
                <th className="text-right">Gross profit</th>
                <th className="text-right">Margin</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((job) => {
                const t = jobTotals(job);
                return (
                  <tr key={job.id} onClick={() => navigate({ to: "/app/jobs/$jobId", params: { jobId: job.id } })}>
                    <td>
                      <div className="font-display font-semibold">{job.name}</div>
                      <div className="text-dim" style={{ fontSize: 12 }}>{job.county} County</div>
                    </td>
                    <td className="text-muted">{job.client}</td>
                    <td>
                      <span className={`pill ${job.status === "active" ? "pill-active" : "pill-closed"}`}>
                        {job.status}
                      </span>
                    </td>
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

        {/* Mobile cards */}
        <div className="md:hidden divide-y" style={{ borderColor: "var(--border-soft)" }}>
          {filtered.map((job) => {
            const t = jobTotals(job);
            return (
              <button
                key={job.id}
                onClick={() => navigate({ to: "/app/jobs/$jobId", params: { jobId: job.id } })}
                className="w-full text-left p-4 focus-ring"
                style={{ borderColor: "var(--border-soft)" }}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <div className="font-display font-semibold truncate">{job.name}</div>
                    <div className="text-dim text-xs">{job.client} · {job.county} Co.</div>
                  </div>
                  <span className={`pill ${job.status === "active" ? "pill-active" : "pill-closed"}`}>
                    {job.status}
                  </span>
                </div>
                <div className="mt-3 grid grid-cols-3 gap-2 num text-sm">
                  <div>
                    <div className="kbd-label">Rev</div>
                    <div className="font-semibold">{fmtUSD(t.revenue)}</div>
                  </div>
                  <div>
                    <div className="kbd-label">GP</div>
                    <div className={`font-semibold ${marginTone(t.margin)}`}>{fmtUSD(t.grossProfit)}</div>
                  </div>
                  <div>
                    <div className="kbd-label">Margin</div>
                    <div className={`font-semibold ${marginTone(t.margin)}`}>{fmtPct(t.margin)}</div>
                  </div>
                </div>
              </button>
            );
          })}
        </div>

        {filtered.length === 0 && (
          <div className="p-12 text-center">
            <div className="kbd-label mb-2">No matches</div>
            <p className="text-muted font-ui text-sm">Try a different search or status filter.</p>
          </div>
        )}
      </div>
    </AppShell>
  );
}
