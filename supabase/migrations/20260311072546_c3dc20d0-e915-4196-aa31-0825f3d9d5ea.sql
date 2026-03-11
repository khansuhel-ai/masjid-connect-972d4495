
-- Create role enum
CREATE TYPE public.app_role AS ENUM ('imam', 'motaballi', 'user');
CREATE TYPE public.salary_period AS ENUM ('monthly', 'quarterly', 'half_yearly', 'yearly');
CREATE TYPE public.marital_status AS ENUM ('single', 'married', 'divorced', 'widowed');
CREATE TYPE public.fund_payment_status AS ENUM ('paid', 'unpaid', 'pending');

-- Masjids table
CREATE TABLE public.masjids (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  city TEXT NOT NULL,
  address TEXT,
  profile_image_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Profiles table
CREATE TABLE public.profiles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT NOT NULL DEFAULT '',
  phone TEXT,
  whatsapp_number TEXT,
  alternate_phone TEXT,
  profile_image_url TEXT,
  city TEXT,
  masjid_id UUID REFERENCES public.masjids(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- User roles table
CREATE TABLE public.user_roles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role app_role NOT NULL,
  masjid_id UUID REFERENCES public.masjids(id),
  is_active BOOLEAN NOT NULL DEFAULT true,
  is_approved BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (user_id, role, masjid_id)
);

-- Imam details table
CREATE TABLE public.imam_details (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  masjid_id UUID REFERENCES public.masjids(id),
  islamic_degree TEXT,
  experience_years INTEGER,
  experience_details TEXT,
  aadhaar_number TEXT,
  home_address TEXT,
  father_name TEXT,
  mother_name TEXT,
  marital_status marital_status DEFAULT 'single',
  wife_name TEXT,
  children_names TEXT,
  expected_salary DECIMAL(10,2),
  salary_period salary_period DEFAULT 'monthly',
  upi_id TEXT,
  qr_code_image_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Fund events table
CREATE TABLE public.fund_events (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  masjid_id UUID NOT NULL REFERENCES public.masjids(id),
  title TEXT NOT NULL,
  description TEXT,
  fixed_amount DECIMAL(10,2),
  due_date DATE,
  created_by UUID NOT NULL REFERENCES auth.users(id),
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Fund payments table
CREATE TABLE public.fund_payments (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  fund_event_id UUID NOT NULL REFERENCES public.fund_events(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id),
  amount DECIMAL(10,2),
  status fund_payment_status NOT NULL DEFAULT 'unpaid',
  payment_screenshot_url TEXT,
  marked_by UUID REFERENCES auth.users(id),
  notes TEXT,
  paid_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Expenses table
CREATE TABLE public.expenses (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  masjid_id UUID NOT NULL REFERENCES public.masjids(id),
  title TEXT NOT NULL,
  amount DECIMAL(10,2) NOT NULL,
  expense_date DATE NOT NULL DEFAULT CURRENT_DATE,
  description TEXT,
  receipt_image_url TEXT,
  created_by UUID NOT NULL REFERENCES auth.users(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Announcements table
CREATE TABLE public.announcements (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  masjid_id UUID NOT NULL REFERENCES public.masjids(id),
  title TEXT NOT NULL,
  body TEXT NOT NULL,
  created_by UUID NOT NULL REFERENCES auth.users(id),
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Namaz timings table
CREATE TABLE public.namaz_timings (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  masjid_id UUID NOT NULL REFERENCES public.masjids(id) UNIQUE,
  fajr TIME NOT NULL,
  zuhr TIME NOT NULL,
  asr TIME NOT NULL,
  maghrib TIME NOT NULL,
  isha TIME NOT NULL,
  updated_by UUID REFERENCES auth.users(id),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Posts table
CREATE TABLE public.posts (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  masjid_id UUID NOT NULL REFERENCES public.masjids(id),
  author_id UUID NOT NULL REFERENCES auth.users(id),
  title TEXT NOT NULL,
  content TEXT,
  media_type TEXT CHECK (media_type IN ('text', 'image', 'audio', 'video')),
  media_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- QR codes table
CREATE TABLE public.qr_codes (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  masjid_id UUID NOT NULL REFERENCES public.masjids(id),
  image_url TEXT NOT NULL,
  label TEXT,
  uploaded_by UUID NOT NULL REFERENCES auth.users(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Enable RLS on all tables
ALTER TABLE public.masjids ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.imam_details ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.fund_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.fund_payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.expenses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.announcements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.namaz_timings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.qr_codes ENABLE ROW LEVEL SECURITY;

-- Security definer function for role checks
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role, _masjid_id UUID DEFAULT NULL)
RETURNS BOOLEAN
LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = _user_id AND role = _role AND is_active = true AND is_approved = true
      AND (_masjid_id IS NULL OR masjid_id = _masjid_id)
  )
$$;

CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN NEW.updated_at = now(); RETURN NEW; END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Auto-create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (user_id, full_name, phone)
  VALUES (NEW.id, COALESCE(NEW.raw_user_meta_data->>'full_name', ''), NEW.phone);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

CREATE TRIGGER on_auth_user_created AFTER INSERT ON auth.users FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Update triggers
CREATE TRIGGER update_masjids_updated_at BEFORE UPDATE ON public.masjids FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON public.profiles FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_imam_details_updated_at BEFORE UPDATE ON public.imam_details FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_fund_events_updated_at BEFORE UPDATE ON public.fund_events FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_fund_payments_updated_at BEFORE UPDATE ON public.fund_payments FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_namaz_timings_updated_at BEFORE UPDATE ON public.namaz_timings FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- RLS Policies
CREATE POLICY "Masjids viewable by authenticated" ON public.masjids FOR SELECT TO authenticated USING (true);
CREATE POLICY "Anyone can insert masjids" ON public.masjids FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Motaballi can update their masjid" ON public.masjids FOR UPDATE TO authenticated USING (public.has_role(auth.uid(), 'motaballi', id));

CREATE POLICY "Profiles viewable by authenticated" ON public.profiles FOR SELECT TO authenticated USING (true);
CREATE POLICY "Users can insert own profile" ON public.profiles FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE TO authenticated USING (auth.uid() = user_id);

CREATE POLICY "Roles viewable by authenticated" ON public.user_roles FOR SELECT TO authenticated USING (true);
CREATE POLICY "Users can insert own role" ON public.user_roles FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Motaballi can update roles" ON public.user_roles FOR UPDATE TO authenticated USING (
  public.has_role(auth.uid(), 'motaballi', masjid_id) OR auth.uid() = user_id
);

CREATE POLICY "Imam details viewable" ON public.imam_details FOR SELECT TO authenticated USING (true);
CREATE POLICY "Imams can insert own details" ON public.imam_details FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Imams can update own details" ON public.imam_details FOR UPDATE TO authenticated USING (auth.uid() = user_id);

CREATE POLICY "Fund events viewable" ON public.fund_events FOR SELECT TO authenticated USING (true);
CREATE POLICY "Motaballi can create fund events" ON public.fund_events FOR INSERT TO authenticated WITH CHECK (public.has_role(auth.uid(), 'motaballi', masjid_id));
CREATE POLICY "Motaballi can update fund events" ON public.fund_events FOR UPDATE TO authenticated USING (public.has_role(auth.uid(), 'motaballi', masjid_id));

CREATE POLICY "Payments viewable by user or motaballi" ON public.fund_payments FOR SELECT TO authenticated USING (auth.uid() = user_id OR public.has_role(auth.uid(), 'motaballi'));
CREATE POLICY "Anyone can insert payments" ON public.fund_payments FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Update payments" ON public.fund_payments FOR UPDATE TO authenticated USING (public.has_role(auth.uid(), 'motaballi') OR auth.uid() = user_id);

CREATE POLICY "Expenses viewable" ON public.expenses FOR SELECT TO authenticated USING (true);
CREATE POLICY "Motaballi can create expenses" ON public.expenses FOR INSERT TO authenticated WITH CHECK (public.has_role(auth.uid(), 'motaballi', masjid_id));

CREATE POLICY "Announcements viewable" ON public.announcements FOR SELECT TO authenticated USING (true);
CREATE POLICY "Create announcements" ON public.announcements FOR INSERT TO authenticated WITH CHECK (
  public.has_role(auth.uid(), 'motaballi', masjid_id) OR public.has_role(auth.uid(), 'imam', masjid_id)
);

CREATE POLICY "Namaz timings viewable" ON public.namaz_timings FOR SELECT TO authenticated USING (true);
CREATE POLICY "Insert namaz timings" ON public.namaz_timings FOR INSERT TO authenticated WITH CHECK (
  public.has_role(auth.uid(), 'imam', masjid_id) OR public.has_role(auth.uid(), 'motaballi', masjid_id)
);
CREATE POLICY "Update namaz timings" ON public.namaz_timings FOR UPDATE TO authenticated USING (
  public.has_role(auth.uid(), 'imam', masjid_id) OR public.has_role(auth.uid(), 'motaballi', masjid_id)
);

CREATE POLICY "Posts viewable" ON public.posts FOR SELECT TO authenticated USING (true);
CREATE POLICY "Imams can create posts" ON public.posts FOR INSERT TO authenticated WITH CHECK (public.has_role(auth.uid(), 'imam', masjid_id));

CREATE POLICY "QR codes viewable" ON public.qr_codes FOR SELECT TO authenticated USING (true);
CREATE POLICY "Motaballi can manage QR codes" ON public.qr_codes FOR INSERT TO authenticated WITH CHECK (public.has_role(auth.uid(), 'motaballi', masjid_id));
