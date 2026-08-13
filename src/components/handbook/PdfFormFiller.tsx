import { useCallback, useEffect, useRef, useState } from "react";
import { Download, FileUp, Loader2, RotateCcw } from "lucide-react";

type FieldKind = "text" | "multiline" | "checkbox" | "radio" | "dropdown" | "optionlist";

export type DetectedField = {
  name: string;
  label: string;
  kind: FieldKind;
  page: number;
  options?: string[];
  readOnly?: boolean;
  maxLength?: number;
};

type Values = Record<string, string | boolean>;

function prettyLabel(name: string) {
  const leaf = name.split(/[.\]]/).filter(Boolean).pop() ?? name;
  return leaf
    .replace(/\[\d+\]/g, "")
    .replace(/[_-]+/g, " ")
    .replace(/([a-z])([A-Z])/g, "$1 $2")
    .replace(/\s+/g, " ")
    .trim()
    .replace(/^\w/, (c) => c.toUpperCase());
}

async function loadPdfLib() {
  return await import("pdf-lib");
}

export function PdfFormFiller({ src, fileName }: { src?: string; fileName?: string }) {
  const [bytes, setBytes] = useState<Uint8Array | null>(null);
  const [name, setName] = useState(fileName ?? "form.pdf");
  const [fields, setFields] = useState<DetectedField[] | null>(null);
  const [values, setValues] = useState<Values>({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const analyze = useCallback(async (buf: Uint8Array) => {
    setLoading(true);
    setError(null);
    try {
      const { PDFDocument, PDFTextField, PDFCheckBox, PDFDropdown, PDFOptionList, PDFRadioGroup } =
        await loadPdfLib();
      const doc = await PDFDocument.load(buf, { ignoreEncryption: true, updateMetadata: false });
      const form = doc.getForm();
      const pageRefs = doc.getPages().map((p) => p.ref);

      const detected: DetectedField[] = [];
      const initial: Values = {};

      for (const f of form.getFields()) {
        const fname = f.getName();
        let page = 0;
        try {
          const widgets = f.acroField.getWidgets();
          const pRef = widgets[0]?.P();
          const idx = pageRefs.findIndex((r) => pRef && r === pRef);
          if (idx >= 0) page = idx;
        } catch {
          /* keep page 0 */
        }

        const base = { name: fname, label: prettyLabel(fname), page };

        if (f instanceof PDFTextField) {
          detected.push({
            ...base,
            kind: f.isMultiline() ? "multiline" : "text",
            readOnly: f.isReadOnly(),
            maxLength: f.getMaxLength() ?? undefined,
          });
          initial[fname] = f.getText() ?? "";
        } else if (f instanceof PDFCheckBox) {
          detected.push({ ...base, kind: "checkbox", readOnly: f.isReadOnly() });
          initial[fname] = f.isChecked();
        } else if (f instanceof PDFRadioGroup) {
          detected.push({
            ...base,
            kind: "radio",
            options: f.getOptions(),
            readOnly: f.isReadOnly(),
          });
          initial[fname] = f.getSelected() ?? "";
        } else if (f instanceof PDFDropdown) {
          detected.push({
            ...base,
            kind: "dropdown",
            options: f.getOptions(),
            readOnly: f.isReadOnly(),
          });
          initial[fname] = f.getSelected()[0] ?? "";
        } else if (f instanceof PDFOptionList) {
          detected.push({
            ...base,
            kind: "optionlist",
            options: f.getOptions(),
            readOnly: f.isReadOnly(),
          });
          initial[fname] = f.getSelected()[0] ?? "";
        }
      }

      detected.sort((a, b) => a.page - b.page);
      setFields(detected);
      setValues(initial);
      setBytes(buf);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not read this PDF.");
      setFields(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!src) return;
    let cancelled = false;
    setLoading(true);
    fetch(src)
      .then((r) => {
        if (!r.ok) throw new Error(`Could not fetch ${src}`);
        return r.arrayBuffer();
      })
      .then((ab) => {
        if (!cancelled) {
          setName(src.split("/").pop() ?? "form.pdf");
          void analyze(new Uint8Array(ab));
        }
      })
      .catch((e: unknown) => {
        if (!cancelled) {
          setError(e instanceof Error ? e.message : "Could not load the PDF.");
          setLoading(false);
        }
      });
    return () => {
      cancelled = true;
    };
  }, [src, analyze]);

  async function onPick(file: File) {
    setName(file.name);
    void analyze(new Uint8Array(await file.arrayBuffer()));
  }

  async function download() {
    if (!bytes || !fields) return;
    setSaving(true);
    try {
      const { PDFDocument } = await loadPdfLib();
      const doc = await PDFDocument.load(bytes, { ignoreEncryption: true });
      const form = doc.getForm();
      for (const f of fields) {
        if (f.readOnly) continue;
        const v = values[f.name];
        try {
          if (f.kind === "checkbox") {
            const cb = form.getCheckBox(f.name);
            if (v) cb.check();
            else cb.uncheck();
          } else if (f.kind === "radio") {
            if (v) form.getRadioGroup(f.name).select(String(v));
          } else if (f.kind === "dropdown") {
            if (v) form.getDropdown(f.name).select(String(v));
          } else if (f.kind === "optionlist") {
            if (v) form.getOptionList(f.name).select(String(v));
          } else {
            form.getTextField(f.name).setText(String(v ?? ""));
          }
        } catch {
          /* skip fields that reject the value */
        }
      }
      const out = await doc.save();
      const blob = new Blob([out as BlobPart], { type: "application/pdf" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = name.replace(/\.pdf$/i, "") + "_filled.pdf";
      a.click();
      URL.revokeObjectURL(url);
    } finally {
      setSaving(false);
    }
  }

  const pages = fields ? [...new Set(fields.map((f) => f.page))].sort((a, b) => a - b) : [];

  return (
    <div className="space-y-4">
      {!src && (
        <div className="rounded-xl border border-dashed p-6 text-center">
          <input
            ref={fileRef}
            type="file"
            accept="application/pdf"
            className="hidden"
            onChange={(e) => {
              const f = e.target.files?.[0];
              if (f) void onPick(f);
            }}
          />
          <button
            type="button"
            onClick={() => fileRef.current?.click()}
            className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground"
          >
            <FileUp className="h-4 w-4" /> Upload a fillable PDF
          </button>
          <p className="text-muted-foreground mt-2 text-xs">
            Fields are detected in your browser — nothing is uploaded to a server.
          </p>
        </div>
      )}

      {loading && (
        <div className="text-muted-foreground flex items-center gap-2 text-sm">
          <Loader2 className="h-4 w-4 animate-spin" /> Detecting form fields…
        </div>
      )}

      {error && (
        <div className="rounded-lg border border-destructive/40 bg-destructive/10 p-3 text-sm text-destructive">
          {error}
        </div>
      )}

      {fields && !loading && fields.length === 0 && (
        <div className="text-muted-foreground rounded-lg border p-4 text-sm">
          No fillable fields found in this PDF — print it and complete by hand, or use the viewer.
        </div>
      )}

      {fields && fields.length > 0 && (
        <>
          <div className="sticky top-0 z-10 flex flex-wrap items-center justify-between gap-2 rounded-lg border bg-card/95 p-3 backdrop-blur">
            <span className="text-muted-foreground text-xs uppercase tracking-wide">
              {fields.length} fields detected · {pages.length} page{pages.length === 1 ? "" : "s"}
            </span>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setValues({})}
                className="inline-flex items-center gap-1.5 rounded-lg border px-3 py-2 text-sm font-medium hover:bg-muted"
              >
                <RotateCcw className="h-3.5 w-3.5" /> Clear
              </button>
              <button
                type="button"
                onClick={() => void download()}
                disabled={saving}
                className="inline-flex items-center gap-1.5 rounded-lg bg-primary px-3 py-2 text-sm font-medium text-primary-foreground disabled:opacity-60"
              >
                {saving ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Download className="h-4 w-4" />
                )}
                Download filled PDF
              </button>
            </div>
          </div>

          {pages.map((p) => (
            <section key={p} className="rounded-xl border bg-card p-5">
              <h3 className="mb-4 text-[11px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">
                Page {p + 1}
              </h3>
              <div className="grid gap-4 sm:grid-cols-2">
                {fields
                  .filter((f) => f.page === p)
                  .map((f) => (
                    <FieldInput
                      key={f.name}
                      field={f}
                      value={values[f.name]}
                      onChange={(v) => setValues((prev) => ({ ...prev, [f.name]: v }))}
                    />
                  ))}
              </div>
            </section>
          ))}
        </>
      )}
    </div>
  );
}

function FieldInput({
  field,
  value,
  onChange,
}: {
  field: DetectedField;
  value: string | boolean | undefined;
  onChange: (v: string | boolean) => void;
}) {
  const cls =
    "w-full rounded-lg border bg-background px-3 py-2 text-sm outline-none focus:border-primary disabled:opacity-60";

  if (field.kind === "checkbox") {
    return (
      <label className="flex items-center gap-2 text-sm sm:col-span-2">
        <input
          type="checkbox"
          checked={Boolean(value)}
          disabled={field.readOnly}
          onChange={(e) => onChange(e.target.checked)}
          className="h-4 w-4 accent-[var(--brand-blue,#5B9FCC)]"
        />
        <span title={field.name}>{field.label}</span>
      </label>
    );
  }

  const label = (
    <span className="mb-1 block text-xs font-medium text-muted-foreground" title={field.name}>
      {field.label}
    </span>
  );

  if (field.kind === "multiline") {
    return (
      <label className="block sm:col-span-2">
        {label}
        <textarea
          rows={3}
          className={cls}
          disabled={field.readOnly}
          value={String(value ?? "")}
          onChange={(e) => onChange(e.target.value)}
        />
      </label>
    );
  }

  if (field.options) {
    return (
      <label className="block">
        {label}
        <select
          className={cls}
          disabled={field.readOnly}
          value={String(value ?? "")}
          onChange={(e) => onChange(e.target.value)}
        >
          <option value="">— select —</option>
          {field.options.map((o) => (
            <option key={o} value={o}>
              {o}
            </option>
          ))}
        </select>
      </label>
    );
  }

  return (
    <label className="block">
      {label}
      <input
        type="text"
        className={cls}
        disabled={field.readOnly}
        maxLength={field.maxLength}
        value={String(value ?? "")}
        onChange={(e) => onChange(e.target.value)}
      />
    </label>
  );
}
