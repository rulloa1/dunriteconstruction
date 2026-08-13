// Server-side data fetching for the dashboard.
// Uses the request user's bearer token (RLS as the signed-in user).
import type { SupabaseClient } from "@supabase/supabase-js";
import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import type { Database } from "@/integrations/supabase/types";
import type {
  Job,
  OverheadLine,
  OwnerDraw,
  JobStatus,
  ChangeOrder,
  LaborLine,
  MaterialLine,
  SubLine,
  EquipmentLine,
} from "./data";

type AnyRow = Record<string, unknown>;

function mapJob(
  row: AnyRow,
  kids: {
    cos: AnyRow[];
    labor: AnyRow[];
    mats: AnyRow[];
    subs: AnyRow[];
    equip: AnyRow[];
  },
): Job {
  return {
    id: String(row.id),
    name: String(row.name),
    client: String(row.client),
    county: String(row.county),
    status: row.status as JobStatus,
    startDate: String(row.start_date),
    closedDate: row.closed_date ? String(row.closed_date) : undefined,
    contractAmount: Number(row.contract_amount),
    changeOrders: kids.cos.map<ChangeOrder>((c) => ({
      id: String(c.id),
      description: String(c.description),
      amount: Number(c.amount),
      date: String(c.date),
    })),
    labor: kids.labor.map<LaborLine>((l) => ({
      id: String(l.id),
      worker: String(l.worker),
      role: String(l.role),
      hours: Number(l.hours),
      rate: Number(l.rate),
    })),
    materials: kids.mats.map<MaterialLine>((m) => ({
      id: String(m.id),
      item: String(m.item),
      qty: Number(m.qty),
      unit: String(m.unit),
      unitCost: Number(m.unit_cost),
    })),
    subs: kids.subs.map<SubLine>((s) => ({
      id: String(s.id),
      vendor: String(s.vendor),
      trade: s.trade as SubLine["trade"],
      amount: Number(s.amount),
    })),
    equipment: kids.equip.map<EquipmentLine>((e) => ({
      id: String(e.id),
      machine: String(e.machine),
      category: e.category as EquipmentLine["category"],
      days: Number(e.days),
      dayRate: Number(e.day_rate),
    })),
  };
}

async function loadAllJobs(supabase: SupabaseClient<Database>): Promise<Job[]> {
  const [jobsR, coR, laR, maR, suR, eqR] = await Promise.all([
    supabase.from("jobs").select("*").order("start_date", { ascending: false }),
    supabase.from("change_orders").select("*"),
    supabase.from("labor_lines").select("*"),
    supabase.from("material_lines").select("*"),
    supabase.from("sub_lines").select("*"),
    supabase.from("equipment_lines").select("*"),
  ]);
  for (const r of [jobsR, coR, laR, maR, suR, eqR]) if (r.error) throw r.error;
  const byJob = <T extends AnyRow>(rows: T[]) =>
    rows.reduce<Record<string, T[]>>((acc, r) => {
      const k = String(r.job_id);
      (acc[k] ||= []).push(r);
      return acc;
    }, {});
  const cos = byJob(coR.data ?? []);
  const labor = byJob(laR.data ?? []);
  const mats = byJob(maR.data ?? []);
  const subs = byJob(suR.data ?? []);
  const equip = byJob(eqR.data ?? []);
  return (jobsR.data ?? []).map((j: AnyRow) =>
    mapJob(j, {
      cos: cos[String(j.id)] ?? [],
      labor: labor[String(j.id)] ?? [],
      mats: mats[String(j.id)] ?? [],
      subs: subs[String(j.id)] ?? [],
      equip: equip[String(j.id)] ?? [],
    }),
  );
}

export const getAllJobs = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }): Promise<Job[]> => {
    return loadAllJobs(context.supabase);
  });

export const getJobById = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d) => z.object({ id: z.string() }).parse(d))
  .handler(async ({ data, context }): Promise<Job | null> => {
    const { supabase } = context;
    const [j, co, la, ma, su, eq] = await Promise.all([
      supabase.from("jobs").select("*").eq("id", data.id).maybeSingle(),
      supabase.from("change_orders").select("*").eq("job_id", data.id),
      supabase.from("labor_lines").select("*").eq("job_id", data.id),
      supabase.from("material_lines").select("*").eq("job_id", data.id),
      supabase.from("sub_lines").select("*").eq("job_id", data.id),
      supabase.from("equipment_lines").select("*").eq("job_id", data.id),
    ]);
    for (const r of [j, co, la, ma, su, eq]) if (r.error) throw r.error;
    if (!j.data) return null;
    return mapJob(j.data as AnyRow, {
      cos: (co.data as AnyRow[]) ?? [],
      labor: (la.data as AnyRow[]) ?? [],
      mats: (ma.data as AnyRow[]) ?? [],
      subs: (su.data as AnyRow[]) ?? [],
      equip: (eq.data as AnyRow[]) ?? [],
    });
  });

export const getOverhead = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }): Promise<OverheadLine[]> => {
    const { data, error } = await context.supabase.from("overhead").select("*").order("period");
    if (error) throw error;
    return (data ?? []).map((r: AnyRow) => ({
      id: String(r.id),
      category: String(r.category),
      amount: Number(r.amount),
      period: String(r.period),
    }));
  });

export const getOwnerDraws = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }): Promise<OwnerDraw[]> => {
    const { data, error } = await context.supabase.from("owner_draws").select("*").order("period");
    if (error) throw error;
    return (data ?? []).map((r: AnyRow) => ({
      id: String(r.id),
      owner: String(r.owner),
      amount: Number(r.amount),
      period: String(r.period),
    }));
  });

export const getFinancialsBundle = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(
    async ({ context }): Promise<{ jobs: Job[]; overhead: OverheadLine[]; draws: OwnerDraw[] }> => {
      const [jobs, ohR, dwR] = await Promise.all([
        loadAllJobs(context.supabase),
        context.supabase.from("overhead").select("*"),
        context.supabase.from("owner_draws").select("*"),
      ]);
      if (ohR.error) throw ohR.error;
      if (dwR.error) throw dwR.error;
      return {
        jobs,
        overhead: (ohR.data ?? []).map((r: AnyRow) => ({
          id: String(r.id),
          category: String(r.category),
          amount: Number(r.amount),
          period: String(r.period),
        })),
        draws: (dwR.data ?? []).map((r: AnyRow) => ({
          id: String(r.id),
          owner: String(r.owner),
          amount: Number(r.amount),
          period: String(r.period),
        })),
      };
    },
  );
