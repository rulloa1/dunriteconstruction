import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { toast } from "sonner";
import { FormDialog, ConfirmDialog, newId, type Field } from "./FormDialog";
import {
  upsertOverhead, deleteOverhead,
  upsertOwnerDraw, deleteOwnerDraw,
} from "@/lib/dashboard/mutations.functions";
import type { OverheadLine, OwnerDraw } from "@/lib/dashboard/data";

function useInvalidateFinancials() {
  const qc = useQueryClient();
  return () => qc.invalidateQueries({ queryKey: ["financials"] });
}

export type PeriodKind = "overhead" | "draws";
type PeriodRow = OverheadLine | OwnerDraw;

const OVERHEAD_FIELDS: Field[] = [
  { name: "category", label: "Category", kind: "text", required: true, full: true, placeholder: "e.g. Insurance, Rent, Fuel" },
  { name: "amount", label: "Amount ($)", kind: "number", required: true, min: 0 },
  { name: "period", label: "Period", kind: "month", required: true, placeholder: "YYYY-MM" },
];

const DRAW_FIELDS: Field[] = [
  { name: "owner", label: "Owner", kind: "text", required: true, full: true, placeholder: "e.g. Rory" },
  { name: "amount", label: "Amount ($)", kind: "number", required: true, min: 0 },
  { name: "period", label: "Period", kind: "month", required: true, placeholder: "YYYY-MM" },
];

export function PeriodLineFormDialog({
  open, onOpenChange, kind, row, defaultPeriod,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  kind: PeriodKind;
  row?: PeriodRow;
  defaultPeriod?: string;
}) {
  const editing = !!row;
  const invalidate = useInvalidateFinancials();
  const upOver = useServerFn(upsertOverhead);
  const upDraw = useServerFn(upsertOwnerDraw);

  const m = useMutation({
    mutationFn: async (v: Record<string, string>) => {
      const id = row?.id ?? newId();
      if (kind === "overhead") {
        return upOver({ data: { id, category: v.category, amount: Number(v.amount), period: v.period } });
      }
      return upDraw({ data: { id, owner: v.owner, amount: Number(v.amount), period: v.period } });
    },
    onSuccess: () => {
      toast.success(editing ? "Saved" : "Added");
      invalidate();
      onOpenChange(false);
    },
    onError: (e: Error) => toast.error(e.message || "Save failed"),
  });

  const fields = kind === "overhead" ? OVERHEAD_FIELDS : DRAW_FIELDS;
  const initial: Record<string, string> = kind === "overhead"
    ? {
        category: (row as OverheadLine | undefined)?.category ?? "",
        amount: row?.amount?.toString() ?? "0",
        period: row?.period ?? defaultPeriod ?? new Date().toISOString().slice(0, 7),
      }
    : {
        owner: (row as OwnerDraw | undefined)?.owner ?? "",
        amount: row?.amount?.toString() ?? "0",
        period: row?.period ?? defaultPeriod ?? new Date().toISOString().slice(0, 7),
      };

  const title = kind === "overhead"
    ? (editing ? "Edit overhead line" : "Add overhead line")
    : (editing ? "Edit owner draw" : "Add owner draw");

  return (
    <FormDialog
      open={open} onOpenChange={onOpenChange}
      title={title}
      fields={fields}
      initial={initial}
      submitting={m.isPending}
      submitLabel={editing ? "Save changes" : "Add"}
      onSubmit={async (v) => { await m.mutateAsync(v); }}
    />
  );
}

export function DeletePeriodLineDialog({
  open, onOpenChange, kind, id, label,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  kind: PeriodKind;
  id: string;
  label: string;
}) {
  const invalidate = useInvalidateFinancials();
  const delOver = useServerFn(deleteOverhead);
  const delDraw = useServerFn(deleteOwnerDraw);
  const fn = kind === "overhead" ? delOver : delDraw;
  const m = useMutation({
    mutationFn: () => fn({ data: { id } }),
    onSuccess: () => { toast.success("Deleted"); invalidate(); onOpenChange(false); },
    onError: (e: Error) => toast.error(e.message || "Delete failed"),
  });
  return (
    <ConfirmDialog
      open={open} onOpenChange={onOpenChange}
      title="Delete entry?"
      description={<>Remove <span className="text-fg">{label}</span>. Totals will recompute automatically.</>}
      busy={m.isPending}
      onConfirm={async () => { await m.mutateAsync(); }}
    />
  );
}

export function usePeriodDialogs() {
  const [state, setState] = useState<
    | { mode: "closed" }
    | { mode: "create"; kind: PeriodKind }
    | { mode: "edit"; kind: PeriodKind; row: PeriodRow }
    | { mode: "delete"; kind: PeriodKind; id: string; label: string }
  >({ mode: "closed" });
  return {
    state,
    openCreate: (kind: PeriodKind) => setState({ mode: "create", kind }),
    openEdit: (kind: PeriodKind, row: PeriodRow) => setState({ mode: "edit", kind, row }),
    openDelete: (kind: PeriodKind, id: string, label: string) => setState({ mode: "delete", kind, id, label }),
    close: () => setState({ mode: "closed" }),
  };
}
