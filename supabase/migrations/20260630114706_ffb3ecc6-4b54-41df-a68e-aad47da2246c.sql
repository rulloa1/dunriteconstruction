-- ==== sopdunrite full schema ====
CREATE TYPE public.app_role AS ENUM ('admin', 'executive', 'project_manager', 'viewer');
CREATE TYPE public.project_status AS ENUM ('bid_pre_contract', 'bid_under_contract', 'active', 'complete');

CREATE TABLE public.profiles (
  id UUID NOT NULL PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT, title TEXT, email TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.profiles TO authenticated;
GRANT ALL ON public.profiles TO service_role;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE TABLE public.user_roles (
  id UUID NOT NULL PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role public.app_role NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (user_id, role)
);
GRANT SELECT ON public.user_roles TO authenticated;
GRANT ALL ON public.user_roles TO service_role;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role public.app_role)
RETURNS BOOLEAN LANGUAGE SQL STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = _user_id AND role = _role)
$$;
REVOKE EXECUTE ON FUNCTION public.has_role(uuid, public.app_role) FROM anon, public;
GRANT EXECUTE ON FUNCTION public.has_role(uuid, public.app_role) TO authenticated;

CREATE TABLE public.projects (
  id UUID NOT NULL PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL, client TEXT, location TEXT,
  value NUMERIC(14,2) NOT NULL DEFAULT 0,
  status public.project_status NOT NULL DEFAULT 'bid_pre_contract',
  assigned_to UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  bid_due_date DATE, start_date DATE, notes TEXT,
  contract_completion DATE, current_completion DATE,
  created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.projects TO authenticated;
GRANT ALL ON public.projects TO service_role;
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated view profiles" ON public.profiles FOR SELECT TO authenticated USING (true);
CREATE POLICY "Users update own profile" ON public.profiles FOR UPDATE TO authenticated USING (auth.uid() = id) WITH CHECK (auth.uid() = id);
CREATE POLICY "Admins update any profile" ON public.profiles FOR UPDATE TO authenticated USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Users view own roles" ON public.user_roles FOR SELECT TO authenticated USING (auth.uid() = user_id OR public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins manage roles" ON public.user_roles FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Authenticated view projects" ON public.projects FOR SELECT TO authenticated USING (true);
CREATE POLICY "Managers insert projects" ON public.projects FOR INSERT TO authenticated WITH CHECK (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'executive') OR (public.has_role(auth.uid(), 'project_manager') AND assigned_to = auth.uid()));
CREATE POLICY "Managers update projects" ON public.projects FOR UPDATE TO authenticated USING (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'executive') OR (public.has_role(auth.uid(), 'project_manager') AND assigned_to = auth.uid())) WITH CHECK (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'executive') OR (public.has_role(auth.uid(), 'project_manager') AND assigned_to = auth.uid()));
CREATE POLICY "Admins delete projects" ON public.projects FOR DELETE TO authenticated USING (public.has_role(auth.uid(), 'admin'));

CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER LANGUAGE plpgsql SET search_path = public AS $$
BEGIN NEW.updated_at = now(); RETURN NEW; END; $$;
REVOKE EXECUTE ON FUNCTION public.update_updated_at_column() FROM anon, public;
CREATE TRIGGER set_profiles_updated_at BEFORE UPDATE ON public.profiles FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER set_projects_updated_at BEFORE UPDATE ON public.projects FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Project documents
CREATE TABLE public.project_documents (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  project_id uuid NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
  name text NOT NULL, file_path text NOT NULL,
  content_type text, file_size bigint, uploaded_by uuid,
  extracted_text text, extraction_status text NOT NULL DEFAULT 'pending',
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX idx_project_documents_project_id ON public.project_documents(project_id);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.project_documents TO authenticated;
GRANT ALL ON public.project_documents TO service_role;
ALTER TABLE public.project_documents ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Authenticated view project documents" ON public.project_documents FOR SELECT TO authenticated USING (true);
CREATE POLICY "Managers insert project documents" ON public.project_documents FOR INSERT TO authenticated WITH CHECK (uploaded_by = auth.uid() AND (has_role(auth.uid(), 'admin'::app_role) OR has_role(auth.uid(), 'executive'::app_role) OR has_role(auth.uid(), 'project_manager'::app_role)));
CREATE POLICY "Admin or uploader delete project documents" ON public.project_documents FOR DELETE TO authenticated USING (has_role(auth.uid(), 'admin'::app_role) OR uploaded_by = auth.uid());

-- Per-project logs
CREATE TABLE public.bid_logs (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  project_id uuid NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
  bid_number text, status text, contractor text,
  bid_amount numeric(14,2), bid_date date, description text, notes text,
  created_by uuid DEFAULT auth.uid() REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
CREATE TABLE public.rfi_logs (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  project_id uuid NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
  rfi_number text, description text, issue_date date, date_required date, date_received date,
  cost_impact numeric(14,2), closed boolean NOT NULL DEFAULT false, notes text,
  created_by uuid DEFAULT auth.uid() REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at timestamptz NOT NULL DEFAULT now(), updated_at timestamptz NOT NULL DEFAULT now()
);
CREATE TABLE public.submittal_logs (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  project_id uuid NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
  submittal_number text, description text, issue_date date, date_required date, date_received date,
  closed boolean NOT NULL DEFAULT false, notes text,
  created_by uuid DEFAULT auth.uid() REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at timestamptz NOT NULL DEFAULT now(), updated_at timestamptz NOT NULL DEFAULT now()
);
CREATE TABLE public.purchasing_logs (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  project_id uuid NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
  cost_code text, description text, original_budget numeric(14,2),
  contractor text, contract_amount numeric(14,2), vendor text, material_amount numeric(14,2),
  po_number text, noci numeric(14,2), contract_issued date, notes text,
  created_by uuid DEFAULT auth.uid() REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at timestamptz NOT NULL DEFAULT now(), updated_at timestamptz NOT NULL DEFAULT now()
);
CREATE TABLE public.po_logs (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  project_id uuid NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
  po_number text, vendor text, description text, amount numeric(14,2),
  po_date date, delivery_date date, status text NOT NULL DEFAULT 'issued', notes text,
  created_by uuid DEFAULT auth.uid() REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at timestamptz NOT NULL DEFAULT now(), updated_at timestamptz NOT NULL DEFAULT now()
);
CREATE TABLE public.schedule_delays (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  project_id uuid NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
  delay_description text, original_date date, revised_date date, days_delayed integer,
  reason text, impact text, notes text,
  created_by uuid DEFAULT auth.uid() REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at timestamptz NOT NULL DEFAULT now(), updated_at timestamptz NOT NULL DEFAULT now()
);
CREATE TABLE public.project_milestones (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  project_id uuid NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
  name text NOT NULL, scheduled date, actual date,
  status text NOT NULL DEFAULT 'upcoming', sort_order integer NOT NULL DEFAULT 0, notes text,
  created_by uuid DEFAULT auth.uid() REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at timestamptz NOT NULL DEFAULT now(), updated_at timestamptz NOT NULL DEFAULT now()
);
CREATE TABLE public.procurement_items (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  project_id uuid NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
  item text NOT NULL, committed boolean NOT NULL DEFAULT false, purchased boolean NOT NULL DEFAULT false,
  vendor text, po_number text, expected_delivery text,
  status text NOT NULL DEFAULT 'not-started', sort_order integer NOT NULL DEFAULT 0, notes text,
  created_by uuid DEFAULT auth.uid() REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at timestamptz NOT NULL DEFAULT now(), updated_at timestamptz NOT NULL DEFAULT now()
);

-- Uniform grants, RLS, indexes, triggers for all per-project log tables
DO $$
DECLARE
  t text;
  tables text[] := ARRAY['bid_logs','rfi_logs','submittal_logs','purchasing_logs','po_logs','schedule_delays','project_milestones','procurement_items'];
BEGIN
  FOREACH t IN ARRAY tables LOOP
    EXECUTE format('GRANT SELECT, INSERT, UPDATE, DELETE ON public.%I TO authenticated;', t);
    EXECUTE format('GRANT ALL ON public.%I TO service_role;', t);
    EXECUTE format('ALTER TABLE public.%I ENABLE ROW LEVEL SECURITY;', t);
    EXECUTE format('CREATE INDEX idx_%1$s_project_id ON public.%1$I(project_id);', t);
    EXECUTE format($q$CREATE POLICY "Authenticated view %1$s" ON public.%1$I FOR SELECT TO authenticated USING (true);$q$, t);
    EXECUTE format($q$CREATE POLICY "Managers insert %1$s" ON public.%1$I FOR INSERT TO authenticated WITH CHECK (created_by = auth.uid() AND (has_role(auth.uid(), 'admin'::app_role) OR has_role(auth.uid(), 'executive'::app_role) OR has_role(auth.uid(), 'project_manager'::app_role)));$q$, t);
    EXECUTE format($q$CREATE POLICY "Managers update %1$s" ON public.%1$I FOR UPDATE TO authenticated USING (has_role(auth.uid(), 'admin'::app_role) OR has_role(auth.uid(), 'executive'::app_role) OR has_role(auth.uid(), 'project_manager'::app_role)) WITH CHECK (has_role(auth.uid(), 'admin'::app_role) OR has_role(auth.uid(), 'executive'::app_role) OR has_role(auth.uid(), 'project_manager'::app_role));$q$, t);
    EXECUTE format($q$CREATE POLICY "Admins delete %1$s" ON public.%1$I FOR DELETE TO authenticated USING (has_role(auth.uid(), 'admin'::app_role));$q$, t);
    EXECUTE format('CREATE TRIGGER set_%1$s_updated_at BEFORE UPDATE ON public.%1$I FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();', t);
  END LOOP;
END $$;

-- Fleet / safety: owner-or-admin pattern, helper function to build consistent policies
DO $$
DECLARE
  t record;
  fleet_tables text[][] := ARRAY[
    ARRAY['vehicle_inspections','inspected_by'],
    ARRAY['incident_reports','reported_by'],
    ARRAY['hazardous_chemicals','created_by'],
    ARRAY['trailer_inspections','inspected_by'],
    ARRAY['handbook_acknowledgments','created_by'],
    ARRAY['certifications','created_by'],
    ARRAY['driver_qualifications','created_by'],
    ARRAY['maintenance_records','created_by'],
    ARRAY['toolbox_talks','created_by'],
    ARRAY['job_safety_analyses','created_by'],
    ARRAY['subcontractor_prequalifications','created_by'],
    ARRAY['osha300_log','created_by']
  ];
BEGIN
  NULL; -- structural placeholder, real CREATE TABLEs below
END $$;

-- Vehicle inspections
CREATE TABLE public.vehicle_inspections (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  vehicle text NOT NULL, inspection_date date NOT NULL DEFAULT now()::date,
  inspector_name text, odometer numeric(12,1),
  fluids_ok boolean NOT NULL DEFAULT true, guards_ok boolean NOT NULL DEFAULT true,
  controls_ok boolean NOT NULL DEFAULT true, tires_ok boolean NOT NULL DEFAULT true,
  headlights_ok boolean NOT NULL DEFAULT true, running_lights_ok boolean NOT NULL DEFAULT true,
  brake_lights_ok boolean NOT NULL DEFAULT true, blinkers_ok boolean NOT NULL DEFAULT true,
  clearance_lights_ok boolean NOT NULL DEFAULT true,
  status text NOT NULL DEFAULT 'pass', defects text,
  inspected_by uuid DEFAULT auth.uid() REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at timestamptz NOT NULL DEFAULT now(), updated_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX idx_vehicle_inspections_date ON public.vehicle_inspections(inspection_date DESC);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.vehicle_inspections TO authenticated;
GRANT ALL ON public.vehicle_inspections TO service_role;
ALTER TABLE public.vehicle_inspections ENABLE ROW LEVEL SECURITY;
CREATE POLICY "View vehicle inspections" ON public.vehicle_inspections FOR SELECT TO authenticated USING (true);
CREATE POLICY "Insert own vehicle inspections" ON public.vehicle_inspections FOR INSERT TO authenticated WITH CHECK (inspected_by = auth.uid());
CREATE POLICY "Owner or admin update vehicle inspections" ON public.vehicle_inspections FOR UPDATE TO authenticated USING (inspected_by = auth.uid() OR has_role(auth.uid(), 'admin'::app_role)) WITH CHECK (inspected_by = auth.uid() OR has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Owner or admin delete vehicle inspections" ON public.vehicle_inspections FOR DELETE TO authenticated USING (inspected_by = auth.uid() OR has_role(auth.uid(), 'admin'::app_role));
CREATE TRIGGER set_vehicle_inspections_updated_at BEFORE UPDATE ON public.vehicle_inspections FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Incident reports
CREATE TABLE public.incident_reports (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  report_type text NOT NULL DEFAULT 'incident',
  equipment_ownership text NOT NULL DEFAULT 'owned',
  incident_date date NOT NULL DEFAULT now()::date,
  incident_time text, location text, vehicle text, people_involved text, witnesses text,
  description text NOT NULL, injuries boolean NOT NULL DEFAULT false, injury_description text,
  property_damage boolean NOT NULL DEFAULT false, damage_description text, action_taken text,
  status text NOT NULL DEFAULT 'open',
  reported_by uuid DEFAULT auth.uid() REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at timestamptz NOT NULL DEFAULT now(), updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.incident_reports TO authenticated;
GRANT ALL ON public.incident_reports TO service_role;
ALTER TABLE public.incident_reports ENABLE ROW LEVEL SECURITY;
CREATE POLICY "View incident reports" ON public.incident_reports FOR SELECT TO authenticated USING (true);
CREATE POLICY "Insert own incident reports" ON public.incident_reports FOR INSERT TO authenticated WITH CHECK (reported_by = auth.uid());
CREATE POLICY "Owner or admin update incident reports" ON public.incident_reports FOR UPDATE TO authenticated USING (reported_by = auth.uid() OR has_role(auth.uid(), 'admin'::app_role)) WITH CHECK (reported_by = auth.uid() OR has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Owner or admin delete incident reports" ON public.incident_reports FOR DELETE TO authenticated USING (reported_by = auth.uid() OR has_role(auth.uid(), 'admin'::app_role));
CREATE TRIGGER set_incident_reports_updated_at BEFORE UPDATE ON public.incident_reports FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Hazardous chemicals
CREATE TABLE public.hazardous_chemicals (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  chemical_name text NOT NULL, manufacturer text, hazard_class text,
  sds_url text, location text, quantity_on_hand text, ppe_required text,
  first_aid_summary text, notes text,
  sds_on_file boolean NOT NULL DEFAULT false, last_reviewed date,
  created_by uuid DEFAULT auth.uid() REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at timestamptz NOT NULL DEFAULT now(), updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.hazardous_chemicals TO authenticated;
GRANT ALL ON public.hazardous_chemicals TO service_role;
ALTER TABLE public.hazardous_chemicals ENABLE ROW LEVEL SECURITY;
CREATE POLICY "View chemicals" ON public.hazardous_chemicals FOR SELECT TO authenticated USING (true);
CREATE POLICY "Insert own chemicals" ON public.hazardous_chemicals FOR INSERT TO authenticated WITH CHECK (created_by = auth.uid());
CREATE POLICY "Owner or admin update chemicals" ON public.hazardous_chemicals FOR UPDATE TO authenticated USING (created_by = auth.uid() OR has_role(auth.uid(), 'admin'::app_role)) WITH CHECK (created_by = auth.uid() OR has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Owner or admin delete chemicals" ON public.hazardous_chemicals FOR DELETE TO authenticated USING (created_by = auth.uid() OR has_role(auth.uid(), 'admin'::app_role));
CREATE TRIGGER set_hazardous_chemicals_updated_at BEFORE UPDATE ON public.hazardous_chemicals FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Trailer inspections
CREATE TABLE public.trailer_inspections (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  trailer text NOT NULL, inspection_date date NOT NULL DEFAULT now()::date,
  inspector_name text,
  coupler_ok boolean NOT NULL DEFAULT true, safety_chains_ok boolean NOT NULL DEFAULT true,
  breakaway_ok boolean NOT NULL DEFAULT true, tires_ok boolean NOT NULL DEFAULT true,
  wheels_ok boolean NOT NULL DEFAULT true, lights_ok boolean NOT NULL DEFAULT true,
  brakes_ok boolean NOT NULL DEFAULT true, frame_ok boolean NOT NULL DEFAULT true,
  decking_ok boolean NOT NULL DEFAULT true, tie_downs_ok boolean NOT NULL DEFAULT true,
  status text NOT NULL DEFAULT 'pass', defects text,
  inspected_by uuid DEFAULT auth.uid() REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at timestamptz NOT NULL DEFAULT now(), updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.trailer_inspections TO authenticated;
GRANT ALL ON public.trailer_inspections TO service_role;
ALTER TABLE public.trailer_inspections ENABLE ROW LEVEL SECURITY;
CREATE POLICY "View trailer inspections" ON public.trailer_inspections FOR SELECT TO authenticated USING (true);
CREATE POLICY "Insert own trailer inspections" ON public.trailer_inspections FOR INSERT TO authenticated WITH CHECK (inspected_by = auth.uid());
CREATE POLICY "Owner or admin update trailer inspections" ON public.trailer_inspections FOR UPDATE TO authenticated USING (inspected_by = auth.uid() OR has_role(auth.uid(), 'admin'::app_role)) WITH CHECK (inspected_by = auth.uid() OR has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Owner or admin delete trailer inspections" ON public.trailer_inspections FOR DELETE TO authenticated USING (inspected_by = auth.uid() OR has_role(auth.uid(), 'admin'::app_role));
CREATE TRIGGER set_trailer_inspections_updated_at BEFORE UPDATE ON public.trailer_inspections FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Handbook acknowledgments
CREATE TABLE public.handbook_acknowledgments (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  employee_name text NOT NULL, form_type text NOT NULL,
  acknowledged_date date, supervisor text,
  signed_on_file boolean NOT NULL DEFAULT false, notes text,
  created_by uuid DEFAULT auth.uid() REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at timestamptz NOT NULL DEFAULT now(), updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.handbook_acknowledgments TO authenticated;
GRANT ALL ON public.handbook_acknowledgments TO service_role;
ALTER TABLE public.handbook_acknowledgments ENABLE ROW LEVEL SECURITY;
CREATE POLICY "View handbook ack" ON public.handbook_acknowledgments FOR SELECT TO authenticated USING (true);
CREATE POLICY "Insert own handbook ack" ON public.handbook_acknowledgments FOR INSERT TO authenticated WITH CHECK (created_by = auth.uid());
CREATE POLICY "Owner or admin update handbook ack" ON public.handbook_acknowledgments FOR UPDATE TO authenticated USING (created_by = auth.uid() OR has_role(auth.uid(), 'admin'::app_role)) WITH CHECK (created_by = auth.uid() OR has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Owner or admin delete handbook ack" ON public.handbook_acknowledgments FOR DELETE TO authenticated USING (created_by = auth.uid() OR has_role(auth.uid(), 'admin'::app_role));
CREATE TRIGGER set_handbook_ack_updated_at BEFORE UPDATE ON public.handbook_acknowledgments FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Certifications
CREATE TABLE public.certifications (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  employee_name text NOT NULL, certification_type text NOT NULL,
  issuing_body text, certification_number text,
  issue_date date, expiration_date date,
  status text NOT NULL DEFAULT 'active', notes text,
  created_by uuid DEFAULT auth.uid() REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at timestamptz NOT NULL DEFAULT now(), updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.certifications TO authenticated;
GRANT ALL ON public.certifications TO service_role;
ALTER TABLE public.certifications ENABLE ROW LEVEL SECURITY;
CREATE POLICY "View certifications" ON public.certifications FOR SELECT TO authenticated USING (true);
CREATE POLICY "Insert own certifications" ON public.certifications FOR INSERT TO authenticated WITH CHECK (created_by = auth.uid());
CREATE POLICY "Owner or admin update certifications" ON public.certifications FOR UPDATE TO authenticated USING (created_by = auth.uid() OR has_role(auth.uid(), 'admin'::app_role)) WITH CHECK (created_by = auth.uid() OR has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Owner or admin delete certifications" ON public.certifications FOR DELETE TO authenticated USING (created_by = auth.uid() OR has_role(auth.uid(), 'admin'::app_role));
CREATE TRIGGER set_certifications_updated_at BEFORE UPDATE ON public.certifications FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Driver qualifications
CREATE TABLE public.driver_qualifications (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  driver_name text NOT NULL, license_number text, license_class text, license_state text,
  license_expiration date, medical_card_expiration date, mvr_date date,
  drug_test_date date, status text NOT NULL DEFAULT 'qualified', notes text,
  created_by uuid DEFAULT auth.uid() REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at timestamptz NOT NULL DEFAULT now(), updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.driver_qualifications TO authenticated;
GRANT ALL ON public.driver_qualifications TO service_role;
ALTER TABLE public.driver_qualifications ENABLE ROW LEVEL SECURITY;
CREATE POLICY "View driver qualifications" ON public.driver_qualifications FOR SELECT TO authenticated USING (true);
CREATE POLICY "Insert own driver qualifications" ON public.driver_qualifications FOR INSERT TO authenticated WITH CHECK (created_by = auth.uid());
CREATE POLICY "Owner or admin update driver qualifications" ON public.driver_qualifications FOR UPDATE TO authenticated USING (created_by = auth.uid() OR has_role(auth.uid(), 'admin'::app_role)) WITH CHECK (created_by = auth.uid() OR has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Owner or admin delete driver qualifications" ON public.driver_qualifications FOR DELETE TO authenticated USING (created_by = auth.uid() OR has_role(auth.uid(), 'admin'::app_role));
CREATE TRIGGER set_driver_qualifications_updated_at BEFORE UPDATE ON public.driver_qualifications FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Maintenance records
CREATE TABLE public.maintenance_records (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  asset text NOT NULL, service_type text, service_date date NOT NULL DEFAULT now()::date,
  performed_by text, odometer_hours numeric(12,1), cost numeric(12,2),
  next_service_due date, next_service_odometer numeric(12,1),
  status text NOT NULL DEFAULT 'completed', notes text,
  created_by uuid DEFAULT auth.uid() REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at timestamptz NOT NULL DEFAULT now(), updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.maintenance_records TO authenticated;
GRANT ALL ON public.maintenance_records TO service_role;
ALTER TABLE public.maintenance_records ENABLE ROW LEVEL SECURITY;
CREATE POLICY "View maintenance" ON public.maintenance_records FOR SELECT TO authenticated USING (true);
CREATE POLICY "Insert own maintenance" ON public.maintenance_records FOR INSERT TO authenticated WITH CHECK (created_by = auth.uid());
CREATE POLICY "Owner or admin update maintenance" ON public.maintenance_records FOR UPDATE TO authenticated USING (created_by = auth.uid() OR has_role(auth.uid(), 'admin'::app_role)) WITH CHECK (created_by = auth.uid() OR has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Owner or admin delete maintenance" ON public.maintenance_records FOR DELETE TO authenticated USING (created_by = auth.uid() OR has_role(auth.uid(), 'admin'::app_role));
CREATE TRIGGER set_maintenance_records_updated_at BEFORE UPDATE ON public.maintenance_records FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Toolbox talks
CREATE TABLE public.toolbox_talks (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  topic text NOT NULL, talk_date date NOT NULL DEFAULT now()::date,
  presenter text, location text, attendees text, key_points text, notes text,
  created_by uuid DEFAULT auth.uid() REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at timestamptz NOT NULL DEFAULT now(), updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.toolbox_talks TO authenticated;
GRANT ALL ON public.toolbox_talks TO service_role;
ALTER TABLE public.toolbox_talks ENABLE ROW LEVEL SECURITY;
CREATE POLICY "View toolbox talks" ON public.toolbox_talks FOR SELECT TO authenticated USING (true);
CREATE POLICY "Insert own toolbox talks" ON public.toolbox_talks FOR INSERT TO authenticated WITH CHECK (created_by = auth.uid());
CREATE POLICY "Owner or admin update toolbox talks" ON public.toolbox_talks FOR UPDATE TO authenticated USING (created_by = auth.uid() OR has_role(auth.uid(), 'admin'::app_role)) WITH CHECK (created_by = auth.uid() OR has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Owner or admin delete toolbox talks" ON public.toolbox_talks FOR DELETE TO authenticated USING (created_by = auth.uid() OR has_role(auth.uid(), 'admin'::app_role));
CREATE TRIGGER set_toolbox_talks_updated_at BEFORE UPDATE ON public.toolbox_talks FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Job safety analyses (JSA)
CREATE TABLE public.job_safety_analyses (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  job_task text NOT NULL, analysis_date date NOT NULL DEFAULT now()::date,
  location text, supervisor text, crew text,
  hazards text, controls text, ppe_required text, notes text,
  created_by uuid DEFAULT auth.uid() REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at timestamptz NOT NULL DEFAULT now(), updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.job_safety_analyses TO authenticated;
GRANT ALL ON public.job_safety_analyses TO service_role;
ALTER TABLE public.job_safety_analyses ENABLE ROW LEVEL SECURITY;
CREATE POLICY "View JSA" ON public.job_safety_analyses FOR SELECT TO authenticated USING (true);
CREATE POLICY "Insert own JSA" ON public.job_safety_analyses FOR INSERT TO authenticated WITH CHECK (created_by = auth.uid());
CREATE POLICY "Owner or admin update JSA" ON public.job_safety_analyses FOR UPDATE TO authenticated USING (created_by = auth.uid() OR has_role(auth.uid(), 'admin'::app_role)) WITH CHECK (created_by = auth.uid() OR has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Owner or admin delete JSA" ON public.job_safety_analyses FOR DELETE TO authenticated USING (created_by = auth.uid() OR has_role(auth.uid(), 'admin'::app_role));
CREATE TRIGGER set_jsa_updated_at BEFORE UPDATE ON public.job_safety_analyses FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Subcontractor prequalifications
CREATE TABLE public.subcontractor_prequalifications (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  subcontractor_name text NOT NULL, trade text, contact_name text, contact_email text, contact_phone text,
  insurance_on_file boolean NOT NULL DEFAULT false, insurance_expiration date,
  w9_on_file boolean NOT NULL DEFAULT false, license_number text, license_expiration date,
  safety_rating text, status text NOT NULL DEFAULT 'pending', notes text,
  created_by uuid DEFAULT auth.uid() REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at timestamptz NOT NULL DEFAULT now(), updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.subcontractor_prequalifications TO authenticated;
GRANT ALL ON public.subcontractor_prequalifications TO service_role;
ALTER TABLE public.subcontractor_prequalifications ENABLE ROW LEVEL SECURITY;
CREATE POLICY "View sub prequals" ON public.subcontractor_prequalifications FOR SELECT TO authenticated USING (true);
CREATE POLICY "Insert own sub prequals" ON public.subcontractor_prequalifications FOR INSERT TO authenticated WITH CHECK (created_by = auth.uid());
CREATE POLICY "Owner or admin update sub prequals" ON public.subcontractor_prequalifications FOR UPDATE TO authenticated USING (created_by = auth.uid() OR has_role(auth.uid(), 'admin'::app_role)) WITH CHECK (created_by = auth.uid() OR has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Owner or admin delete sub prequals" ON public.subcontractor_prequalifications FOR DELETE TO authenticated USING (created_by = auth.uid() OR has_role(auth.uid(), 'admin'::app_role));
CREATE TRIGGER set_sub_prequals_updated_at BEFORE UPDATE ON public.subcontractor_prequalifications FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- OSHA 300 log
CREATE TABLE public.osha300_log (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  case_number text, employee_name text NOT NULL, job_title text,
  incident_date date, where_event_occurred text, description text,
  classification text, days_away_from_work integer NOT NULL DEFAULT 0,
  days_restricted_or_transferred integer NOT NULL DEFAULT 0,
  injury_type text, calendar_year integer, notes text,
  created_by uuid DEFAULT auth.uid() REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at timestamptz NOT NULL DEFAULT now(), updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.osha300_log TO authenticated;
GRANT ALL ON public.osha300_log TO service_role;
ALTER TABLE public.osha300_log ENABLE ROW LEVEL SECURITY;
CREATE POLICY "View osha300" ON public.osha300_log FOR SELECT TO authenticated USING (true);
CREATE POLICY "Insert own osha300" ON public.osha300_log FOR INSERT TO authenticated WITH CHECK (created_by = auth.uid());
CREATE POLICY "Owner or admin update osha300" ON public.osha300_log FOR UPDATE TO authenticated USING (created_by = auth.uid() OR has_role(auth.uid(), 'admin'::app_role)) WITH CHECK (created_by = auth.uid() OR has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Owner or admin delete osha300" ON public.osha300_log FOR DELETE TO authenticated USING (created_by = auth.uid() OR has_role(auth.uid(), 'admin'::app_role));
CREATE TRIGGER set_osha300_updated_at BEFORE UPDATE ON public.osha300_log FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
