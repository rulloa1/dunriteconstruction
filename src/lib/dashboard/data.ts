// Dun Rite OS — types, computations, and formatters.
// Raw data now lives in Supabase. Fetch via src/lib/dashboard/queries.functions.ts.

export type JobStatus = "active" | "closed";

export interface LaborLine {
  id: string;
  worker: string;
  role: string;
  hours: number;
  rate: number;
}
export interface MaterialLine {
  id: string;
  item: string;
  qty: number;
  unit: string;
  unitCost: number;
}
export interface SubLine {
  id: string;
  vendor: string;
  trade: "Electrical" | "Plumbing" | "Concrete" | "HVAC" | "Roofing" | "Framing" | "Other";
  amount: number;
}
export interface EquipmentLine {
  id: string;
  machine: string;
  category: "Excavator" | "Skid Steer" | "Dump Truck" | "Concrete Pump" | "Lift" | "Other";
  days: number;
  dayRate: number;
}
export interface ChangeOrder {
  id: string;
  description: string;
  amount: number;
  date: string;
}

export interface Job {
  id: string;
  name: string;
  client: string;
  county: string;
  status: JobStatus;
  startDate: string;
  closedDate?: string;
  contractAmount: number;
  changeOrders: ChangeOrder[];
  labor: LaborLine[];
  materials: MaterialLine[];
  subs: SubLine[];
  equipment: EquipmentLine[];
}

export interface OverheadLine {
  id: string;
  category: string;
  amount: number;
  period: string;
}
export interface OwnerDraw {
  id: string;
  owner: string;
  amount: number;
  period: string;
}

// ---------- Computations ----------
export const sum = (xs: number[]) => xs.reduce((a, b) => a + b, 0);

export const laborTotal = (lines: LaborLine[]) => sum(lines.map((l) => l.hours * l.rate));
export const materialsTotal = (lines: MaterialLine[]) => sum(lines.map((l) => l.qty * l.unitCost));
export const subsTotal = (lines: SubLine[]) => sum(lines.map((l) => l.amount));
export const equipmentTotal = (lines: EquipmentLine[]) => sum(lines.map((l) => l.days * l.dayRate));

export interface JobTotals {
  revenue: number;
  contract: number;
  changeOrders: number;
  labor: number;
  materials: number;
  subs: number;
  equipment: number;
  totalCost: number;
  grossProfit: number;
  margin: number;
}

export function jobTotals(job: Job): JobTotals {
  const contract = job.contractAmount;
  const changeOrders = sum(job.changeOrders.map((c) => c.amount));
  const revenue = contract + changeOrders;
  const labor = laborTotal(job.labor);
  const materials = materialsTotal(job.materials);
  const subs = subsTotal(job.subs);
  const equipment = equipmentTotal(job.equipment);
  const totalCost = labor + materials + subs + equipment;
  const grossProfit = revenue - totalCost;
  const margin = revenue > 0 ? grossProfit / revenue : 0;
  return { revenue, contract, changeOrders, labor, materials, subs, equipment, totalCost, grossProfit, margin };
}

export interface PortfolioKPIs {
  revenue: number;
  totalCost: number;
  grossProfit: number;
  margin: number;
  activeJobs: number;
  closedJobs: number;
}
export function portfolioKPIs(jobs: Job[]): PortfolioKPIs {
  const t = jobs.map(jobTotals);
  const revenue = sum(t.map((x) => x.revenue));
  const totalCost = sum(t.map((x) => x.totalCost));
  const grossProfit = revenue - totalCost;
  return {
    revenue,
    totalCost,
    grossProfit,
    margin: revenue > 0 ? grossProfit / revenue : 0,
    activeJobs: jobs.filter((j) => j.status === "active").length,
    closedJobs: jobs.filter((j) => j.status === "closed").length,
  };
}

export function jobsInPeriod(jobs: Job[], from: string, to: string): Job[] {
  return jobs.filter((j) => {
    const ref = j.closedDate ?? j.startDate;
    return ref >= from && ref <= to;
  });
}

export interface PeriodSummary {
  jobsGrossProfit: number;
  overhead: number;
  ownerDraws: number;
  netToCompany: number;
  jobsCount: number;
  jobsRevenue: number;
  jobsCost: number;
}
export function periodSummary(args: {
  jobs: Job[];
  overhead: OverheadLine[];
  draws: OwnerDraw[];
  from: string;
  to: string;
}): PeriodSummary {
  const periodJobs = jobsInPeriod(args.jobs, args.from, args.to);
  const totals = periodJobs.map(jobTotals);
  const jobsRevenue = sum(totals.map((t) => t.revenue));
  const jobsCost = sum(totals.map((t) => t.totalCost));
  const jobsGrossProfit = jobsRevenue - jobsCost;
  const inMonth = (period: string) => period >= args.from.slice(0, 7) && period <= args.to.slice(0, 7);
  const overhead = sum(args.overhead.filter((o) => inMonth(o.period)).map((o) => o.amount));
  const ownerDraws = sum(args.draws.filter((d) => inMonth(d.period)).map((d) => d.amount));
  return {
    jobsGrossProfit,
    overhead,
    ownerDraws,
    netToCompany: jobsGrossProfit - overhead - ownerDraws,
    jobsCount: periodJobs.length,
    jobsRevenue,
    jobsCost,
  };
}

// ---------- Formatters ----------
export const fmtUSD = (n: number) =>
  n.toLocaleString("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 });
export const fmtUSDc = (n: number) =>
  n.toLocaleString("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 2 });
export const fmtPct = (n: number) => `${(n * 100).toFixed(1)}%`;

export const marginTone = (m: number) =>
  m >= 0.2 ? "text-gold" : m >= 0.08 ? "text-positive" : m >= 0 ? "text-muted" : "text-negative";
