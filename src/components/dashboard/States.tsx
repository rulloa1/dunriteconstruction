import { useRouter } from "@tanstack/react-router";
import { AppShell } from "@/components/dashboard/AppShell";

export function LoadingBlock() {
  return (
    <div className="grid gap-4">
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-3 sm:gap-4">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="card p-5" style={{ minHeight: 92 }}>
            <div className="kbd-label">Loading…</div>
            <div className="mt-2 h-6 rounded" style={{ background: "var(--bg-elev)", width: "70%" }} />
          </div>
        ))}
      </div>
    </div>
  );
}

export function EmptyJobs() {
  return (
    <div className="card p-10 text-center">
      <div className="kbd-label mb-2">No jobs yet</div>
      <p className="text-muted font-ui text-sm">Once jobs are added they'll appear here.</p>
    </div>
  );
}

export function ErrorBlock({ error, reset }: { error: Error; reset: () => void }) {
  const router = useRouter();
  return (
    <AppShell title="Something went wrong">
      <div className="card p-8">
        <div className="kbd-label mb-2">Data load error</div>
        <p className="text-muted font-ui text-sm mb-4">{error.message}</p>
        <button className="btn btn-primary focus-ring" onClick={() => { router.invalidate(); reset(); }}>
          Try again
        </button>
      </div>
    </AppShell>
  );
}
