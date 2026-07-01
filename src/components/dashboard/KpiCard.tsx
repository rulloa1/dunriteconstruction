import type { ReactNode } from "react";

export function KpiCard({
  label,
  value,
  sub,
  tone = "default",
  primary = false,
  className = "",
}: {
  label: string;
  value: ReactNode;
  sub?: ReactNode;
  tone?: "default" | "gold" | "blue" | "accent" | "positive" | "negative";
  primary?: boolean;
  className?: string;
}) {
  const toneClass =
    tone === "gold" || tone === "accent" ? "text-accent"
    : tone === "blue" ? "text-blue"
    : tone === "positive" ? "text-positive"
    : tone === "negative" ? "text-negative"
    : "";
  return (
    <div className={`card ${primary ? "kpi-primary" : ""} p-4 sm:p-5 ${className}`}>
      <div className="kbd-label mb-2">{label}</div>
      <div className={`font-display num text-2xl sm:text-3xl font-semibold ${toneClass}`}>{value}</div>
      {sub && <div className="mt-1 text-dim num" style={{ fontSize: 12 }}>{sub}</div>}
    </div>
  );
}
