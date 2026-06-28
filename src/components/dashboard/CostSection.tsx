import { useState, type ReactNode } from "react";
import { ChevronDown } from "lucide-react";
import { fmtUSD } from "@/lib/dashboard/data";

export function CostSection({
  title,
  subtotal,
  count,
  children,
  defaultOpen = true,
}: {
  title: string;
  subtotal: number;
  count: number;
  children: ReactNode;
  defaultOpen?: boolean;
}) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="card overflow-hidden">
      <button
        onClick={() => setOpen((o) => !o)}
        className="w-full flex items-center justify-between px-4 sm:px-5 py-4 focus-ring"
      >
        <div className="flex items-center gap-3 min-w-0">
          <ChevronDown
            size={16}
            className="shrink-0 transition-transform"
            style={{ transform: open ? "rotate(0deg)" : "rotate(-90deg)", color: "var(--fg-muted)" }}
          />
          <div className="text-left min-w-0">
            <div className="font-display font-semibold truncate">{title}</div>
            <div className="text-dim text-xs">{count} {count === 1 ? "line" : "lines"}</div>
          </div>
        </div>
        <div className="font-display num font-semibold text-blue shrink-0">{fmtUSD(subtotal)}</div>
      </button>
      {open && <div className="border-t" style={{ borderColor: "var(--border-soft)" }}>{children}</div>}
    </div>
  );
}

export function LineRow({
  primary,
  secondary,
  qty,
  amount,
}: {
  primary: ReactNode;
  secondary?: ReactNode;
  qty?: ReactNode;
  amount: number;
}) {
  return (
    <div
      className="grid grid-cols-[1fr_auto] sm:grid-cols-[1.5fr_1fr_auto] gap-3 px-4 sm:px-5 py-3 border-b last:border-b-0"
      style={{ borderColor: "var(--border-soft)" }}
    >
      <div className="min-w-0">
        <div className="text-sm truncate">{primary}</div>
        {secondary && <div className="text-dim text-xs mt-0.5">{secondary}</div>}
      </div>
      <div className="hidden sm:block text-muted num text-sm">{qty}</div>
      <div className="num font-semibold text-right tabular-nums">{fmtUSD(amount)}</div>
    </div>
  );
}
