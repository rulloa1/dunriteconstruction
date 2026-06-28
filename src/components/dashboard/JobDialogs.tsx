import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { toast } from "sonner";
import { FormDialog, ConfirmDialog, newId, type Field } from "./FormDialog";
import {
  createJob, updateJob, deleteJob,
  upsertChangeOrder, deleteChangeOrder,
  upsertLabor, deleteLabor,
  upsertMaterial, deleteMaterial,
  upsertSub, deleteSub,
  upsertEquipment, deleteEquipment,
} from "@/lib/dashboard/mutations.functions";
import type { Job, LaborLine, MaterialLine, SubLine, EquipmentLine, ChangeOrder } from "@/lib/dashboard/data";

function useInvalidate() {
  const qc = useQueryClient();
  return (jobId?: string) => {
    qc.invalidateQueries({ queryKey: ["jobs"] });
    qc.invalidateQueries({ queryKey: ["financials"] });
    if (jobId) qc.invalidateQueries({ queryKey: ["job", jobId] });
  };
}

// ---------- Job form ----------
const JOB_FIELDS: Field[] = [
  { name: "name", label: "Job name", kind: "text", required: true, full: true, placeholder: "e.g. Lakefront Shell — Lot 14" },
  { name: "client", label: "Client", kind: "text", required: true },
  { name: "county", label: "County", kind: "text", required: true },
  { name: "status", label: "Status", kind: "select", required: true, options: [
    { value: "active", label: "Active" }, { value: "closed", label: "Closed" },
  ]},
  { name: "contractAmount", label: "Contract amount (USD)", kind: "number", required: true, min: 0 },
  { name: "startDate", label: "Start date", kind: "date", required: true },
  { name: "closedDate", label: "Closed date", kind: "date", showWhen: (v) => v.status === "closed" },
];

export function JobFormDialog({
  open, onOpenChange, job, onCreated,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  job?: Job;
  onCreated?: (id: string) => void;
}) {
  const editing = !!job;
  const invalidate = useInvalidate();
  const createFn = useServerFn(createJob);
  const updateFn = useServerFn(updateJob);

  const m = useMutation({
    mutationFn: async (vals: Record<string, string>) => {
      const id = job?.id ?? newId();
      const payload = {
        id,
        name: vals.name,
        client: vals.client,
        county: vals.county,
        status: vals.status as "active" | "closed",
        startDate: vals.startDate,
        closedDate: vals.status === "closed" && vals.closedDate ? vals.closedDate : null,
        contractAmount: Number(vals.contractAmount),
      };
      if (editing) await updateFn({ data: payload });
      else await createFn({ data: payload });
      return id;
    },
    onSuccess: (id) => {
      toast.success(editing ? "Job updated" : "Job created");
      invalidate(id);
      onOpenChange(false);
      if (!editing) onCreated?.(id);
    },
    onError: (e: Error) => toast.error(e.message || "Save failed"),
  });

  const initial = {
    name: job?.name ?? "",
    client: job?.client ?? "",
    county: job?.county ?? "",
    status: job?.status ?? "active",
    contractAmount: job?.contractAmount?.toString() ?? "0",
    startDate: job?.startDate ?? new Date().toISOString().slice(0, 10),
    closedDate: job?.closedDate ?? "",
  };

  return (
    <FormDialog
      open={open} onOpenChange={onOpenChange}
      title={editing ? "Edit job" : "New job"}
      description={editing ? "Update job details." : "Create a new construction job."}
      fields={JOB_FIELDS}
      initial={initial}
      submitting={m.isPending}
      submitLabel={editing ? "Save changes" : "Create job"}
      onSubmit={(v) => m.mutateAsync(v)}
    />
  );
}

export function DeleteJobDialog({ open, onOpenChange, job, onDeleted }: {
  open: boolean; onOpenChange: (v: boolean) => void; job: Job; onDeleted?: () => void;
}) {
  const invalidate = useInvalidate();
  const del = useServerFn(deleteJob);
  const m = useMutation({
    mutationFn: () => del({ data: { id: job.id } }),
    onSuccess: () => {
      toast.success("Job deleted");
      invalidate();
      onOpenChange(false);
      onDeleted?.();
    },
    onError: (e: Error) => toast.error(e.message || "Delete failed"),
  });
  return (
    <ConfirmDialog
      open={open} onOpenChange={onOpenChange}
      title={`Delete ${job.name}?`}
      description="This removes the job and all of its labor, materials, subcontractor, equipment, and change-order lines. This cannot be undone."
      confirmLabel="Delete job"
      busy={m.isPending}
      onConfirm={() => m.mutateAsync()}
    />
  );
}

// ---------- Line item dialogs ----------
type LineKind = "labor" | "materials" | "subs" | "equipment" | "co";

const TRADES = ["Electrical", "Plumbing", "Concrete", "HVAC", "Roofing", "Framing", "Other"];
const CATEGORIES = ["Excavator", "Skid Steer", "Dump Truck", "Concrete Pump", "Lift", "Other"];

const LINE_FIELDS: Record<LineKind, Field[]> = {
  labor: [
    { name: "worker", label: "Worker", kind: "text", required: true },
    { name: "role", label: "Role", kind: "text", required: true },
    { name: "hours", label: "Hours", kind: "number", required: true, min: 0 },
    { name: "rate", label: "Rate ($/hr)", kind: "number", required: true, min: 0 },
  ],
  materials: [
    { name: "item", label: "Item", kind: "text", required: true, full: true },
    { name: "qty", label: "Qty", kind: "number", required: true, min: 0 },
    { name: "unit", label: "Unit", kind: "text", required: true, placeholder: "ea / cy / lf" },
    { name: "unitCost", label: "Unit cost ($)", kind: "number", required: true, min: 0, full: true },
  ],
  subs: [
    { name: "vendor", label: "Vendor", kind: "text", required: true, full: true },
    { name: "trade", label: "Trade", kind: "select", required: true,
      options: TRADES.map((t) => ({ value: t, label: t })) },
    { name: "amount", label: "Amount ($)", kind: "number", required: true, min: 0 },
  ],
  equipment: [
    { name: "machine", label: "Machine", kind: "text", required: true, full: true },
    { name: "category", label: "Category", kind: "select", required: true,
      options: CATEGORIES.map((c) => ({ value: c, label: c })) },
    { name: "days", label: "Days", kind: "number", required: true, min: 0 },
    { name: "dayRate", label: "Day rate ($)", kind: "number", required: true, min: 0, full: true },
  ],
  co: [
    { name: "description", label: "Description", kind: "text", required: true, full: true },
    { name: "amount", label: "Amount ($)", kind: "number", required: true },
    { name: "date", label: "Date", kind: "date", required: true },
  ],
};

type AnyLine = LaborLine | MaterialLine | SubLine | EquipmentLine | ChangeOrder;

function initialFor(kind: LineKind, line?: AnyLine): Record<string, string> {
  if (!line) {
    switch (kind) {
      case "labor": return { worker: "", role: "", hours: "0", rate: "0" };
      case "materials": return { item: "", qty: "0", unit: "ea", unitCost: "0" };
      case "subs": return { vendor: "", trade: "Other", amount: "0" };
      case "equipment": return { machine: "", category: "Other", days: "0", dayRate: "0" };
      case "co": return { description: "", amount: "0", date: new Date().toISOString().slice(0, 10) };
    }
  }
  const l = line as Record<string, unknown>;
  const out: Record<string, string> = {};
  for (const k of Object.keys(l)) out[k] = l[k] == null ? "" : String(l[k]);
  return out;
}

export function LineFormDialog({
  open, onOpenChange, kind, jobId, line,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  kind: LineKind;
  jobId: string;
  line?: AnyLine;
}) {
  const editing = !!line;
  const invalidate = useInvalidate();

  const upsertCo = useServerFn(upsertChangeOrder);
  const upsertLa = useServerFn(upsertLabor);
  const upsertMa = useServerFn(upsertMaterial);
  const upsertSb = useServerFn(upsertSub);
  const upsertEq = useServerFn(upsertEquipment);

  const m = useMutation({
    mutationFn: async (v: Record<string, string>) => {
      const id = line?.id ?? newId();
      const base = { id, jobId };
      switch (kind) {
        case "labor":
          return upsertLa({ data: { ...base, worker: v.worker, role: v.role, hours: Number(v.hours), rate: Number(v.rate) } });
        case "materials":
          return upsertMa({ data: { ...base, item: v.item, qty: Number(v.qty), unit: v.unit, unitCost: Number(v.unitCost) } });
        case "subs":
          return upsertSb({ data: { ...base, vendor: v.vendor, trade: v.trade as SubLine["trade"], amount: Number(v.amount) } });
        case "equipment":
          return upsertEq({ data: { ...base, machine: v.machine, category: v.category as EquipmentLine["category"], days: Number(v.days), dayRate: Number(v.dayRate) } });
        case "co":
          return upsertCo({ data: { ...base, description: v.description, amount: Number(v.amount), date: v.date } });
      }
    },
    onSuccess: () => {
      toast.success(editing ? "Line updated" : "Line added");
      invalidate(jobId);
      onOpenChange(false);
    },
    onError: (e: Error) => toast.error(e.message || "Save failed"),
  });

  const titles: Record<LineKind, string> = {
    labor: editing ? "Edit labor line" : "Add labor line",
    materials: editing ? "Edit material line" : "Add material line",
    subs: editing ? "Edit subcontractor" : "Add subcontractor",
    equipment: editing ? "Edit equipment line" : "Add equipment line",
    co: editing ? "Edit change order" : "Add change order",
  };

  return (
    <FormDialog
      open={open} onOpenChange={onOpenChange}
      title={titles[kind]}
      fields={LINE_FIELDS[kind]}
      initial={initialFor(kind, line)}
      submitting={m.isPending}
      submitLabel={editing ? "Save changes" : "Add line"}
      onSubmit={(v) => m.mutateAsync(v)}
    />
  );
}

export function DeleteLineDialog({
  open, onOpenChange, kind, id, jobId, label,
}: {
  open: boolean; onOpenChange: (v: boolean) => void;
  kind: LineKind; id: string; jobId: string; label: string;
}) {
  const invalidate = useInvalidate();
  const delCo = useServerFn(deleteChangeOrder);
  const delLa = useServerFn(deleteLabor);
  const delMa = useServerFn(deleteMaterial);
  const delSb = useServerFn(deleteSub);
  const delEq = useServerFn(deleteEquipment);
  const fn = kind === "labor" ? delLa : kind === "materials" ? delMa : kind === "subs" ? delSb : kind === "equipment" ? delEq : delCo;
  const m = useMutation({
    mutationFn: () => fn({ data: { id } }),
    onSuccess: () => { toast.success("Line deleted"); invalidate(jobId); onOpenChange(false); },
    onError: (e: Error) => toast.error(e.message || "Delete failed"),
  });
  return (
    <ConfirmDialog
      open={open} onOpenChange={onOpenChange}
      title="Delete line?"
      description={<>Remove <span className="text-fg">{label}</span>. Totals will recompute automatically.</>}
      busy={m.isPending}
      onConfirm={() => m.mutateAsync()}
    />
  );
}

// Helper to open dialogs for a line kind
export function useLineDialogs() {
  const [state, setState] = useState<
    | { mode: "closed" }
    | { mode: "create"; kind: LineKind }
    | { mode: "edit"; kind: LineKind; line: AnyLine }
    | { mode: "delete"; kind: LineKind; id: string; label: string }
  >({ mode: "closed" });
  return {
    state,
    openCreate: (kind: LineKind) => setState({ mode: "create", kind }),
    openEdit: (kind: LineKind, line: AnyLine) => setState({ mode: "edit", kind, line }),
    openDelete: (kind: LineKind, id: string, label: string) => setState({ mode: "delete", kind, id, label }),
    close: () => setState({ mode: "closed" }),
  };
}
