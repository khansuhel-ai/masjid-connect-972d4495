
-- Fix permissive masjid INSERT policy - only allow authenticated users (reasonable for registration)
DROP POLICY "Anyone can insert masjids" ON public.masjids;
CREATE POLICY "Authenticated can insert masjids" ON public.masjids FOR INSERT TO authenticated WITH CHECK (auth.uid() IS NOT NULL);

-- Fix permissive fund_payments INSERT policy
DROP POLICY "Anyone can insert payments" ON public.fund_payments;
CREATE POLICY "Users can insert own payments" ON public.fund_payments FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
