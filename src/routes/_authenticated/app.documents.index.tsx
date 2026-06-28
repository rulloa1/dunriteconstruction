import { createFileRoute, Link } from "@tanstack/react-router";
import { AppShell } from "@/components/dashboard/AppShell";
import { PageHeader } from "@/components/controls/PageHeader";
import { DOC_GROUPS, docsByGroup } from "@/lib/docs/documents";
import { FileText } from "lucide-react";

export const Route = createFileRoute("/_authenticated/app/documents/")({
  head: () => ({
    meta: [
      { title: "Documents — Dun Rite OS" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: DocumentsIndex,
});

function DocumentsIndex() {
  return (
    <AppShell eyebrow="Library" title="Documents">
      <PageHeader
        eyebrow="Reference library"
        title="Company Documents"
        subtitle="Handbooks, safety programs, and operating procedures."
        breadcrumb={[{ label: "App", to: "/app" }, { label: "Documents" }]}
      />
      <div className="space-y-8">
        {DOC_GROUPS.map((group) => {
          const items = docsByGroup(group);
          if (items.length === 0) return null;
          return (
            <section key={group}>
              <div className="kbd-label mb-3">{group}</div>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
                {items.map((d) => (
                  <Link
                    key={d.id}
                    to="/app/documents/$docId"
                    params={{ docId: d.id }}
                    className="card card-hover p-5 block focus-ring transition"
                  >
                    <div className="flex items-start gap-3">
                      <div
                        className="shrink-0 grid place-items-center rounded-lg"
                        style={{
                          width: 36, height: 36,
                          background: "color-mix(in oklch, var(--brand-blue) 14%, transparent)",
                          color: "var(--brand-blue)",
                        }}
                      >
                        <FileText size={18} strokeWidth={1.75} />
                      </div>
                      <div className="min-w-0">
                        <div className="font-display font-semibold truncate">{d.title}</div>
                        <div className="text-muted text-sm mt-1">{d.description}</div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </section>
          );
        })}
      </div>
    </AppShell>
  );
}
