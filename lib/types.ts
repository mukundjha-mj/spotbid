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
  // Joined fields
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
  // Row 1 — Large spots ($25 min)
  { id: 1, label: 'Top Left Banner', description: 'Large · Premium visibility', tier: 'large', grid_col: '1 / span 2', grid_row: 1, min_bid: 2500 },
  { id: 2, label: 'Marquee — Top Center', description: 'Large · Maximum exposure', tier: 'large', grid_col: '3 / span 2', grid_row: 1, min_bid: 2500 },
  { id: 3, label: 'Top Right Banner', description: 'Large · Premium visibility', tier: 'large', grid_col: '5 / span 2', grid_row: 1, min_bid: 2500 },
  // Row 2 — Small spots around logo ($5 min)
  { id: 4, label: 'Left of Logo', description: 'Small · Next to SpotBid logo', tier: 'small', grid_col: '1 / span 1', grid_row: 2, min_bid: 500 },
  { id: 5, label: 'Inner Left', description: 'Small · Premium logo-adjacent', tier: 'small', grid_col: '2 / span 1', grid_row: 2, min_bid: 500 },
  // Spot 6 & 7 on the right of the center logo
  { id: 6, label: 'Inner Right', description: 'Small · Premium logo-adjacent', tier: 'small', grid_col: '5 / span 1', grid_row: 2, min_bid: 500 },
  { id: 7, label: 'Right of Logo', description: 'Small · Next to SpotBid logo', tier: 'small', grid_col: '6 / span 1', grid_row: 2, min_bid: 500 },
  // Row 3 — Medium spots ($10 min)
  { id: 8, label: 'Bottom Left', description: 'Medium · Solid visibility', tier: 'medium', grid_col: '1 / span 2', grid_row: 3, min_bid: 1000 },
  { id: 9, label: 'Bottom Center', description: 'Medium · Under the logo', tier: 'medium', grid_col: '3 / span 2', grid_row: 3, min_bid: 1000 },
  { id: 10, label: 'Bottom Right', description: 'Medium · Solid visibility', tier: 'medium', grid_col: '5 / span 2', grid_row: 3, min_bid: 1000 },
  // Row 4 — Medium spots ($10 min)
  { id: 11, label: 'Footer Wide', description: 'Medium · Wide banner spot', tier: 'medium', grid_col: '1 / span 4', grid_row: 4, min_bid: 1000 },
  { id: 12, label: 'Footer Right', description: 'Medium · Compact spot', tier: 'medium', grid_col: '5 / span 2', grid_row: 4, min_bid: 1000 },
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
