import { createFileRoute } from "@tanstack/react-router";
import { AppLayoutOutlet } from "@/components/dashboard/AppShell";

export const Route = createFileRoute("/app")({
  head: () => ({
    meta: [
      { title: "Dun Rite OS — Operations" },
      { name: "description", content: "Internal operations dashboard for Dun Rite Construction Group." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: () => <AppLayoutOutlet />,
});
