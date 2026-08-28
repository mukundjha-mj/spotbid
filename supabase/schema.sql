-- ============================================================
-- SpotBid Supabase Schema (17 Billboard Units)
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

-- 5. Seed 17 Billboard Spots
INSERT INTO public.spots (id, label, description, tier, grid_col, grid_row, min_bid) VALUES
  (1, 'Top Left Banner', 'Large · Premium visibility', 'large', '1 / span 2', 1, 2500),
  (2, 'Marquee / Top Center', 'Large · Maximum exposure', 'large', '3 / span 2', 1, 2500),
  (3, 'Top Right Banner', 'Large · Premium visibility', 'large', '5 / span 2', 1, 2500),
  (4, 'Upper Left', 'Small · High engagement', 'small', '1 / span 1', 2, 500),
  (5, 'Inner Left', 'Small · High engagement', 'small', '2 / span 1', 2, 500),
  (6, 'Billboard Center Stage', 'Center Stage · Prime billboard anchor', 'large', '3 / span 2', 2, 5000),
  (7, 'Inner Right', 'Small · High engagement', 'small', '5 / span 1', 2, 500),
  (8, 'Upper Right', 'Small · High engagement', 'small', '6 / span 1', 2, 500),
  (9, 'Mid Spot A', 'Small · Fast entry placement', 'small', '1 / span 1', 3, 500),
  (10, 'Mid Spot B', 'Small · Fast entry placement', 'small', '2 / span 1', 3, 500),
  (11, 'Mid Spot C', 'Small · Fast entry placement', 'small', '3 / span 1', 3, 500),
  (12, 'Mid Spot D', 'Small · Fast entry placement', 'small', '4 / span 1', 3, 500),
  (13, 'Mid Spot E', 'Small · Fast entry placement', 'small', '5 / span 1', 3, 500),
  (14, 'Mid Spot F', 'Small · Fast entry placement', 'small', '6 / span 1', 3, 500),
  (15, 'Footer Banner Left', 'Medium · High engagement', 'medium', '1 / span 2', 4, 1000),
  (16, 'Footer Banner Center', 'Medium · Central billboard spot', 'medium', '3 / span 2', 4, 1000),
  (17, 'Footer Banner Right', 'Medium · High engagement', 'medium', '5 / span 2', 4, 1000)
ON CONFLICT (id) DO UPDATE SET
  label = EXCLUDED.label,
  description = EXCLUDED.description,
  tier = EXCLUDED.tier,
  grid_col = EXCLUDED.grid_col,
  grid_row = EXCLUDED.grid_row,
  min_bid = EXCLUDED.min_bid;
