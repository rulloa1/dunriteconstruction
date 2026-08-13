import { useState, type ReactNode } from "react";
import { ChevronDown, Plus, Pencil, Trash2 } from "lucide-react";
import { fmtUSD } from "@/lib/dashboard/data";

export function CostSection({
  title,
  subtotal,
  count,
  children,
  defaultOpen = true,
  onAdd,
  addLabel = "Add line",
}: {
  title: string;
  subtotal: number;
  count: number;
  children: ReactNode;
  defaultOpen?: boolean;
  onAdd?: () => void;
  addLabel?: string;
}) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="card overflow-hidden">
      <div className="w-full flex items-center justify-between px-4 sm:px-5 py-4 gap-3">
        <button
          onClick={() => setOpen((o) => !o)}
          className="flex items-center gap-3 min-w-0 flex-1 text-left focus-ring -mx-1 px-1 rounded"
        >
          <ChevronDown
            size={16}
            className="shrink-0 transition-transform"
            style={{
              transform: open ? "rotate(0deg)" : "rotate(-90deg)",
              color: "var(--fg-muted)",
            }}
          />
          <div className="min-w-0">
            <div className="font-display font-semibold truncate">{title}</div>
            <div className="text-dim text-xs">
              {count} {count === 1 ? "line" : "lines"}
            </div>
          </div>
        </button>
        <div className="flex items-center gap-3 shrink-0">
          <div className="font-display num font-semibold text-blue">{fmtUSD(subtotal)}</div>
          {onAdd && (
            <button
              onClick={onAdd}
              className="btn !py-1.5 !px-2.5 focus-ring"
              aria-label={addLabel}
              title={addLabel}
            >
              <Plus size={14} />
              <span className="hidden sm:inline text-xs">Add</span>
            </button>
          )}
        </div>
      </div>
      {open && (
        <div className="border-t" style={{ borderColor: "var(--border-soft)" }}>
          {children}
        </div>
      )}
    </div>
  );
}

export function LineRow({
  primary,
  secondary,
  qty,
  amount,
  onEdit,
  onDelete,
}: {
  primary: ReactNode;
  secondary?: ReactNode;
  qty?: ReactNode;
  amount: number;
  onEdit?: () => void;
  onDelete?: () => void;
}) {
  const hasActions = !!(onEdit || onDelete);
  return (
    <div
      className="grid grid-cols-[1fr_auto] sm:grid-cols-[1.5fr_1fr_auto_auto] gap-3 px-4 sm:px-5 py-3 border-b last:border-b-0 items-center"
      style={{ borderColor: "var(--border-soft)" }}
    >
      <div className="min-w-0">
        <div className="text-sm truncate">{primary}</div>
        {secondary && <div className="text-dim text-xs mt-0.5">{secondary}</div>}
      </div>
      <div className="hidden sm:block text-muted num text-sm">{qty}</div>
      <div className="num font-semibold text-right tabular-nums">{fmtUSD(amount)}</div>
      {hasActions && (
        <div className="col-span-2 sm:col-span-1 flex items-center justify-end gap-1">
          {onEdit && (
            <button
              onClick={onEdit}
              aria-label="Edit"
              title="Edit"
              className="p-1.5 rounded text-muted hover:text-blue focus-ring"
            >
              <Pencil size={14} />
            </button>
          )}
          {onDelete && (
            <button
              onClick={onDelete}
              aria-label="Delete"
              title="Delete"
              className="p-1.5 rounded text-muted hover:text-[color:var(--negative,#b04848)] focus-ring"
            >
              <Trash2 size={14} />
            </button>
          )}
        </div>
      )}
    </div>
  );
}
