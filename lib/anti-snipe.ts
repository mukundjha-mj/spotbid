import { getAuctionConfig, updateAuctionConfig } from './supabase';

export async function checkAntiSnipe(): Promise<{ extended: boolean; newEndTime: string | null }> {
  const config = await getAuctionConfig();
  const now = new Date();
  const endsAt = new Date(config.ends_at);
  const minsRemaining = (endsAt.getTime() - now.getTime()) / 60000;

  if (minsRemaining <= config.anti_snipe_mins && minsRemaining > 0) {
    // Extend the auction
    const newEnd = new Date(endsAt.getTime() + config.anti_snipe_mins * 60000);
    await updateAuctionConfig({ ends_at: newEnd.toISOString() });
    return { extended: true, newEndTime: newEnd.toISOString() };
  }

  return { extended: false, newEndTime: null };
}

export function calculateDeposit(bidAmount: number, config: { deposit_pct: number; min_deposit: number }): number {
  const deposit = Math.round(bidAmount * config.deposit_pct);
  return Math.max(deposit, config.min_deposit);
}
