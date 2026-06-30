CREATE TABLE public.quote_requests (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  phone TEXT NOT NULL,
  email TEXT NOT NULL,
  county TEXT NOT NULL,
  project_type TEXT NOT NULL,
  message TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

GRANT INSERT ON public.quote_requests TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.quote_requests TO authenticated;
GRANT ALL ON public.quote_requests TO service_role;

ALTER TABLE public.quote_requests ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can submit a quote request"
  ON public.quote_requests
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (
    char_length(name) BETWEEN 1 AND 120
    AND char_length(phone) BETWEEN 7 AND 40
    AND char_length(email) BETWEEN 3 AND 200
    AND char_length(county) BETWEEN 1 AND 60
    AND char_length(project_type) BETWEEN 1 AND 80
    AND (message IS NULL OR char_length(message) <= 2000)
  );

CREATE POLICY "Only authenticated can read quote requests"
  ON public.quote_requests
  FOR SELECT
  TO authenticated
  USING (auth.uid() IS NOT NULL);
