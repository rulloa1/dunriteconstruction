import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { AppShell } from "@/components/dashboard/AppShell";
import { KpiCard } from "@/components/dashboard/KpiCard";
import { PageHeader } from "@/components/controls/PageHeader";
import { DataCard } from "@/components/controls/primitives";
import {
  DAILY_LOGS,
  totalLogs,
  totalManHours,
  avgCrewSize,
  totalDeliveries,
  totalWorkers,
  totalHours,
  formatLogDate,
} from "@/lib/field/dailyLogs";
import { ChevronDown, ChevronRight, CloudSun } from "lucide-react";

export const Route = createFileRoute("/_authenticated/app/daily-logs")({
  head: () => ({
    meta: [{ title: "Daily Logs — Dun Rite OS" }, { name: "robots", content: "noindex" }],
  }),
  component: DailyLogsPage,
});

function DailyLogsPage() {
  const [openId, setOpenId] = useState<string | null>(DAILY_LOGS[0]?.id ?? null);
  const sorted = [...DAILY_LOGS].sort((a, b) => b.date.localeCompare(a.date));

  return (
    <AppShell title="Daily Logs" eyebrow="Field">
      <PageHeader
        title="Daily Logs"
        subtitle="Granite Amenity Center — finishes phase"
        breadcrumb={[{ label: "App", to: "/app" }, { label: "Daily Logs" }]}
      />

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-6">
        <KpiCard label="Logs this period" value={totalLogs()} />
        <KpiCard label="Total man-hours" value={totalManHours().toLocaleString()} tone="blue" />
        <KpiCard label="Avg crew size" value={avgCrewSize()} />
        <KpiCard label="Deliveries" value={totalDeliveries()} tone="gold" />
      </div>

      <div className="flex flex-col gap-3">
        {sorted.map((log) => {
          const open = openId === log.id;
          const workers = totalWorkers(log);
          const hours = totalHours(log);
          return (
            <div key={log.id} className="card overflow-hidden">
              <button
                type="button"
                onClick={() => setOpenId(open ? null : log.id)}
                className="w-full flex items-center gap-3 px-4 sm:px-5 py-4 text-left focus-ring"
              >
                <span className="text-muted">
                  {open ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
                </span>
                <div className="min-w-0 flex-1">
                  <div className="font-display font-semibold">{formatLogDate(log.date)}</div>
                  <div className="text-muted text-sm flex items-center gap-2 flex-wrap mt-0.5">
                    <CloudSun size={14} />
                    <span>
                      {log.weather.condition} · {log.weather.tempLow}°/{log.weather.tempHigh}°F ·{" "}
                      {log.weather.precipitation}"
                    </span>
                    <span className="text-dim">•</span>
                    <span>{log.author}</span>
                  </div>
                </div>
                <div className="hidden sm:flex items-center gap-5 text-right">
                  <div>
                    <div className="kbd-label">Workers</div>
                    <div className="num font-display font-semibold">{workers}</div>
                  </div>
                  <div>
                    <div className="kbd-label">Hours</div>
                    <div className="num font-display font-semibold">{hours}</div>
                  </div>
                  <div>
                    <div className="kbd-label">Deliveries</div>
                    <div className="num font-display font-semibold">{log.deliveries.length}</div>
                  </div>
                </div>
              </button>
              {open && (
                <div className="px-4 sm:px-5 pb-5 grid gap-4 lg:grid-cols-2">
                  <DataCard title="Manpower">
                    <table>
                      <thead>
                        <tr>
                          <th>Company</th>
                          <th className="text-right pr-4">Workers</th>
                          <th className="text-right pr-4">Hours</th>
                        </tr>
                      </thead>
                      <tbody>
                        {log.manpower.map((m, i) => (
                          <tr key={i}>
                            <td>{m.company}</td>
                            <td className="num text-right pr-4">{m.workers}</td>
                            <td className="num text-right pr-4">{m.hours}</td>
                          </tr>
                        ))}
                        <tr>
                          <td className="font-display font-semibold">Total</td>
                          <td className="num text-right pr-4 font-semibold">{workers}</td>
                          <td className="num text-right pr-4 font-semibold">{hours}</td>
                        </tr>
                      </tbody>
                    </table>
                  </DataCard>
                  <DataCard title="Work Completed">
                    <ul className="px-5 py-4 space-y-2 text-sm">
                      {log.workCompleted.map((w, i) => (
                        <li key={i} className="flex gap-2">
                          <span className="text-blue">•</span>
                          <span>{w}</span>
                        </li>
                      ))}
                    </ul>
                  </DataCard>
                  <DataCard title="Deliveries">
                    {log.deliveries.length ? (
                      <table>
                        <thead>
                          <tr>
                            <th>Item</th>
                            <th>Vendor</th>
                          </tr>
                        </thead>
                        <tbody>
                          {log.deliveries.map((d, i) => (
                            <tr key={i}>
                              <td>{d.item}</td>
                              <td className="text-muted">{d.vendor}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    ) : (
                      <div className="px-5 py-4 text-muted text-sm">No deliveries recorded.</div>
                    )}
                  </DataCard>
                  <DataCard title="Notes">
                    <div className="px-5 py-4 text-sm">
                      {log.notes || <span className="text-muted">—</span>}
                    </div>
                  </DataCard>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </AppShell>
  );
}
