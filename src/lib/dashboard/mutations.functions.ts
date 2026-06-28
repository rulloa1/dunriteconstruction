// Server-side mutations for the dashboard. RLS as the signed-in user.
import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

const Status = z.enum(["active", "closed"]);
const Trade = z.enum(["Electrical", "Plumbing", "Concrete", "HVAC", "Roofing", "Framing", "Other"]);
const Category = z.enum(["Excavator", "Skid Steer", "Dump Truck", "Concrete Pump", "Lift", "Other"]);

const DateStr = z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Use YYYY-MM-DD");
const NonNeg = z.number().nonnegative();

// ---------- Jobs ----------
const jobBase = {
  name: z.string().trim().min(1).max(200),
  client: z.string().trim().min(1).max(200),
  county: z.string().trim().min(1).max(120),
  status: Status,
  startDate: DateStr,
  closedDate: DateStr.nullable().optional(),
  contractAmount: NonNeg,
};

export const createJob = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d) => z.object({ id: z.string().min(1), ...jobBase }).parse(d))
  .handler(async ({ data, context }) => {
    const { error } = await context.supabase.from("jobs").insert({
      id: data.id,
      name: data.name,
      client: data.client,
      county: data.county,
      status: data.status,
      start_date: data.startDate,
      closed_date: data.status === "closed" ? data.closedDate ?? null : null,
      contract_amount: data.contractAmount,
    });
    if (error) throw new Error(error.message);
    return { id: data.id };
  });

export const updateJob = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d) => z.object({ id: z.string().min(1), ...jobBase }).parse(d))
  .handler(async ({ data, context }) => {
    const { error } = await context.supabase.from("jobs").update({
      name: data.name,
      client: data.client,
      county: data.county,
      status: data.status,
      start_date: data.startDate,
      closed_date: data.status === "closed" ? data.closedDate ?? null : null,
      contract_amount: data.contractAmount,
    }).eq("id", data.id);
    if (error) throw new Error(error.message);
    return { id: data.id };
  });

export const deleteJob = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d) => z.object({ id: z.string().min(1) }).parse(d))
  .handler(async ({ data, context }) => {
    const { error } = await context.supabase.from("jobs").delete().eq("id", data.id);
    if (error) throw new Error(error.message);
    return { ok: true };
  });

// ---------- Generic child-line upsert/delete factories ----------
function makeUpsert<Schema extends z.ZodTypeAny>(
  table: string,
  schema: Schema,
  toRow: (d: z.infer<Schema>) => Record<string, unknown>,
) {
  return createServerFn({ method: "POST" })
    .middleware([requireSupabaseAuth])
    .inputValidator((d) => schema.parse(d))
    .handler(async ({ data, context }) => {
      const row = toRow(data);
      const { error } = await (context.supabase as any).from(table).upsert(row);
      if (error) throw new Error(error.message);
      return { id: row.id as string };
    });
}

function makeDelete(table: string) {
  return createServerFn({ method: "POST" })
    .middleware([requireSupabaseAuth])
    .inputValidator((d) => z.object({ id: z.string().min(1) }).parse(d))
    .handler(async ({ data, context }) => {
      const { error } = await (context.supabase as any).from(table).delete().eq("id", data.id);
      if (error) throw new Error(error.message);
      return { ok: true };
    });
}

// ---------- Change orders ----------
const coSchema = z.object({
  id: z.string().min(1),
  jobId: z.string().min(1),
  description: z.string().trim().min(1).max(300),
  amount: z.number(),
  date: DateStr,
});
export const upsertChangeOrder = makeUpsert("change_orders", coSchema, (d) => ({
  id: d.id, job_id: d.jobId, description: d.description, amount: d.amount, date: d.date,
}));
export const deleteChangeOrder = makeDelete("change_orders");

// ---------- Labor ----------
const laborSchema = z.object({
  id: z.string().min(1),
  jobId: z.string().min(1),
  worker: z.string().trim().min(1).max(160),
  role: z.string().trim().min(1).max(120),
  hours: NonNeg,
  rate: NonNeg,
});
export const upsertLabor = makeUpsert("labor_lines", laborSchema, (d) => ({
  id: d.id, job_id: d.jobId, worker: d.worker, role: d.role, hours: d.hours, rate: d.rate,
}));
export const deleteLabor = makeDelete("labor_lines");

// ---------- Materials ----------
const materialSchema = z.object({
  id: z.string().min(1),
  jobId: z.string().min(1),
  item: z.string().trim().min(1).max(200),
  qty: NonNeg,
  unit: z.string().trim().min(1).max(40),
  unitCost: NonNeg,
});
export const upsertMaterial = makeUpsert("material_lines", materialSchema, (d) => ({
  id: d.id, job_id: d.jobId, item: d.item, qty: d.qty, unit: d.unit, unit_cost: d.unitCost,
}));
export const deleteMaterial = makeDelete("material_lines");

// ---------- Subs ----------
const subSchema = z.object({
  id: z.string().min(1),
  jobId: z.string().min(1),
  vendor: z.string().trim().min(1).max(200),
  trade: Trade,
  amount: NonNeg,
});
export const upsertSub = makeUpsert("sub_lines", subSchema, (d) => ({
  id: d.id, job_id: d.jobId, vendor: d.vendor, trade: d.trade, amount: d.amount,
}));
export const deleteSub = makeDelete("sub_lines");

// ---------- Equipment ----------
const equipSchema = z.object({
  id: z.string().min(1),
  jobId: z.string().min(1),
  machine: z.string().trim().min(1).max(200),
  category: Category,
  days: NonNeg,
  dayRate: NonNeg,
});
export const upsertEquipment = makeUpsert("equipment_lines", equipSchema, (d) => ({
  id: d.id, job_id: d.jobId, machine: d.machine, category: d.category, days: d.days, day_rate: d.dayRate,
}));
export const deleteEquipment = makeDelete("equipment_lines");

// ---------- Overhead ----------
const Period = z.string().regex(/^\d{4}-(0[1-9]|1[0-2])$/, "Use YYYY-MM");
const overheadSchema = z.object({
  id: z.string().min(1),
  category: z.string().trim().min(1).max(160),
  amount: NonNeg,
  period: Period,
});
export const upsertOverhead = makeUpsert("overhead", overheadSchema, (d) => ({
  id: d.id, category: d.category, amount: d.amount, period: d.period,
}));
export const deleteOverhead = makeDelete("overhead");

// ---------- Owner draws ----------
const drawSchema = z.object({
  id: z.string().min(1),
  owner: z.string().trim().min(1).max(160),
  amount: NonNeg,
  period: Period,
});
export const upsertOwnerDraw = makeUpsert("owner_draws", drawSchema, (d) => ({
  id: d.id, owner: d.owner, amount: d.amount, period: d.period,
}));
export const deleteOwnerDraw = makeDelete("owner_draws");
