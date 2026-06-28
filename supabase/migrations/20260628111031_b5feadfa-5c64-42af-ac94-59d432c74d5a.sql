
DO $$
DECLARE
  t text;
  tables text[] := ARRAY['change_orders','equipment_lines','jobs','labor_lines','material_lines','overhead','owner_draws','sub_lines'];
  names jsonb := '{
    "change_orders":{"d":"auth delete cos","u":"auth update cos","i":"auth write cos"},
    "equipment_lines":{"d":"auth delete equipment","u":"auth update equipment","i":"auth write equipment"},
    "jobs":{"d":"auth delete jobs","u":"auth update jobs","i":"auth write jobs"},
    "labor_lines":{"d":"auth delete labor","u":"auth update labor","i":"auth write labor"},
    "material_lines":{"d":"auth delete materials","u":"auth update materials","i":"auth write materials"},
    "overhead":{"d":"auth delete overhead","u":"auth update overhead","i":"auth write overhead"},
    "owner_draws":{"d":"auth delete draws","u":"auth update draws","i":"auth write draws"},
    "sub_lines":{"d":"auth delete subs","u":"auth update subs","i":"auth write subs"}
  }';
BEGIN
  FOREACH t IN ARRAY tables LOOP
    EXECUTE format('DROP POLICY IF EXISTS %I ON public.%I', names->t->>'d', t);
    EXECUTE format('DROP POLICY IF EXISTS %I ON public.%I', names->t->>'u', t);
    EXECUTE format('DROP POLICY IF EXISTS %I ON public.%I', names->t->>'i', t);

    EXECUTE format('CREATE POLICY %I ON public.%I FOR DELETE TO authenticated USING (auth.uid() IS NOT NULL)', names->t->>'d', t);
    EXECUTE format('CREATE POLICY %I ON public.%I FOR UPDATE TO authenticated USING (auth.uid() IS NOT NULL) WITH CHECK (auth.uid() IS NOT NULL)', names->t->>'u', t);
    EXECUTE format('CREATE POLICY %I ON public.%I FOR INSERT TO authenticated WITH CHECK (auth.uid() IS NOT NULL)', names->t->>'i', t);
  END LOOP;
END $$;
