-- Add INSERT/UPDATE/DELETE policies for authenticated users on all 8 dashboard tables.
-- Keep existing SELECT policies as-is.

CREATE POLICY "auth write jobs" ON public.jobs FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "auth update jobs" ON public.jobs FOR UPDATE TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "auth delete jobs" ON public.jobs FOR DELETE TO authenticated USING (true);

CREATE POLICY "auth write cos" ON public.change_orders FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "auth update cos" ON public.change_orders FOR UPDATE TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "auth delete cos" ON public.change_orders FOR DELETE TO authenticated USING (true);

CREATE POLICY "auth write labor" ON public.labor_lines FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "auth update labor" ON public.labor_lines FOR UPDATE TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "auth delete labor" ON public.labor_lines FOR DELETE TO authenticated USING (true);

CREATE POLICY "auth write materials" ON public.material_lines FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "auth update materials" ON public.material_lines FOR UPDATE TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "auth delete materials" ON public.material_lines FOR DELETE TO authenticated USING (true);

CREATE POLICY "auth write subs" ON public.sub_lines FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "auth update subs" ON public.sub_lines FOR UPDATE TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "auth delete subs" ON public.sub_lines FOR DELETE TO authenticated USING (true);

CREATE POLICY "auth write equipment" ON public.equipment_lines FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "auth update equipment" ON public.equipment_lines FOR UPDATE TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "auth delete equipment" ON public.equipment_lines FOR DELETE TO authenticated USING (true);

CREATE POLICY "auth write overhead" ON public.overhead FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "auth update overhead" ON public.overhead FOR UPDATE TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "auth delete overhead" ON public.overhead FOR DELETE TO authenticated USING (true);

CREATE POLICY "auth write draws" ON public.owner_draws FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "auth update draws" ON public.owner_draws FOR UPDATE TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "auth delete draws" ON public.owner_draws FOR DELETE TO authenticated USING (true);