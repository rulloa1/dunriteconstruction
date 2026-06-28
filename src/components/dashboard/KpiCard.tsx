import type { ReactNode } from "react";

export function KpiCard({
  label,
  value,
  sub,
  tone = "default",
}: {
  label: string;
  value: ReactNode;
  sub?: ReactNode;
  tone?: "default" | "gold" | "blue" | "positive" | "negative";
}) {
  const toneClass =
    tone === "gold" ? "text-gold"
    : tone === "blue" ? "text-blue"
    : tone === "positive" ? "text-positive"
    : tone === "negative" ? "text-negative"
    : "";
  return (
    <div className="card p-4 sm:p-5">
      <div className="kbd-label mb-2">{label}</div>
      <div className={`font-display num text-2xl sm:text-3xl font-semibold ${toneClass}`}>{value}</div>
      {sub && <div className="mt-1 text-dim num" style={{ fontSize: 12 }}>{sub}</div>}
    </div>
  );
}
