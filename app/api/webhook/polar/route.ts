import { NextRequest, NextResponse } from 'next/server';
import { getSpot, updateSpot, updateBid, getAuctionConfig, updateAuctionConfig, getBids } from '@/lib/supabase';
import { checkAntiSnipe } from '@/lib/anti-snipe';
import { sendBidConfirmation, sendOutbidNotification } from '@/lib/resend';

export async function POST(req: NextRequest) {
  try {
    const payload = await req.json();

    // Polar event types: 'checkout.updated' (status: 'succeeded') or 'order.created'
    const eventType = payload.type || payload.event;
    const data = payload.data;

    if (eventType === 'checkout.updated' && data?.status === 'succeeded' || eventType === 'order.created') {
      const bidId = data.metadata?.bid_id ? Number(data.metadata.bid_id) : null;

      if (bidId) {
        const allBids = await getBids();
        const bid = allBids.find((b) => b.id === bidId);

        if (bid) {
          const spot = await getSpot(bid.spot_id);

          if (spot) {
            const oldBidder = {
              email: spot.bidder_email,
              name: spot.bidder_name,
              amount: spot.current_bid,
            };

            // Mark bid as paid
            await updateBid(bid.id, {
              status: 'paid',
              stripe_session_id: data.id || `polar_${bid.id}`,
            });

            // Update spot
            await updateSpot(spot.id, {
              current_bid: bid.amount,
              bidder_name: bid.bidder_name,
              bidder_email: bid.bidder_email,
              bidder_url: bid.bidder_url,
              logo_url: bid.logo_path || spot.logo_url,
              bid_count: spot.bid_count + 1,
            });

            // Update auction config total
            const config = await getAuctionConfig();
            await updateAuctionConfig({
              total_raised: config.total_raised + bid.amount - spot.current_bid,
            });

            // Check anti-snipe
            await checkAntiSnipe();

            // Send confirmation
            await sendBidConfirmation({
              email: bid.bidder_email,
              name: bid.bidder_name,
              spotLabel: spot.label,
              amount: bid.amount,
            });

            // Send outbid alert if previous bidder existed
            if (oldBidder.email && oldBidder.name && oldBidder.amount > 0) {
              await sendOutbidNotification({
                email: oldBidder.email,
                name: oldBidder.name,
                spotLabel: spot.label,
                oldAmount: oldBidder.amount,
                newAmount: bid.amount,
                newBidderName: bid.bidder_name,
              });
            }
          }
        }
      }
    }

    return NextResponse.json({ received: true });
  } catch (error: any) {
    console.error('Polar webhook error:', error);
    return NextResponse.json({ error: error.message || 'Webhook failed' }, { status: 500 });
  }
}
