-- ============================================================
-- SpotBid Supabase Schema
-- Run this in your Supabase SQL Editor: 
-- https://supabase.com/dashboard/project/zefapapyaqyhvzecdtra/sql
-- ============================================================

-- 1. Create spots table
CREATE TABLE IF NOT EXISTS public.spots (
  id            INTEGER PRIMARY KEY,
  label         TEXT NOT NULL,
  description   TEXT NOT NULL,
  tier          TEXT NOT NULL CHECK (tier IN ('small', 'medium', 'large')),
  grid_col      TEXT NOT NULL,
  grid_row      INTEGER NOT NULL,
  min_bid       INTEGER NOT NULL DEFAULT 500,
  current_bid   INTEGER NOT NULL DEFAULT 0,
  bidder_name   TEXT,
  bidder_url    TEXT,
  bidder_email  TEXT,
  logo_url      TEXT,
  bid_count     INTEGER NOT NULL DEFAULT 0,
  is_approved   BOOLEAN NOT NULL DEFAULT FALSE,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 2. Create bids table
CREATE TABLE IF NOT EXISTS public.bids (
  id                BIGSERIAL PRIMARY KEY,
  spot_id           INTEGER NOT NULL REFERENCES public.spots(id) ON DELETE CASCADE,
  bidder_name       TEXT NOT NULL,
  bidder_email      TEXT NOT NULL,
  bidder_url        TEXT,
  amount            INTEGER NOT NULL,
  logo_path         TEXT,
  status            TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'paid', 'outbid', 'refunded')),
  stripe_session_id TEXT,
  created_at        TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 3. Create auction_config table
CREATE TABLE IF NOT EXISTS public.auction_config (
  id              INTEGER PRIMARY KEY DEFAULT 1,
  ends_at         TIMESTAMPTZ NOT NULL,
  anti_snipe_mins INTEGER NOT NULL DEFAULT 10,
  deposit_pct     DECIMAL NOT NULL DEFAULT 0.20,
  min_deposit     INTEGER NOT NULL DEFAULT 200,
  funding_goal    INTEGER NOT NULL DEFAULT 100000,
  total_raised    INTEGER NOT NULL DEFAULT 0
);

-- 4. Enable Row Level Security (RLS) & Public Access Policies
ALTER TABLE public.spots ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bids ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.auction_config ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public spots view" ON public.spots FOR SELECT USING (true);
CREATE POLICY "Public spots update" ON public.spots FOR UPDATE USING (true);
CREATE POLICY "Public spots insert" ON public.spots FOR INSERT WITH CHECK (true);

CREATE POLICY "Public bids view" ON public.bids FOR SELECT USING (true);
CREATE POLICY "Public bids insert" ON public.bids FOR INSERT WITH CHECK (true);
CREATE POLICY "Public bids update" ON public.bids FOR UPDATE USING (true);

CREATE POLICY "Public config view" ON public.auction_config FOR SELECT USING (true);
CREATE POLICY "Public config update" ON public.auction_config FOR UPDATE USING (true);
CREATE POLICY "Public config insert" ON public.auction_config FOR INSERT WITH CHECK (true);

-- 5. Insert initial Auction Config
INSERT INTO public.auction_config (id, ends_at, anti_snipe_mins, deposit_pct, min_deposit, funding_goal, total_raised)
VALUES (1, NOW() + INTERVAL '7 days', 10, 0.20, 200, 100000, 0)
ON CONFLICT (id) DO NOTHING;

-- 6. Seed the 12 Spots
INSERT INTO public.spots (id, label, description, tier, grid_col, grid_row, min_bid) VALUES
  (1, 'Top Left Banner', 'Large · Premium visibility', 'large', '1 / span 2', 1, 2500),
  (2, 'Marquee — Top Center', 'Large · Maximum exposure', 'large', '3 / span 2', 1, 2500),
  (3, 'Top Right Banner', 'Large · Premium visibility', 'large', '5 / span 2', 1, 2500),
  (4, 'Left of Logo', 'Small · Next to SpotBid logo', 'small', '1 / span 1', 2, 500),
  (5, 'Inner Left', 'Small · Premium logo-adjacent', 'small', '2 / span 1', 2, 500),
  (6, 'Inner Right', 'Small · Premium logo-adjacent', 'small', '5 / span 1', 2, 500),
  (7, 'Right of Logo', 'Small · Next to SpotBid logo', 'small', '6 / span 1', 2, 500),
  (8, 'Bottom Left', 'Medium · Solid visibility', 'medium', '1 / span 2', 3, 1000),
  (9, 'Bottom Center', 'Medium · Under the logo', 'medium', '3 / span 2', 3, 1000),
  (10, 'Bottom Right', 'Medium · Solid visibility', 'medium', '5 / span 2', 3, 1000),
  (11, 'Footer Wide', 'Medium · Wide banner spot', 'medium', '1 / span 4', 4, 1000),
  (12, 'Footer Right', 'Medium · Compact spot', 'medium', '5 / span 2', 4, 1000)
ON CONFLICT (id) DO UPDATE SET
  label = EXCLUDED.label,
  description = EXCLUDED.description,
  tier = EXCLUDED.tier,
  grid_col = EXCLUDED.grid_col,
  grid_row = EXCLUDED.grid_row,
  min_bid = EXCLUDED.min_bid;

-- 7. Create Storage Bucket for Logos (if not already created)
INSERT INTO storage.buckets (id, name, public)
VALUES ('logos', 'logos', true)
ON CONFLICT (id) DO NOTHING;

CREATE POLICY "Public Access to Logos" ON storage.objects FOR SELECT USING (bucket_id = 'logos');
CREATE POLICY "Public Upload to Logos" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'logos');
