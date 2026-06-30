
-- 1) Move has_role out of public schema so PostgREST won't expose it as an RPC endpoint.
CREATE SCHEMA IF NOT EXISTS restricted;
GRANT USAGE ON SCHEMA restricted TO authenticated, service_role;
ALTER FUNCTION public.has_role(uuid, public.app_role) SET SCHEMA restricted;
-- Ensure execute remains for policy evaluation
GRANT EXECUTE ON FUNCTION restricted.has_role(uuid, public.app_role) TO authenticated, service_role;
REVOKE EXECUTE ON FUNCTION restricted.has_role(uuid, public.app_role) FROM PUBLIC, anon;

-- 2) Tighten SELECT policies on sensitive tables.

-- driver_qualifications: only admin/executive
DROP POLICY IF EXISTS "View driver qualifications" ON public.driver_qualifications;
CREATE POLICY "Admins/executives view driver qualifications"
  ON public.driver_qualifications FOR SELECT TO authenticated
  USING (restricted.has_role(auth.uid(), 'admin'::public.app_role)
      OR restricted.has_role(auth.uid(), 'executive'::public.app_role)
      OR created_by = auth.uid());

-- osha300_log: only admin/executive
DROP POLICY IF EXISTS "View osha300" ON public.osha300_log;
CREATE POLICY "Admins/executives view osha300"
  ON public.osha300_log FOR SELECT TO authenticated
  USING (restricted.has_role(auth.uid(), 'admin'::public.app_role)
      OR restricted.has_role(auth.uid(), 'executive'::public.app_role)
      OR created_by = auth.uid());

-- subcontractor_prequalifications: project_manager/executive/admin
DROP POLICY IF EXISTS "View sub prequals" ON public.subcontractor_prequalifications;
CREATE POLICY "Managers view sub prequals"
  ON public.subcontractor_prequalifications FOR SELECT TO authenticated
  USING (restricted.has_role(auth.uid(), 'admin'::public.app_role)
      OR restricted.has_role(auth.uid(), 'executive'::public.app_role)
      OR restricted.has_role(auth.uid(), 'project_manager'::public.app_role)
      OR created_by = auth.uid());

-- quote_requests: admin/executive only
DROP POLICY IF EXISTS "Only authenticated can read quote requests" ON public.quote_requests;
CREATE POLICY "Admins/executives read quote requests"
  ON public.quote_requests FOR SELECT TO authenticated
  USING (restricted.has_role(auth.uid(), 'admin'::public.app_role)
      OR restricted.has_role(auth.uid(), 'executive'::public.app_role));

-- profiles: own profile or admin
DROP POLICY IF EXISTS "Authenticated view profiles" ON public.profiles;
CREATE POLICY "Users view own profile or admin views all"
  ON public.profiles FOR SELECT TO authenticated
  USING (auth.uid() = id OR restricted.has_role(auth.uid(), 'admin'::public.app_role));
