-- ==========================================================
-- AdShield AI - Production PostgreSQL Database Schema (Supabase)
-- Run this script in your Supabase SQL Editor
-- ==========================================================

-- 1. PROFILES (Extends Supabase auth.users)
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  full_name TEXT,
  company_name TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable Row Level Security (RLS)
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own profile" 
  ON public.profiles FOR SELECT 
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" 
  ON public.profiles FOR UPDATE 
  USING (auth.uid() = id);

-- 2. SUBSCRIPTIONS & SCAN CREDITS
CREATE TYPE subscription_tier AS ENUM ('free', 'starter', 'pro', 'agency');
CREATE TYPE subscription_status AS ENUM ('active', 'past_due', 'canceled', 'trialing');

CREATE TABLE IF NOT EXISTS public.subscriptions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  stripe_customer_id TEXT,
  stripe_subscription_id TEXT,
  plan subscription_tier DEFAULT 'free' NOT NULL,
  status subscription_status DEFAULT 'active' NOT NULL,
  scan_limit INTEGER DEFAULT 1 NOT NULL, -- Free: 1, Starter: 25, Pro: 100, Agency: 300
  scans_used INTEGER DEFAULT 0 NOT NULL,
  current_period_start TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
  current_period_end TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.subscriptions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own subscription" 
  ON public.subscriptions FOR SELECT 
  USING (auth.uid() = user_id);

-- 3. AUDITED SCANS
CREATE TYPE ad_platform AS ENUM ('meta', 'google', 'tiktok');
CREATE TYPE risk_level AS ENUM ('Low Risk (Safe)', 'Medium Risk', 'High Risk', 'Critical Risk');

CREATE TABLE IF NOT EXISTS public.scans (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  platform ad_platform DEFAULT 'meta' NOT NULL,
  ad_headline TEXT NOT NULL,
  ad_primary_text TEXT NOT NULL,
  description TEXT,
  call_to_action TEXT,
  landing_page_url TEXT,
  compliance_score INTEGER NOT NULL,
  risk_level risk_level NOT NULL,
  summary_text TEXT,
  is_free_scan BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.scans ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own scans" 
  ON public.scans FOR SELECT 
  USING (auth.uid() = user_id OR user_id IS NULL);

CREATE POLICY "Users can insert scans" 
  ON public.scans FOR INSERT 
  WITH CHECK (auth.uid() = user_id OR user_id IS NULL);

-- 4. SCAN VIOLATIONS
CREATE TYPE violation_severity AS ENUM ('HIGH RISK', 'MEDIUM RISK', 'LOW RISK');

CREATE TABLE IF NOT EXISTS public.scan_violations (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  scan_id UUID REFERENCES public.scans(id) ON DELETE CASCADE NOT NULL,
  severity violation_severity NOT NULL,
  quote TEXT NOT NULL,
  potential_issue TEXT NOT NULL,
  policy_ref TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.scan_violations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own scan violations" 
  ON public.scan_violations FOR SELECT 
  USING (EXISTS (
    SELECT 1 FROM public.scans 
    WHERE public.scans.id = scan_violations.scan_id 
    AND (public.scans.user_id = auth.uid() OR public.scans.user_id IS NULL)
  ));

-- 5. AI REWRITES
CREATE TABLE IF NOT EXISTS public.ai_rewrites (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  scan_id UUID REFERENCES public.scans(id) ON DELETE CASCADE NOT NULL,
  safer_headline TEXT NOT NULL,
  safer_primary_text TEXT NOT NULL,
  why_this_matters JSONB DEFAULT '[]'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.ai_rewrites ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own rewrites" 
  ON public.ai_rewrites FOR SELECT 
  USING (EXISTS (
    SELECT 1 FROM public.scans 
    WHERE public.scans.id = ai_rewrites.scan_id 
    AND (public.scans.user_id = auth.uid() OR public.scans.user_id IS NULL)
  ));

-- Trigger: Automatically create a profile & subscription row when a user signs up via Supabase Auth
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name)
  VALUES (new.id, new.email, new.raw_user_meta_data->>'full_name');

  INSERT INTO public.subscriptions (user_id, plan, scan_limit, scans_used)
  VALUES (new.id, 'free', 1, 0);

  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();
