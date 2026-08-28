import { Spot } from './types';

/**
 * Calculates the exact locked price to claim or take over a spot.
 * - If OPEN: Base tier price ($5 Small, $10 Medium, $25 Large).
 * - If TAKEN: +70% price upgrade over the current price (BrandMyMac mechanic).
 */
export function getNextSpotPriceCents(spot: Spot): number {
  if (!spot.current_bid || spot.current_bid === 0) {
    return spot.min_bid; // in cents ($500, $1000, $2500)
  }

  const currentDollars = spot.current_bid / 100;
  // +70% increase, rounded up to the nearest whole dollar
  const nextDollars = Math.ceil(currentDollars * 1.70);
  return nextDollars * 100;
}

export function getNextSpotPriceDollars(spot: Spot): number {
  return getNextSpotPriceCents(spot) / 100;
}
