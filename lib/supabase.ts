import { Spot, Bid, AuctionConfig, SPOT_SEEDS } from './types';

// ============================================================
// Mock Supabase Client
// ============================================================
const USE_REAL_SUPABASE = !!(
  process.env.NEXT_PUBLIC_SUPABASE_URL &&
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

// In-memory store (persists during dev server session)
let spots: Spot[] = SPOT_SEEDS.map((seed) => ({
  ...seed,
  current_bid: 0,
  bidder_name: null,
  bidder_url: null,
  bidder_email: null,
  logo_url: null,
  bid_count: 0,
  is_approved: false,
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
}));

let bids: Bid[] = [];
let bidIdCounter = 1;

let auctionConfig: AuctionConfig = {
  id: 1,
  ends_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
  anti_snipe_mins: 10,
  deposit_pct: 0.20,
  min_deposit: 200,
  funding_goal: 100000,
  total_raised: 0,
};

let supabaseClient: any = null;

async function getSupabase(): Promise<any> {
  if (USE_REAL_SUPABASE && !supabaseClient) {
    const { createClient } = await import('@supabase/supabase-js');
    supabaseClient = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );
  }
  return supabaseClient;
}

// ============================================================
// Data Access Functions
// ============================================================

export async function getSpots(): Promise<Spot[]> {
  const sb = await getSupabase();
  if (sb) {
    const { data, error } = await sb.from('spots').select('*').order('id');
    if (error) throw error;
    return data as Spot[];
  }
  return [...spots];
}

export async function getSpot(id: number): Promise<Spot | null> {
  const sb = await getSupabase();
  if (sb) {
    const { data, error } = await sb.from('spots').select('*').eq('id', id).single();
    if (error) return null;
    return data as Spot;
  }
  return spots.find((s) => s.id === id) || null;
}

export async function updateSpot(id: number, updates: Partial<Spot>): Promise<Spot | null> {
  const sb = await getSupabase();
  if (sb) {
    const { data, error } = await sb
      .from('spots')
      .update({ ...updates, updated_at: new Date().toISOString() } as any)
      .eq('id', id)
      .select()
      .single();
    if (error) throw error;
    return data as Spot;
  }
  const idx = spots.findIndex((s) => s.id === id);
  if (idx === -1) return null;
  spots[idx] = { ...spots[idx], ...updates, updated_at: new Date().toISOString() };
  return spots[idx];
}

export async function createBid(bid: Omit<Bid, 'id' | 'created_at'>): Promise<Bid> {
  const sb = await getSupabase();
  if (sb) {
    const { data, error } = await sb.from('bids').insert(bid as any).select().single();
    if (error) throw error;
    return data as Bid;
  }
  const newBid: Bid = {
    ...bid,
    id: bidIdCounter++,
    created_at: new Date().toISOString(),
  };
  bids.push(newBid);
  return newBid;
}

export async function getBid(id: number): Promise<Bid | null> {
  const sb = await getSupabase();
  if (sb) {
    const { data, error } = await sb.from('bids').select('*').eq('id', id).single();
    if (error) return null;
    return data as Bid;
  }
  return bids.find((b) => b.id === id) || null;
}

export async function updateBid(id: number, updates: Partial<Bid>): Promise<Bid | null> {
  const sb = await getSupabase();
  if (sb) {
    const { data, error } = await sb.from('bids').update(updates as any).eq('id', id).select().single();
    if (error) throw error;
    return data as Bid;
  }
  const idx = bids.findIndex((b) => b.id === id);
  if (idx === -1) return null;
  bids[idx] = { ...bids[idx], ...updates };
  return bids[idx];
}

export async function updateBidStatus(id: number, status: 'pending' | 'paid' | 'outbid' | 'refunded'): Promise<Bid | null> {
  return updateBid(id, { status });
}

export async function getBids(): Promise<Bid[]> {
  const sb = await getSupabase();
  if (sb) {
    const { data, error } = await sb
      .from('bids')
      .select('*, spots(label, tier)')
      .order('created_at', { ascending: false });
    if (error) throw error;
    return (data || []).map((b: Record<string, unknown>) => ({
      ...b,
      spot_label: (b.spots as Record<string, string>)?.label,
      spot_tier: (b.spots as Record<string, string>)?.tier,
    })) as Bid[];
  }
  return bids.map((b) => {
    const spot = spots.find((s) => s.id === b.spot_id);
    return { ...b, spot_label: spot?.label, spot_tier: spot?.tier };
  }).sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
}

export async function getAuctionConfig(): Promise<AuctionConfig> {
  const sb = await getSupabase();
  if (sb) {
    const { data, error } = await sb.from('auction_config').select('*').single();
    if (error) throw error;
    return data as AuctionConfig;
  }
  return { ...auctionConfig };
}

export async function updateAuctionConfig(updates: Partial<AuctionConfig>): Promise<AuctionConfig> {
  const sb = await getSupabase();
  if (sb) {
    const { data, error } = await sb
      .from('auction_config')
      .update(updates as any)
      .eq('id', 1)
      .select()
      .single();
    if (error) throw error;
    return data as AuctionConfig;
  }
  auctionConfig = { ...auctionConfig, ...updates };
  return auctionConfig;
}

// Upload logo - returns a URL
export async function uploadLogo(file: File, spotId: number): Promise<string> {
  const sb = await getSupabase();
  if (sb) {
    const ext = file.name.split('.').pop();
    const path = `${spotId}/${Date.now()}.${ext}`;
    const { error } = await sb.storage.from('logos').upload(path, file);
    if (error) throw error;
    const { data } = sb.storage.from('logos').getPublicUrl(path);
    return data.publicUrl;
  }
  return URL.createObjectURL(file);
}
