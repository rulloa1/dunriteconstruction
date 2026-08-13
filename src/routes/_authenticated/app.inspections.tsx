import { createFileRoute } from "@tanstack/react-router";
import { Fragment, useState } from "react";
import { AppShell } from "@/components/dashboard/AppShell";
import { KpiCard } from "@/components/dashboard/KpiCard";
import { PageHeader } from "@/components/controls/PageHeader";
import { StatusBadge, DataCard } from "@/components/controls/primitives";
import {
  INSPECTIONS,
  countByInspectionStatus,
  passRate,
  formatInspDate,
  type ChecklistResult,
} from "@/lib/field/inspections";
import { ChevronDown, ChevronRight, Check, X, Minus } from "lucide-react";

export const Route = createFileRoute("/_authenticated/app/inspections")({
  head: () => ({
    meta: [{ title: "Inspections — Dun Rite OS" }, { name: "robots", content: "noindex" }],
  }),
  component: InspectionsPage,
});

function resultGlyph(r: ChecklistResult) {
  if (r === "pass")
    return (
      <span className="text-positive flex items-center gap-1">
        <Check size={14} /> Pass
      </span>
    );
  if (r === "fail")
    return (
      <span className="text-negative flex items-center gap-1">
        <X size={14} /> Fail
      </span>
    );
  return (
    <span className="text-muted flex items-center gap-1">
      <Minus size={14} /> N/A
    </span>
  );
}

function InspectionsPage() {
  const [openId, setOpenId] = useState<string | null>(null);
  const sorted = [...INSPECTIONS].sort((a, b) => b.date.localeCompare(a.date));

  return (
    <AppShell title="Inspections" eyebrow="Field">
      <PageHeader
        title="Inspections"
        subtitle="Granite Amenity Center"
        breadcrumb={[{ label: "App", to: "/app" }, { label: "Inspections" }]}
      />

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-6">
        <KpiCard label="Passed" value={countByInspectionStatus("passed")} tone="positive" />
        <KpiCard label="Failed" value={countByInspectionStatus("failed")} tone="negative" />
        <KpiCard label="Scheduled" value={countByInspectionStatus("scheduled")} tone="blue" />
        <KpiCard label="Pass Rate" value={`${passRate()}%`} tone="gold" />
      </div>

      <DataCard title="All Inspections">
        <table>
          <thead>
            <tr>
              <th>#</th>
              <th>Title</th>
              <th>Type</th>
              <th>Date</th>
              <th>Inspector</th>
              <th>Location</th>
              <th>Status</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {sorted.map((insp) => {
              const open = openId === insp.id;
              return (
                <Fragment key={insp.id}>
                  <tr onClick={() => setOpenId(open ? null : insp.id)}>
                    <td className="num text-muted">{insp.number}</td>
                    <td>
                      <div className="font-display font-semibold">{insp.title}</div>
                    </td>
                    <td className="text-muted">{insp.type}</td>
                    <td className="num">{formatInspDate(insp.date)}</td>
                    <td className="text-muted">{insp.inspector}</td>
                    <td className="text-muted">{insp.location}</td>
                    <td>
                      <StatusBadge status={insp.status} />
                    </td>
                    <td className="text-muted">
                      {open ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
                    </td>
                  </tr>
                  {open && (
                    <tr>
                      <td colSpan={8} style={{ background: "var(--bg-elev)" }}>
                        <div className="p-4">
                          <div className="kbd-label mb-2">Checklist</div>
                          <div className="grid gap-2">
                            {insp.checklist.map((row, i) => (
                              <div
                                key={i}
                                className="flex items-start gap-3 rounded-lg p-3"
                                style={{
                                  background: "var(--bg-card)",
                                  border: "1px solid var(--border-soft)",
                                }}
                              >
                                <div className="w-20 shrink-0">{resultGlyph(row.result)}</div>
                                <div className="min-w-0 flex-1">
                                  <div className="text-sm">{row.item}</div>
                                  {row.note && (
                                    <div className="text-dim text-xs mt-1">{row.note}</div>
                                  )}
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      </td>
                    </tr>
                  )}
                </Fragment>
              );
            })}
          </tbody>
        </table>
      </DataCard>
    </AppShell>
  );
}
