import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { AppShell } from "@/components/dashboard/AppShell";
import { KpiCard } from "@/components/dashboard/KpiCard";
import { PageHeader } from "@/components/controls/PageHeader";
import { StatusBadge } from "@/components/controls/primitives";
import {
  COMPANIES,
  totalCompanies,
  countByType,
  totalContacts,
  type CompanyType,
} from "@/lib/field/directory";
import { ChevronDown, ChevronRight, Mail, Phone, MapPin } from "lucide-react";

export const Route = createFileRoute("/_authenticated/app/directory")({
  head: () => ({
    meta: [{ title: "Directory — Dun Rite OS" }, { name: "robots", content: "noindex" }],
  }),
  component: DirectoryPage,
});

const TYPE_FILTERS: { id: CompanyType | "all"; label: string }[] = [
  { id: "all", label: "All" },
  { id: "gc", label: "GC" },
  { id: "owner", label: "Owner" },
  { id: "architect", label: "Architect" },
  { id: "subcontractor", label: "Subcontractors" },
  { id: "vendor", label: "Vendors" },
];

function DirectoryPage() {
  const [type, setType] = useState<CompanyType | "all">("all");
  const [q, setQ] = useState("");
  const [openId, setOpenId] = useState<string | null>(null);

  const rows = useMemo(() => {
    const needle = q.trim().toLowerCase();
    return COMPANIES.filter((c) => {
      if (type !== "all" && c.type !== type) return false;
      if (!needle) return true;
      return [c.name, ...c.trades, ...c.contacts.map((x) => x.name + " " + x.title)]
        .join(" ")
        .toLowerCase()
        .includes(needle);
    });
  }, [type, q]);

  return (
    <AppShell title="Directory" eyebrow="Field">
      <PageHeader
        title="Project Directory"
        subtitle="Companies and contacts on Granite Amenity Center"
        breadcrumb={[{ label: "App", to: "/app" }, { label: "Directory" }]}
      />

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-6">
        <KpiCard label="Companies" value={totalCompanies()} />
        <KpiCard label="Subcontractors" value={countByType("subcontractor")} tone="blue" />
        <KpiCard label="Vendors" value={countByType("vendor")} tone="gold" />
        <KpiCard label="Contacts" value={totalContacts()} tone="positive" />
      </div>

      <div className="card p-3 sm:p-4 mb-4 flex flex-wrap items-center gap-2 justify-between">
        <div className="flex items-center gap-2 flex-wrap">
          {TYPE_FILTERS.map((f) => (
            <button
              key={f.id}
              type="button"
              onClick={() => setType(f.id)}
              className="pill focus-ring"
              style={{
                cursor: "pointer",
                background:
                  type === f.id
                    ? "color-mix(in oklch, var(--brand-blue) 14%, transparent)"
                    : "transparent",
                color: type === f.id ? "var(--brand-blue)" : "var(--fg-muted)",
                borderColor:
                  type === f.id
                    ? "color-mix(in oklch, var(--brand-blue) 50%, transparent)"
                    : "var(--border-strong)",
              }}
            >
              {f.label}
            </button>
          ))}
        </div>
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Search companies, trades, contacts…"
          className="btn"
          style={{ minWidth: 240 }}
        />
      </div>

      <div className="grid gap-3 md:grid-cols-2">
        {rows.map((c) => {
          const open = openId === c.id;
          return (
            <div key={c.id} className="card overflow-hidden">
              <button
                type="button"
                onClick={() => setOpenId(open ? null : c.id)}
                className="w-full flex items-start gap-3 px-4 sm:px-5 py-4 text-left focus-ring"
              >
                <span className="text-muted mt-1">
                  {open ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
                </span>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <div className="font-display font-semibold truncate">{c.name}</div>
                    <StatusBadge status={c.type} />
                  </div>
                  <div className="text-muted text-sm mt-1 truncate">{c.trades.join(" · ")}</div>
                  <div className="text-dim text-xs mt-2 flex items-center gap-3 flex-wrap">
                    <span className="flex items-center gap-1">
                      <Phone size={12} />
                      {c.phone}
                    </span>
                    <span className="flex items-center gap-1">
                      <Mail size={12} />
                      {c.email}
                    </span>
                  </div>
                </div>
              </button>
              {open && (
                <div className="px-5 pb-5 border-t" style={{ borderColor: "var(--border-soft)" }}>
                  <div className="text-dim text-xs flex items-center gap-1 mt-3 mb-3">
                    <MapPin size={12} />
                    {c.address}
                  </div>
                  <div className="kbd-label mb-2">Contacts</div>
                  <div className="grid gap-2">
                    {c.contacts.map((p, i) => (
                      <div
                        key={i}
                        className="rounded-lg p-3"
                        style={{
                          background: "var(--bg-elev)",
                          border: "1px solid var(--border-soft)",
                        }}
                      >
                        <div className="flex items-center gap-2 flex-wrap">
                          <div className="font-display font-semibold">{p.name}</div>
                          <div className="text-dim text-xs">{p.title}</div>
                        </div>
                        <div className="text-muted text-xs mt-1 flex items-center gap-3 flex-wrap">
                          <a
                            href={`tel:${p.phone}`}
                            className="flex items-center gap-1 hover:text-blue"
                          >
                            <Phone size={12} />
                            {p.phone}
                          </a>
                          <a
                            href={`mailto:${p.email}`}
                            className="flex items-center gap-1 hover:text-blue"
                          >
                            <Mail size={12} />
                            {p.email}
                          </a>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          );
        })}
        {!rows.length && <div className="text-muted text-sm">No companies match.</div>}
      </div>
    </AppShell>
  );
}
