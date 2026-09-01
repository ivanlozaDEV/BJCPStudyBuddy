-- ==============================================================================
-- BREWSTUDY: Comprehensive Database Schema & Storage Migration
-- Includes: User Profiles, Subscriptions, Flashcards Progress, Quizzes, Tastings, Storage
-- ==============================================================================

-- Enable UUID extension if not enabled
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ------------------------------------------------------------------------------
-- 1. PROFILES & USER DATA (Linked to Supabase Auth)
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  email TEXT,
  display_name TEXT,
  bjcp_id TEXT,
  judge_level TEXT DEFAULT 'Apprentice', -- 'Apprentice', 'Recognized', 'Certified', 'National', 'Master', 'Grand Master'
  
  -- Subscription & Pro Access
  is_pro BOOLEAN DEFAULT FALSE,
  subscription_tier TEXT DEFAULT 'free', -- 'free', 'pro_monthly', 'pro_annual', 'lifetime'
  subscription_status TEXT DEFAULT 'inactive', -- 'active', 'inactive', 'trialing', 'canceled'
  subscription_expires_at TIMESTAMPTZ,
  
  -- Preferences
  preferred_language TEXT DEFAULT 'es', -- 'es' | 'en'
  theme_mode TEXT DEFAULT 'dark',
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS on Profiles
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own profile"
  ON public.profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile"
  ON public.profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

-- Trigger to automatically create profile on Auth sign up
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, display_name, preferred_language)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', split_part(NEW.email, '@', 1)),
    COALESCE(NEW.raw_user_meta_data->>'language', 'es')
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ------------------------------------------------------------------------------
-- 2. STUDY PROGRESS & FLASHCARDS (Spaced Repetition & History)
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.study_progress (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  item_id TEXT NOT NULL, -- e.g. '21A', 'diacetyl', 'dms', etc.
  item_type TEXT NOT NULL, -- 'styles', 'glossary', 'offflavors'
  
  times_correct INTEGER DEFAULT 0,
  times_wrong INTEGER DEFAULT 0,
  difficulty_score NUMERIC DEFAULT 0.5, -- 0.0 (mastered) to 1.0 (hard)
  last_reviewed_at TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  
  CONSTRAINT unique_user_item UNIQUE (user_id, item_id, item_type)
);

-- Enable RLS on Study Progress
ALTER TABLE public.study_progress ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own study progress"
  ON public.study_progress FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert/update own study progress"
  ON public.study_progress FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own study progress"
  ON public.study_progress FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own study progress"
  ON public.study_progress FOR DELETE
  USING (auth.uid() = user_id);

CREATE INDEX IF NOT EXISTS idx_study_progress_user_type ON public.study_progress(user_id, item_type);
CREATE INDEX IF NOT EXISTS idx_study_progress_last_reviewed ON public.study_progress(last_reviewed_at DESC);

-- ------------------------------------------------------------------------------
-- 3. QUIZZES & BJCP EXAM ATTEMPTS
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.quiz_attempts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  quiz_type TEXT NOT NULL, -- 'quick_quiz', 'full_exam_simulator', 'style_quiz', 'off_flavor_quiz'
  category TEXT, -- e.g. 'IPA', 'Belgian', 'All'
  score NUMERIC NOT NULL,
  total_questions INTEGER NOT NULL,
  score_percentage NUMERIC GENERATED ALWAYS AS (ROUND((score / NULLIF(total_questions, 0)) * 100, 1)) STORED,
  passed BOOLEAN DEFAULT FALSE, -- e.g. score_percentage >= 70
  time_spent_seconds INTEGER DEFAULT 0,
  answers_summary JSONB DEFAULT '{}'::jsonb,
  completed_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS on Quiz Attempts
ALTER TABLE public.quiz_attempts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own quiz attempts"
  ON public.quiz_attempts FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own quiz attempts"
  ON public.quiz_attempts FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own quiz attempts"
  ON public.quiz_attempts FOR DELETE
  USING (auth.uid() = user_id);

CREATE INDEX IF NOT EXISTS idx_quiz_attempts_user_id ON public.quiz_attempts(user_id, completed_at DESC);

-- ------------------------------------------------------------------------------
-- 4. TASTING NOTES (Official BJCP 50-Point Scoresheet & Dual Photos)
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.tasting_notes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  style_id TEXT NOT NULL,
  style_name TEXT NOT NULL,
  beer_name TEXT NOT NULL,
  brewery TEXT,
  vintage_or_batch TEXT,
  photo_url TEXT,
  label_photo_url TEXT,
  
  -- BJCP Official Sensory Breakdown Scores & Notes
  appearance_score NUMERIC DEFAULT 0,
  appearance_notes TEXT,
  aroma_score NUMERIC DEFAULT 0,
  aroma_notes TEXT,
  flavor_score NUMERIC DEFAULT 0,
  flavor_notes TEXT,
  mouthfeel_score NUMERIC DEFAULT 0,
  mouthfeel_notes TEXT,
  aftertaste_notes TEXT,
  overall_score NUMERIC DEFAULT 0,
  overall_notes TEXT,
  
  -- Structured Sensory Scales (Sweetness, Bitterness, Clarity, Body, etc.)
  structured_attributes JSONB DEFAULT '{}'::jsonb,
  
  -- Total Score & Metadata
  total_score NUMERIC DEFAULT 0,
  descriptors TEXT[] DEFAULT '{}',
  feedback_notes TEXT,
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row Level Security (RLS) on Tasting Notes
ALTER TABLE public.tasting_notes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own tasting notes"
  ON public.tasting_notes FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own tasting notes"
  ON public.tasting_notes FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own tasting notes"
  ON public.tasting_notes FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own tasting notes"
  ON public.tasting_notes FOR DELETE
  USING (auth.uid() = user_id);

CREATE INDEX IF NOT EXISTS idx_tasting_notes_user_id ON public.tasting_notes(user_id);
CREATE INDEX IF NOT EXISTS idx_tasting_notes_created_at ON public.tasting_notes(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_tasting_notes_style_id ON public.tasting_notes(style_id);

-- ------------------------------------------------------------------------------
-- 5. STORAGE BUCKET FOR PHOTOS ('beer-labels')
-- ------------------------------------------------------------------------------
INSERT INTO storage.buckets (id, name, public)
VALUES ('beer-labels', 'beer-labels', true)
ON CONFLICT (id) DO UPDATE SET public = true;

-- Storage RLS Policies
DROP POLICY IF EXISTS "Public can view beer photos" ON storage.objects;
CREATE POLICY "Public can view beer photos"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'beer-labels');

DROP POLICY IF EXISTS "Authenticated users can upload beer photos" ON storage.objects;
CREATE POLICY "Authenticated users can upload beer photos"
  ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'beer-labels'
    AND auth.role() = 'authenticated'
  );

DROP POLICY IF EXISTS "Users can update own beer photos" ON storage.objects;
CREATE POLICY "Users can update own beer photos"
  ON storage.objects FOR UPDATE
  USING (
    bucket_id = 'beer-labels'
    AND auth.uid()::text = (storage.foldername(name))[1]
  );

DROP POLICY IF EXISTS "Users can delete own beer photos" ON storage.objects;
CREATE POLICY "Users can delete own beer photos"
  ON storage.objects FOR DELETE
  USING (
    bucket_id = 'beer-labels'
    AND auth.uid()::text = (storage.foldername(name))[1]
  );
