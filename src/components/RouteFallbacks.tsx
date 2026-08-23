import { Link, useRouter } from "@tanstack/react-router";
import { useEffect } from "react";

/** Shown while a route's loader / lazy chunk is resolving. */
export function RoutePending() {
  return (
    <div
      role="status"
      aria-live="polite"
      className="flex min-h-[60vh] w-full flex-col items-center justify-center gap-4 bg-background px-6 py-16"
    >
      <div className="h-8 w-8 animate-spin rounded-full border-2 border-muted border-t-primary" />
      <p className="text-xs font-medium uppercase tracking-[0.2em] text-muted-foreground">
        Loading
      </p>
    </div>
  );
}

/** Shown when a route loader or component throws. */
export function RouteError({ error, reset }: { error: Error; reset: () => void }) {
  const router = useRouter();

  useEffect(() => {
    console.error("[route error]", error);
  }, [error]);

  return (
    <div className="flex min-h-[60vh] items-center justify-center bg-background px-4 py-16">
      <div className="max-w-md text-center">
        <h1 className="text-xl font-semibold tracking-tight text-foreground">
          This page didn't load
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          {error?.message || "Something went wrong while loading this view."}
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          <button
            onClick={() => {
              router.invalidate();
              reset();
            }}
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Try again
          </button>
          <Link
            to="/"
            className="inline-flex items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent"
          >
            Go home
          </Link>
        </div>
      </div>
    </div>
  );
}

/** Shown for unmatched paths or thrown notFound(). */
export function RouteNotFound() {
  return (
    <div className="flex min-h-[60vh] items-center justify-center bg-background px-4 py-16">
      <div className="max-w-md text-center">
        <h1 className="text-6xl font-bold text-foreground">404</h1>
        <h2 className="mt-3 text-lg font-semibold text-foreground">Page not found</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <div className="mt-6">
          <Link
            to="/"
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Go home
          </Link>
        </div>
      </div>
    </div>
  );
}

/** Thin top progress bar that reflects router navigation state. */
export function RouteProgress() {
  const isLoading = useRouter().state.status === "pending";

  return (
    <div
      aria-hidden="true"
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        height: 2,
        zIndex: 9999,
        pointerEvents: "none",
        opacity: isLoading ? 1 : 0,
        transition: "opacity 200ms ease",
        background:
          "linear-gradient(90deg, transparent, hsl(var(--primary, 202 60% 55%)), transparent)",
        backgroundSize: "200% 100%",
        animation: isLoading ? "routeProgressSlide 1s linear infinite" : "none",
      }}
    >
      <style>{`@keyframes routeProgressSlide{0%{background-position:100% 0}100%{background-position:-100% 0}}`}</style>
    </div>
  );
}
