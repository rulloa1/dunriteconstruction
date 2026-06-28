import { useState, type ReactNode } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Loader2 } from "lucide-react";

export type FieldKind = "text" | "number" | "date" | "month" | "select";
export interface Field {
  name: string;
  label: string;
  kind: FieldKind;
  required?: boolean;
  min?: number;
  step?: string;
  options?: { value: string; label: string }[];
  placeholder?: string;
  showWhen?: (values: Record<string, string>) => boolean;
  full?: boolean; // span both cols
}

export function FormDialog({
  open, onOpenChange, title, description, fields, initial, submitting, onSubmit, submitLabel = "Save",
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  title: string;
  description?: string;
  fields: Field[];
  initial: Record<string, string>;
  submitting: boolean;
  submitLabel?: string;
  onSubmit: (values: Record<string, string>) => Promise<void> | void;
}) {
  const [values, setValues] = useState<Record<string, string>>(initial);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Reset when reopened
  function handleOpenChange(v: boolean) {
    if (v) { setValues(initial); setErrors({}); }
    onOpenChange(v);
  }

  function validate(): Record<string, string> {
    const errs: Record<string, string> = {};
    for (const f of fields) {
      if (f.showWhen && !f.showWhen(values)) continue;
      const raw = (values[f.name] ?? "").trim();
      if (f.required && !raw) { errs[f.name] = "Required"; continue; }
      if (f.kind === "number" && raw !== "") {
        const n = Number(raw);
        if (!Number.isFinite(n)) errs[f.name] = "Must be a number";
        else if ((f.min ?? 0) !== undefined && n < (f.min ?? 0)) errs[f.name] = `Must be ≥ ${f.min ?? 0}`;
      }
      if (f.kind === "date" && raw !== "" && Number.isNaN(Date.parse(raw))) {
        errs[f.name] = "Invalid date";
      }
    }
    return errs;
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    const errs = validate();
    setErrors(errs);
    if (Object.keys(errs).length) return;
    await onSubmit(values);
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="app-shell !bg-[var(--bg-elev)] !border-[var(--border-soft)] !text-[var(--fg)] sm:max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="font-display">{title}</DialogTitle>
          {description && <DialogDescription className="text-dim font-ui text-xs">{description}</DialogDescription>}
        </DialogHeader>
        <form onSubmit={submit} className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
          {fields.map((f) => {
            if (f.showWhen && !f.showWhen(values)) return null;
            const err = errors[f.name];
            return (
              <FieldRow key={f.name} field={f} value={values[f.name] ?? ""} error={err}
                onChange={(v) => setValues((s) => ({ ...s, [f.name]: v }))} />
            );
          })}
          <DialogFooter className="sm:col-span-2 mt-2 gap-2">
            <button type="button" onClick={() => onOpenChange(false)} className="btn focus-ring" disabled={submitting}>
              Cancel
            </button>
            <button type="submit" disabled={submitting} className="btn btn-primary focus-ring">
              {submitting && <Loader2 size={14} className="animate-spin" />} {submitLabel}
            </button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

function FieldRow({ field, value, error, onChange }: {
  field: Field; value: string; error?: string; onChange: (v: string) => void;
}) {
  const base = "w-full px-3 py-2 rounded-lg focus-ring font-ui text-sm";
  const style = {
    background: "var(--bg-card)",
    border: `1px solid ${error ? "var(--negative, #b04848)" : "var(--border-soft)"}`,
    color: "var(--fg)",
  } as React.CSSProperties;
  return (
    <label className={`flex flex-col gap-1.5 ${field.full ? "sm:col-span-2" : ""}`}>
      <span className="kbd-label">
        {field.label}{field.required && <span className="text-gold"> *</span>}
      </span>
      {field.kind === "select" ? (
        <select className={base} style={style} value={value} onChange={(e) => onChange(e.target.value)}>
          {!field.required && <option value="">—</option>}
          {field.options?.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
        </select>
      ) : (
        <input
          className={base}
          style={style}
          type={field.kind === "number" ? "number" : field.kind === "date" ? "date" : "text"}
          step={field.kind === "number" ? (field.step ?? "0.01") : undefined}
          min={field.kind === "number" ? field.min ?? 0 : undefined}
          placeholder={field.placeholder}
          value={value}
          onChange={(e) => onChange(e.target.value)}
        />
      )}
      {error && <span className="text-xs" style={{ color: "var(--negative, #b04848)" }}>{error}</span>}
    </label>
  );
}

export function ConfirmDialog({
  open, onOpenChange, title, description, confirmLabel = "Delete", destructive = true, onConfirm, busy,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  title: string;
  description: ReactNode;
  confirmLabel?: string;
  destructive?: boolean;
  busy?: boolean;
  onConfirm: () => Promise<void> | void;
}) {
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent className="app-shell !bg-[var(--bg-elev)] !border-[var(--border-soft)] !text-[var(--fg)]">
        <AlertDialogHeader>
          <AlertDialogTitle className="font-display">{title}</AlertDialogTitle>
          <AlertDialogDescription className="text-dim font-ui text-sm">{description}</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel className="btn focus-ring">Cancel</AlertDialogCancel>
          <AlertDialogAction
            disabled={busy}
            onClick={async (e) => { e.preventDefault(); await onConfirm(); }}
            className="btn focus-ring"
            style={destructive ? { background: "#7a2e2e", borderColor: "#a04040", color: "white" } : undefined}
          >
            {busy && <Loader2 size={14} className="animate-spin" />} {confirmLabel}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

export const newId = () =>
  (typeof crypto !== "undefined" && "randomUUID" in crypto) ? crypto.randomUUID() : `id-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
