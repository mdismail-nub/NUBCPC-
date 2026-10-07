-- NUBPC (Northern University Bangladesh Programming Community)
-- Production Supabase PostgreSQL Schema with Row Level Security (RLS) & Performance Indexes

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. DEPARTMENTS
CREATE TABLE IF NOT EXISTS public.departments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  code TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  head_or_coordinator TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. PROFILES (extends Supabase auth.users)
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  username TEXT UNIQUE NOT NULL,
  full_name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  student_id TEXT NOT NULL,
  department TEXT NOT NULL,
  batch TEXT NOT NULL,
  avatar_url TEXT,
  bio TEXT,
  overall_rating INTEGER DEFAULT 1000,
  rating_change INTEGER DEFAULT 0,
  current_rank INTEGER DEFAULT 0,
  level TEXT DEFAULT 'Newbie',
  solved_problems_count INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT TRUE,
  is_admin BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. CODING PROFILES & PLATFORM RATINGS
CREATE TABLE IF NOT EXISTS public.coding_profiles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  platform TEXT NOT NULL CHECK (platform IN ('codeforces', 'codechef', 'leetcode', 'atcoder')),
  handle TEXT NOT NULL,
  verification_status TEXT DEFAULT 'not_connected' CHECK (verification_status IN ('not_connected', 'checking', 'verified', 'invalid', 'temporarily_unavailable')),
  verified BOOLEAN DEFAULT FALSE,
  rating INTEGER DEFAULT 0,
  max_rating INTEGER DEFAULT 0,
  rank_title TEXT,
  profile_url TEXT,
  last_synced TIMESTAMPTZ DEFAULT NOW(),
  CONSTRAINT unique_user_platform UNIQUE(user_id, platform)
);

CREATE TABLE IF NOT EXISTS public.platform_ratings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  coding_profile_id UUID REFERENCES public.coding_profiles(id) ON DELETE CASCADE,
  rating INTEGER NOT NULL,
  recorded_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. RATING HISTORY
CREATE TABLE IF NOT EXISTS public.rating_history (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  contest_name TEXT NOT NULL,
  rating INTEGER NOT NULL,
  rating_change INTEGER NOT NULL DEFAULT 0,
  recorded_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. LEADERBOARD STATS
CREATE TABLE IF NOT EXISTS public.leaderboard_stats (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE UNIQUE,
  all_time_rank INTEGER,
  current_rating INTEGER NOT NULL,
  solved_problems_count INTEGER DEFAULT 0,
  last_active_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. RATING CONFIGURATION
CREATE TABLE IF NOT EXISTS public.rating_config (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  codeforces_weight NUMERIC(4, 2) DEFAULT 0.35,
  codechef_weight NUMERIC(4, 2) DEFAULT 0.25,
  atcoder_weight NUMERIC(4, 2) DEFAULT 0.20,
  leetcode_weight NUMERIC(4, 2) DEFAULT 0.20,
  baseline_rating INTEGER DEFAULT 1000,
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  updated_by UUID REFERENCES public.profiles(id)
);

-- 7. RANK / LEVEL CONFIGURATION
CREATE TABLE IF NOT EXISTS public.rank_config (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  newbie_max INTEGER DEFAULT 1199,
  pupil_max INTEGER DEFAULT 1399,
  specialist_max INTEGER DEFAULT 1599,
  expert_max INTEGER DEFAULT 1899,
  master_max INTEGER DEFAULT 2199,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 8. CONTESTS
CREATE TABLE IF NOT EXISTS public.contests (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT,
  rules TEXT,
  start_time TIMESTAMPTZ NOT NULL,
  end_time TIMESTAMPTZ,
  duration_minutes INTEGER NOT NULL DEFAULT 120,
  status TEXT NOT NULL CHECK (status IN ('upcoming', 'ongoing', 'past')),
  platform TEXT NOT NULL DEFAULT 'NUBPC Arena',
  participants_count INTEGER DEFAULT 0,
  is_published BOOLEAN DEFAULT TRUE,
  registration_link TEXT,
  created_by UUID REFERENCES public.profiles(id),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 9. CONTEST PARTICIPANTS
CREATE TABLE IF NOT EXISTS public.contest_participants (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  contest_id UUID REFERENCES public.contests(id) ON DELETE CASCADE,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  score INTEGER DEFAULT 0,
  penalty INTEGER DEFAULT 0,
  rank INTEGER,
  solved_count INTEGER DEFAULT 0,
  registered_at TIMESTAMPTZ DEFAULT NOW(),
  CONSTRAINT unique_contest_user UNIQUE(contest_id, user_id)
);

-- 10. RESOURCES
CREATE TABLE IF NOT EXISTS public.resources (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  category TEXT NOT NULL,
  difficulty TEXT NOT NULL CHECK (difficulty IN ('Beginner', 'Intermediate', 'Advanced')),
  type TEXT NOT NULL,
  link TEXT NOT NULL,
  author TEXT,
  recommended_by TEXT,
  stars_count INTEGER DEFAULT 0,
  created_by UUID REFERENCES public.profiles(id),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 11. NOTICES
CREATE TABLE IF NOT EXISTS public.notices (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  category TEXT NOT NULL CHECK (category IN ('Contest', 'Workshop', 'Announcement', 'General', 'Important')),
  short_description TEXT NOT NULL,
  content TEXT NOT NULL,
  is_pinned BOOLEAN DEFAULT FALSE,
  is_published BOOLEAN DEFAULT TRUE,
  author_id UUID REFERENCES public.profiles(id),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 12. ACHIEVEMENTS & USER ACHIEVEMENTS
CREATE TABLE IF NOT EXISTS public.achievements (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  icon TEXT NOT NULL,
  category TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.user_achievements (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  achievement_id UUID REFERENCES public.achievements(id) ON DELETE CASCADE,
  unlocked_at TIMESTAMPTZ DEFAULT NOW(),
  CONSTRAINT unique_user_achievement UNIQUE(user_id, achievement_id)
);

-- 13. SYNC LOGS
CREATE TABLE IF NOT EXISTS public.sync_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  platform TEXT NOT NULL,
  triggered_by UUID REFERENCES public.profiles(id),
  user_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  old_rating INTEGER,
  new_rating INTEGER,
  status TEXT NOT NULL,
  records_updated INTEGER DEFAULT 0,
  message TEXT,
  error_message TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- PERFORMANCE INDEXES
CREATE INDEX IF NOT EXISTS idx_profiles_rating ON public.profiles(overall_rating DESC);
CREATE INDEX IF NOT EXISTS idx_profiles_department ON public.profiles(department);
CREATE INDEX IF NOT EXISTS idx_profiles_batch ON public.profiles(batch);
CREATE INDEX IF NOT EXISTS idx_profiles_username ON public.profiles(username);
CREATE INDEX IF NOT EXISTS idx_coding_profiles_user ON public.coding_profiles(user_id);
CREATE INDEX IF NOT EXISTS idx_rating_history_user ON public.rating_history(user_id, recorded_at DESC);
CREATE INDEX IF NOT EXISTS idx_contests_status ON public.contests(status, start_time DESC);
CREATE INDEX IF NOT EXISTS idx_notices_published ON public.notices(is_published, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_resources_category ON public.resources(category);

-- ROW LEVEL SECURITY (RLS) POLICIES
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.coding_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.platform_ratings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.rating_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.leaderboard_stats ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contest_participants ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.resources ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notices ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.rating_config ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.rank_config ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.achievements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_achievements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sync_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.departments ENABLE ROW LEVEL SECURITY;

-- 1. Public Read Policies
CREATE POLICY "Public profiles are viewable by everyone" 
  ON public.profiles FOR SELECT USING (is_active = true OR auth.uid() = id);

CREATE POLICY "Coding profiles are viewable by everyone" 
  ON public.coding_profiles FOR SELECT USING (true);

CREATE POLICY "Rating history is viewable by everyone" 
  ON public.rating_history FOR SELECT USING (true);

CREATE POLICY "Leaderboard stats viewable by everyone" 
  ON public.leaderboard_stats FOR SELECT USING (true);

CREATE POLICY "Published contests are viewable by everyone" 
  ON public.contests FOR SELECT USING (is_published = true);

CREATE POLICY "Contest participants viewable by everyone" 
  ON public.contest_participants FOR SELECT USING (true);

CREATE POLICY "Resources viewable by everyone" 
  ON public.resources FOR SELECT USING (true);

CREATE POLICY "Published notices viewable by everyone" 
  ON public.notices FOR SELECT USING (is_published = true);

CREATE POLICY "Rating configs viewable by everyone" 
  ON public.rating_config FOR SELECT USING (true);

CREATE POLICY "Departments viewable by everyone" 
  ON public.departments FOR SELECT USING (true);

-- 2. User Self-Update Policies
CREATE POLICY "Users can update their own profile" 
  ON public.profiles FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can manage their own coding profiles" 
  ON public.coding_profiles FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can register for contests" 
  ON public.contest_participants FOR INSERT WITH CHECK (auth.uid() = user_id);

-- 3. Admin Access Policies (Strict RBAC checking is_admin on profile)
CREATE POLICY "Admins have full access to contests" 
  ON public.contests FOR ALL USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND is_admin = true)
  );

CREATE POLICY "Admins have full access to resources" 
  ON public.resources FOR ALL USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND is_admin = true)
  );

CREATE POLICY "Admins have full access to notices" 
  ON public.notices FOR ALL USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND is_admin = true)
  );

CREATE POLICY "Admins can update rating config" 
  ON public.rating_config FOR ALL USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND is_admin = true)
  );

CREATE POLICY "Admins have access to sync logs" 
  ON public.sync_logs FOR ALL USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND is_admin = true)
  );

CREATE POLICY "Admins can manage all profiles" 
  ON public.profiles FOR ALL USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND is_admin = true)
  );
