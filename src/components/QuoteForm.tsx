import { useState } from "react";
import { z } from "zod";
import { supabase } from "@/integrations/supabase/client";

const COUNTIES = [
  "Citrus",
  "Hernando",
  "Hillsborough",
  "Lake",
  "Manatee",
  "Marion",
  "Pasco",
  "Pinellas",
  "Polk",
  "Sumter",
];

const PROJECT_TYPES = [
  "Full Shell Package",
  "Custom Home Shell",
  "Developer Project",
  "Concrete & Flatwork",
  "Other",
];

const schema = z.object({
  name: z.string().trim().min(1, "Required").max(120),
  phone: z.string().trim().min(7, "Enter a valid phone").max(40),
  email: z.string().trim().email("Enter a valid email").max(200),
  county: z.string().trim().min(1, "Required").max(60),
  projectType: z.string().trim().min(1, "Required").max(80),
  message: z.string().trim().max(2000).optional().or(z.literal("")),
});

type Errors = Partial<Record<keyof z.infer<typeof schema>, string>>;

export function QuoteForm() {
  const [form, setForm] = useState({
    name: "",
    phone: "",
    email: "",
    county: "",
    projectType: "",
    message: "",
  });
  const [errors, setErrors] = useState<Errors>({});
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [serverError, setServerError] = useState<string | null>(null);

  function set<K extends keyof typeof form>(key: K, val: string) {
    setForm((f) => ({ ...f, [key]: val }));
    if (errors[key]) setErrors((e) => ({ ...e, [key]: undefined }));
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setServerError(null);
    const parsed = schema.safeParse(form);
    if (!parsed.success) {
      const next: Errors = {};
      for (const issue of parsed.error.issues) {
        const k = issue.path[0] as keyof Errors;
        if (!next[k]) next[k] = issue.message;
      }
      setErrors(next);
      return;
    }
    setStatus("loading");
    const { error } = await supabase.from("quote_requests").insert({
      name: parsed.data.name,
      phone: parsed.data.phone,
      email: parsed.data.email,
      county: parsed.data.county,
      project_type: parsed.data.projectType,
      message: parsed.data.message || null,
    });
    if (error) {
      setStatus("error");
      setServerError("Something went wrong. Please try again or call us.");
      return;
    }
    setStatus("success");
  }

  if (status === "success") {
    return (
      <div className="qf-success" role="status" aria-live="polite">
        <div className="qf-check" aria-hidden>
          ✓
        </div>
        <h3>Thanks — we'll be in touch within one business day.</h3>
        <p>
          Prefer to talk now? <a href="tel:3525884050">Call (352) 588-4050</a>.
        </p>
      </div>
    );
  }

  return (
    <form className="qf" onSubmit={onSubmit} noValidate>
      <div className="qf-row">
        <Field label="Name" id="qf-name" error={errors.name}>
          <input
            id="qf-name"
            type="text"
            autoComplete="name"
            value={form.name}
            onChange={(e) => set("name", e.target.value)}
            aria-invalid={!!errors.name}
            required
          />
        </Field>
        <Field label="Phone" id="qf-phone" error={errors.phone}>
          <input
            id="qf-phone"
            type="tel"
            autoComplete="tel"
            value={form.phone}
            onChange={(e) => set("phone", e.target.value)}
            aria-invalid={!!errors.phone}
            required
          />
        </Field>
      </div>
      <div className="qf-row">
        <Field label="Email" id="qf-email" error={errors.email}>
          <input
            id="qf-email"
            type="email"
            autoComplete="email"
            value={form.email}
            onChange={(e) => set("email", e.target.value)}
            aria-invalid={!!errors.email}
            required
          />
        </Field>
        <Field label="County" id="qf-county" error={errors.county}>
          <select
            id="qf-county"
            value={form.county}
            onChange={(e) => set("county", e.target.value)}
            aria-invalid={!!errors.county}
            required
          >
            <option value="">Select county…</option>
            {COUNTIES.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </Field>
      </div>
      <Field label="Project Type" id="qf-type" error={errors.projectType}>
        <select
          id="qf-type"
          value={form.projectType}
          onChange={(e) => set("projectType", e.target.value)}
          aria-invalid={!!errors.projectType}
          required
        >
          <option value="">Select project type…</option>
          {PROJECT_TYPES.map((t) => (
            <option key={t} value={t}>
              {t}
            </option>
          ))}
        </select>
      </Field>
      <Field label="Message (optional)" id="qf-msg" error={errors.message}>
        <textarea
          id="qf-msg"
          rows={4}
          value={form.message}
          onChange={(e) => set("message", e.target.value)}
          placeholder="Tell us about your project, timeline, scope…"
        />
      </Field>

      {serverError && (
        <div className="qf-server-err" role="alert">
          {serverError}
        </div>
      )}

      <div className="qf-actions">
        <button type="submit" className="btn btn-gold" disabled={status === "loading"}>
          {status === "loading" ? "Sending…" : "Request a Quote"} <span className="arr">→</span>
        </button>
        <span className="qf-or">
          Prefer to talk? <a href="tel:3525884050">Call (352) 588-4050</a>
        </span>
      </div>
    </form>
  );
}

function Field({
  label,
  id,
  error,
  children,
}: {
  label: string;
  id: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <label className={"qf-field" + (error ? " has-err" : "")} htmlFor={id}>
      <span className="qf-label">{label}</span>
      {children}
      {error && <span className="qf-err">{error}</span>}
    </label>
  );
}
