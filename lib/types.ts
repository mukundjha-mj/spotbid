export type SpotTier = 'small' | 'medium' | 'large';
export type BidStatus = 'pending' | 'paid' | 'outbid' | 'refunded';

export interface Spot {
  id: number;
  label: string;
  description: string;
  tier: SpotTier;
  grid_col: string;
  grid_row: number;
  min_bid: number; // in cents
  current_bid: number; // in cents
  bidder_name: string | null;
  bidder_url: string | null;
  bidder_email: string | null;
  logo_url: string | null;
  bid_count: number;
  is_approved: boolean;
  created_at: string;
  updated_at: string;
}

export interface Bid {
  id: number;
  spot_id: number;
  bidder_name: string;
  bidder_email: string;
  bidder_url: string | null;
  amount: number; // in cents
  logo_path: string | null;
  status: BidStatus;
  stripe_session_id: string | null;
  created_at: string;
  spot_label?: string;
  spot_tier?: SpotTier;
}

export interface AuctionConfig {
  id: number;
  ends_at: string;
  anti_snipe_mins: number;
  deposit_pct: number;
  min_deposit: number; // in cents
  funding_goal: number; // in cents
  total_raised: number; // in cents
}

export interface SpotSeed {
  id: number;
  label: string;
  description: string;
  tier: SpotTier;
  grid_col: string;
  grid_row: number;
  min_bid: number;
}

export const SPOT_SEEDS: SpotSeed[] = [
  // Row 1 - Marquee Banners ($25)
  { id: 1, label: 'Top Left Banner', description: 'Large · Premium visibility', tier: 'large', grid_col: '1 / span 2', grid_row: 1, min_bid: 2500 },
  { id: 2, label: 'Marquee / Top Center', description: 'Large · Maximum exposure', tier: 'large', grid_col: '3 / span 2', grid_row: 1, min_bid: 2500 },
  { id: 3, label: 'Top Right Banner', description: 'Large · Premium visibility', tier: 'large', grid_col: '5 / span 2', grid_row: 1, min_bid: 2500 },

  // Row 2 - Center Featured Strip with Prime Center ($50)
  { id: 4, label: 'Upper Left', description: 'Small · High engagement', tier: 'small', grid_col: '1 / span 1', grid_row: 2, min_bid: 500 },
  { id: 5, label: 'Inner Left', description: 'Small · High engagement', tier: 'small', grid_col: '2 / span 1', grid_row: 2, min_bid: 500 },
  { id: 6, label: 'Billboard Center Stage', description: 'Center Stage · Prime billboard anchor', tier: 'large', grid_col: '3 / span 2', grid_row: 2, min_bid: 5000 },
  { id: 7, label: 'Inner Right', description: 'Small · High engagement', tier: 'small', grid_col: '5 / span 1', grid_row: 2, min_bid: 500 },
  { id: 8, label: 'Upper Right', description: 'Small · High engagement', tier: 'small', grid_col: '6 / span 1', grid_row: 2, min_bid: 500 },

  // Row 3 - 6 Small Spots ($5)
  { id: 9, label: 'Mid Spot A', description: 'Small · Fast entry placement', tier: 'small', grid_col: '1 / span 1', grid_row: 3, min_bid: 500 },
  { id: 10, label: 'Mid Spot B', description: 'Small · Fast entry placement', tier: 'small', grid_col: '2 / span 1', grid_row: 3, min_bid: 500 },
  { id: 11, label: 'Mid Spot C', description: 'Small · Fast entry placement', tier: 'small', grid_col: '3 / span 1', grid_row: 3, min_bid: 500 },
  { id: 12, label: 'Mid Spot D', description: 'Small · Fast entry placement', tier: 'small', grid_col: '4 / span 1', grid_row: 3, min_bid: 500 },
  { id: 13, label: 'Mid Spot E', description: 'Small · Fast entry placement', tier: 'small', grid_col: '5 / span 1', grid_row: 3, min_bid: 500 },
  { id: 14, label: 'Mid Spot F', description: 'Small · Fast entry placement', tier: 'small', grid_col: '6 / span 1', grid_row: 3, min_bid: 500 },

  // Row 4 - Footer Primary Banners ($10)
  { id: 15, label: 'Footer Banner Left', description: 'Medium · High engagement', tier: 'medium', grid_col: '1 / span 2', grid_row: 4, min_bid: 1000 },
  { id: 16, label: 'Footer Banner Center', description: 'Medium · Central billboard spot', tier: 'medium', grid_col: '3 / span 2', grid_row: 4, min_bid: 1000 },
  { id: 17, label: 'Footer Banner Right', description: 'Medium · High engagement', tier: 'medium', grid_col: '5 / span 2', grid_row: 4, min_bid: 1000 },
];

export function formatCurrency(cents: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(cents / 100);
}

export function formatCurrencyFull(cents: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
  }).format(cents / 100);
}
