// Dun Rite OS — single source of truth for mock financial data.
// Replace with Supabase queries later; keep the exported shapes stable.

export type JobStatus = "active" | "closed";

export interface LaborLine {
  id: string;
  worker: string;
  role: string;
  hours: number;
  rate: number; // $/hr
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
  date: string; // ISO
}

export interface Job {
  id: string;
  name: string;
  client: string;
  county: string;
  status: JobStatus;
  startDate: string; // ISO
  closedDate?: string; // ISO
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
  period: string; // YYYY-MM
}
export interface OwnerDraw {
  id: string;
  owner: string;
  amount: number;
  period: string; // YYYY-MM
}

// ---------- Computations (single source; never hardcode totals) ----------

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
  margin: number; // 0..1
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

// Period rollup: a job contributes if its startDate falls in the period
// (closed jobs that closed within the period also count). Good enough for mock.
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
  from: string; // YYYY-MM-DD
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

// Healthy margin classes — gold/positive for healthy, dim for thin, red for underwater.
export const marginTone = (m: number) =>
  m >= 0.2 ? "text-gold" : m >= 0.08 ? "text-positive" : m >= 0 ? "text-muted" : "text-negative";

// ---------- Mock seed data ----------
export const JOBS: Job[] = [
  {
    id: "j-101",
    name: "Hawthorne Residence — Slab & Shell",
    client: "Hawthorne Custom Homes",
    county: "Marion",
    status: "active",
    startDate: "2026-03-12",
    contractAmount: 184_500,
    changeOrders: [
      { id: "co1", description: "Upgraded lintel block at lanai", amount: 4_800, date: "2026-04-02" },
      { id: "co2", description: "Add bond beam for storm rating", amount: 6_200, date: "2026-05-10" },
    ],
    labor: [
      { id: "l1", worker: "Marcus Hill", role: "Foreman", hours: 168, rate: 48 },
      { id: "l2", worker: "Devon Ruiz", role: "Mason", hours: 220, rate: 36 },
      { id: "l3", worker: "Antonio Vega", role: "Mason", hours: 210, rate: 34 },
      { id: "l4", worker: "James Pratt", role: "Laborer", hours: 195, rate: 24 },
      { id: "l5", worker: "Caleb Stone", role: "Laborer", hours: 180, rate: 22 },
    ],
    materials: [
      { id: "m1", item: "8\" CMU block", qty: 2_400, unit: "ea", unitCost: 2.85 },
      { id: "m2", item: "Concrete (3000 PSI)", qty: 64, unit: "yd³", unitCost: 168 },
      { id: "m3", item: "#5 rebar 20'", qty: 180, unit: "ea", unitCost: 14.5 },
      { id: "m4", item: "Mortar mix", qty: 220, unit: "bag", unitCost: 8.25 },
      { id: "m5", item: "Vapor barrier 10 mil", qty: 2, unit: "roll", unitCost: 145 },
    ],
    subs: [
      { id: "s1", vendor: "Coastal Plumbing Co.", trade: "Plumbing", amount: 8_400 },
      { id: "s2", vendor: "BrightSpark Electric", trade: "Electrical", amount: 6_900 },
      { id: "s3", vendor: "TrueLine Concrete Pump", trade: "Concrete", amount: 3_200 },
    ],
    equipment: [
      { id: "e1", machine: "CAT 305 Mini Excavator", category: "Excavator", days: 4, dayRate: 425 },
      { id: "e2", machine: "Bobcat S650", category: "Skid Steer", days: 6, dayRate: 285 },
      { id: "e3", machine: "Mack Dump Truck", category: "Dump Truck", days: 3, dayRate: 540 },
    ],
  },
  {
    id: "j-102",
    name: "Citrus Springs Duplex — Full Shell",
    client: "Greenline Developers",
    county: "Citrus",
    status: "active",
    startDate: "2026-04-05",
    contractAmount: 312_000,
    changeOrders: [
      { id: "co1", description: "Owner-requested footer redesign", amount: 11_400, date: "2026-04-22" },
    ],
    labor: [
      { id: "l1", worker: "Marcus Hill", role: "Foreman", hours: 210, rate: 48 },
      { id: "l2", worker: "Devon Ruiz", role: "Mason", hours: 280, rate: 36 },
      { id: "l3", worker: "Reggie Daniels", role: "Mason", hours: 265, rate: 34 },
      { id: "l4", worker: "Tomas Aguilar", role: "Laborer", hours: 240, rate: 24 },
      { id: "l5", worker: "Jay Whitaker", role: "Laborer", hours: 230, rate: 22 },
      { id: "l6", worker: "Sean O'Neal", role: "Carpenter", hours: 160, rate: 38 },
    ],
    materials: [
      { id: "m1", item: "8\" CMU block", qty: 4_100, unit: "ea", unitCost: 2.85 },
      { id: "m2", item: "Concrete (3000 PSI)", qty: 112, unit: "yd³", unitCost: 168 },
      { id: "m3", item: "#5 rebar 20'", qty: 320, unit: "ea", unitCost: 14.5 },
      { id: "m4", item: "Trusses (engineered set)", qty: 1, unit: "set", unitCost: 18_400 },
      { id: "m5", item: "Mortar mix", qty: 380, unit: "bag", unitCost: 8.25 },
    ],
    subs: [
      { id: "s1", vendor: "Coastal Plumbing Co.", trade: "Plumbing", amount: 14_800 },
      { id: "s2", vendor: "BrightSpark Electric", trade: "Electrical", amount: 12_600 },
      { id: "s3", vendor: "Apex Roofing", trade: "Roofing", amount: 22_500 },
      { id: "s4", vendor: "TrueLine Concrete Pump", trade: "Concrete", amount: 5_600 },
    ],
    equipment: [
      { id: "e1", machine: "CAT 305 Mini Excavator", category: "Excavator", days: 7, dayRate: 425 },
      { id: "e2", machine: "Bobcat S650", category: "Skid Steer", days: 10, dayRate: 285 },
      { id: "e3", machine: "Mack Dump Truck", category: "Dump Truck", days: 5, dayRate: 540 },
      { id: "e4", machine: "JLG 40' Boom Lift", category: "Lift", days: 4, dayRate: 380 },
    ],
  },
  {
    id: "j-103",
    name: "Lakeside Pad Pour — Commercial Slab",
    client: "Polk Industrial Partners",
    county: "Polk",
    status: "closed",
    startDate: "2026-01-18",
    closedDate: "2026-02-28",
    contractAmount: 96_400,
    changeOrders: [],
    labor: [
      { id: "l1", worker: "Marcus Hill", role: "Foreman", hours: 88, rate: 48 },
      { id: "l2", worker: "Devon Ruiz", role: "Mason", hours: 120, rate: 36 },
      { id: "l3", worker: "James Pratt", role: "Laborer", hours: 110, rate: 24 },
    ],
    materials: [
      { id: "m1", item: "Concrete (4000 PSI)", qty: 96, unit: "yd³", unitCost: 182 },
      { id: "m2", item: "#5 rebar 20'", qty: 220, unit: "ea", unitCost: 14.5 },
      { id: "m3", item: "Wire mesh 5x10", qty: 40, unit: "sheet", unitCost: 22 },
    ],
    subs: [
      { id: "s1", vendor: "TrueLine Concrete Pump", trade: "Concrete", amount: 4_400 },
    ],
    equipment: [
      { id: "e1", machine: "Bobcat S650", category: "Skid Steer", days: 5, dayRate: 285 },
      { id: "e2", machine: "Mack Dump Truck", category: "Dump Truck", days: 2, dayRate: 540 },
    ],
  },
  {
    id: "j-104",
    name: "Hernando Bay Tear-Out & Re-Pour",
    client: "Bay Coast Restorations",
    county: "Hernando",
    status: "active",
    startDate: "2026-05-02",
    contractAmount: 58_900,
    changeOrders: [
      { id: "co1", description: "Hidden rebar corrosion remediation", amount: 7_800, date: "2026-05-18" },
    ],
    labor: [
      { id: "l1", worker: "Reggie Daniels", role: "Mason", hours: 140, rate: 34 },
      { id: "l2", worker: "Caleb Stone", role: "Laborer", hours: 135, rate: 22 },
      { id: "l3", worker: "Tomas Aguilar", role: "Laborer", hours: 130, rate: 24 },
    ],
    materials: [
      { id: "m1", item: "Concrete (3500 PSI)", qty: 38, unit: "yd³", unitCost: 175 },
      { id: "m2", item: "#5 rebar 20'", qty: 95, unit: "ea", unitCost: 14.5 },
      { id: "m3", item: "Demolition disposal", qty: 6, unit: "load", unitCost: 380 },
    ],
    subs: [
      { id: "s1", vendor: "TrueLine Concrete Pump", trade: "Concrete", amount: 2_800 },
    ],
    equipment: [
      { id: "e1", machine: "CAT 305 Mini Excavator", category: "Excavator", days: 5, dayRate: 425 },
      { id: "e2", machine: "Mack Dump Truck", category: "Dump Truck", days: 4, dayRate: 540 },
    ],
  },
];

export const OVERHEAD: OverheadLine[] = [
  { id: "o1", category: "Office rent", amount: 3_200, period: "2026-03" },
  { id: "o2", category: "Insurance (GL + WC)", amount: 6_400, period: "2026-03" },
  { id: "o3", category: "Vehicles & fuel", amount: 4_800, period: "2026-03" },
  { id: "o4", category: "Software & admin", amount: 1_650, period: "2026-03" },
  { id: "o5", category: "Office rent", amount: 3_200, period: "2026-04" },
  { id: "o6", category: "Insurance (GL + WC)", amount: 6_400, period: "2026-04" },
  { id: "o7", category: "Vehicles & fuel", amount: 5_100, period: "2026-04" },
  { id: "o8", category: "Software & admin", amount: 1_650, period: "2026-04" },
  { id: "o9", category: "Office rent", amount: 3_200, period: "2026-05" },
  { id: "o10", category: "Insurance (GL + WC)", amount: 6_400, period: "2026-05" },
  { id: "o11", category: "Vehicles & fuel", amount: 5_400, period: "2026-05" },
  { id: "o12", category: "Software & admin", amount: 1_650, period: "2026-05" },
];

export const OWNER_DRAWS: OwnerDraw[] = [
  { id: "d1", owner: "D. Dunlap", amount: 12_000, period: "2026-03" },
  { id: "d2", owner: "D. Dunlap", amount: 12_000, period: "2026-04" },
  { id: "d3", owner: "D. Dunlap", amount: 14_000, period: "2026-05" },
];

export function getJob(id: string): Job | undefined {
  return JOBS.find((j) => j.id === id);
}
