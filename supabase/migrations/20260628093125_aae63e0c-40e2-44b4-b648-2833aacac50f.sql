
-- Enums
CREATE TYPE public.job_status AS ENUM ('active','closed');
CREATE TYPE public.sub_trade AS ENUM ('Electrical','Plumbing','Concrete','HVAC','Roofing','Framing','Other');
CREATE TYPE public.equipment_category AS ENUM ('Excavator','Skid Steer','Dump Truck','Concrete Pump','Lift','Other');

-- Jobs
CREATE TABLE public.jobs (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  client TEXT NOT NULL,
  county TEXT NOT NULL,
  status public.job_status NOT NULL DEFAULT 'active',
  start_date DATE NOT NULL,
  closed_date DATE,
  contract_amount NUMERIC(14,2) NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT ON public.jobs TO authenticated;
GRANT ALL ON public.jobs TO service_role;
ALTER TABLE public.jobs ENABLE ROW LEVEL SECURITY;
CREATE POLICY "auth read jobs" ON public.jobs FOR SELECT TO authenticated USING (true);

-- Change orders
CREATE TABLE public.change_orders (
  id TEXT PRIMARY KEY,
  job_id TEXT NOT NULL REFERENCES public.jobs(id) ON DELETE CASCADE,
  description TEXT NOT NULL,
  amount NUMERIC(14,2) NOT NULL,
  date DATE NOT NULL
);
GRANT SELECT ON public.change_orders TO authenticated;
GRANT ALL ON public.change_orders TO service_role;
ALTER TABLE public.change_orders ENABLE ROW LEVEL SECURITY;
CREATE POLICY "auth read cos" ON public.change_orders FOR SELECT TO authenticated USING (true);

-- Labor
CREATE TABLE public.labor_lines (
  id TEXT PRIMARY KEY,
  job_id TEXT NOT NULL REFERENCES public.jobs(id) ON DELETE CASCADE,
  worker TEXT NOT NULL,
  role TEXT NOT NULL,
  hours NUMERIC(10,2) NOT NULL,
  rate NUMERIC(10,2) NOT NULL
);
GRANT SELECT ON public.labor_lines TO authenticated;
GRANT ALL ON public.labor_lines TO service_role;
ALTER TABLE public.labor_lines ENABLE ROW LEVEL SECURITY;
CREATE POLICY "auth read labor" ON public.labor_lines FOR SELECT TO authenticated USING (true);

-- Materials
CREATE TABLE public.material_lines (
  id TEXT PRIMARY KEY,
  job_id TEXT NOT NULL REFERENCES public.jobs(id) ON DELETE CASCADE,
  item TEXT NOT NULL,
  qty NUMERIC(12,3) NOT NULL,
  unit TEXT NOT NULL,
  unit_cost NUMERIC(12,4) NOT NULL
);
GRANT SELECT ON public.material_lines TO authenticated;
GRANT ALL ON public.material_lines TO service_role;
ALTER TABLE public.material_lines ENABLE ROW LEVEL SECURITY;
CREATE POLICY "auth read materials" ON public.material_lines FOR SELECT TO authenticated USING (true);

-- Subs
CREATE TABLE public.sub_lines (
  id TEXT PRIMARY KEY,
  job_id TEXT NOT NULL REFERENCES public.jobs(id) ON DELETE CASCADE,
  vendor TEXT NOT NULL,
  trade public.sub_trade NOT NULL,
  amount NUMERIC(14,2) NOT NULL
);
GRANT SELECT ON public.sub_lines TO authenticated;
GRANT ALL ON public.sub_lines TO service_role;
ALTER TABLE public.sub_lines ENABLE ROW LEVEL SECURITY;
CREATE POLICY "auth read subs" ON public.sub_lines FOR SELECT TO authenticated USING (true);

-- Equipment
CREATE TABLE public.equipment_lines (
  id TEXT PRIMARY KEY,
  job_id TEXT NOT NULL REFERENCES public.jobs(id) ON DELETE CASCADE,
  machine TEXT NOT NULL,
  category public.equipment_category NOT NULL,
  days NUMERIC(8,2) NOT NULL,
  day_rate NUMERIC(12,2) NOT NULL
);
GRANT SELECT ON public.equipment_lines TO authenticated;
GRANT ALL ON public.equipment_lines TO service_role;
ALTER TABLE public.equipment_lines ENABLE ROW LEVEL SECURITY;
CREATE POLICY "auth read equipment" ON public.equipment_lines FOR SELECT TO authenticated USING (true);

-- Overhead
CREATE TABLE public.overhead (
  id TEXT PRIMARY KEY,
  category TEXT NOT NULL,
  amount NUMERIC(14,2) NOT NULL,
  period TEXT NOT NULL CHECK (period ~ '^\d{4}-\d{2}$')
);
GRANT SELECT ON public.overhead TO authenticated;
GRANT ALL ON public.overhead TO service_role;
ALTER TABLE public.overhead ENABLE ROW LEVEL SECURITY;
CREATE POLICY "auth read overhead" ON public.overhead FOR SELECT TO authenticated USING (true);

-- Owner draws
CREATE TABLE public.owner_draws (
  id TEXT PRIMARY KEY,
  owner TEXT NOT NULL,
  amount NUMERIC(14,2) NOT NULL,
  period TEXT NOT NULL CHECK (period ~ '^\d{4}-\d{2}$')
);
GRANT SELECT ON public.owner_draws TO authenticated;
GRANT ALL ON public.owner_draws TO service_role;
ALTER TABLE public.owner_draws ENABLE ROW LEVEL SECURITY;
CREATE POLICY "auth read draws" ON public.owner_draws FOR SELECT TO authenticated USING (true);

-- Helpful indexes
CREATE INDEX ON public.change_orders(job_id);
CREATE INDEX ON public.labor_lines(job_id);
CREATE INDEX ON public.material_lines(job_id);
CREATE INDEX ON public.sub_lines(job_id);
CREATE INDEX ON public.equipment_lines(job_id);
