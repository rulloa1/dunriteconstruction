import { createFileRoute } from "@tanstack/react-router";

// SOP Workbook dashboard (github.com/rulloa1/sopdunrite) embedded via iframe.
// Swap DASHBOARD_URL once the repo is deployed (e.g. its own Lovable project).
const DASHBOARD_URL = "https://sopdunrite.lovable.app";

export const Route = createFileRoute("/dashboard")({
  head: () => ({
    meta: [
      { title: "Dashboard — DunRite Construction Group" },
      { name: "description", content: "Internal SOP workbook and project management dashboard for DunRite Construction Group." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: DashboardPage,
});

function DashboardPage() {
  return (
    <div style={{ position: "fixed", inset: 0, background: "#0b0f14" }}>
      <iframe
        src={DASHBOARD_URL}
        title="DunRite SOP Workbook"
        style={{ width: "100%", height: "100%", border: 0, display: "block" }}
        allow="clipboard-read; clipboard-write; fullscreen"
        referrerPolicy="no-referrer-when-downgrade"
      />
    </div>
  );
}
