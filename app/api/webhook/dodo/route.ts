import { NextRequest, NextResponse } from 'next/server';
import { getBid, updateBidStatus, getSpot, updateSpot, getAuctionConfig, updateAuctionConfig } from '@/lib/supabase';
import { checkAntiSnipe } from '@/lib/anti-snipe';
import { sendBidConfirmation, sendOutbidNotification } from '@/lib/resend';

export async function POST(req: NextRequest) {
  try {
    const rawBody = await req.text();
    const payload = JSON.parse(rawBody);

    // Event type in Dodo Payments
    const eventType = payload.type || payload.event;
    const paymentData = payload.data || payload;

    console.log(`[Dodo Webhook] Received event: ${eventType}`, JSON.stringify(paymentData));

    if (eventType === 'payment.succeeded' || eventType === 'payment.successful' || eventType === 'checkout.session.completed') {
      const metadata = paymentData.metadata || {};
      const bidId = Number(metadata.bid_id);

      if (!bidId) {
        console.error('[Dodo Webhook] No bid_id in payment metadata');
        return NextResponse.json({ error: 'Missing bid_id' }, { status: 400 });
      }

      const bid = await getBid(bidId);
      if (!bid) {
        console.error(`[Dodo Webhook] Bid #${bidId} not found`);
        return NextResponse.json({ error: 'Bid not found' }, { status: 404 });
      }

      if (bid.status === 'paid') {
        console.log(`[Dodo Webhook] Bid #${bidId} already marked paid`);
        return NextResponse.json({ received: true });
      }

      const spot = await getSpot(bid.spot_id);
      if (!spot) {
        return NextResponse.json({ error: 'Spot not found' }, { status: 404 });
      }

      const oldBidder = {
        email: spot.bidder_email,
        name: spot.bidder_name,
        amount: spot.current_bid,
      };

      // 1. Mark bid as paid
      await updateBidStatus(bid.id, 'paid');

      // 2. Update spot on live billboard
      await updateSpot(spot.id, {
        current_bid: bid.amount,
        bidder_name: bid.bidder_name,
        bidder_email: bid.bidder_email,
        bidder_url: bid.bidder_url,
        logo_url: bid.logo_path,
        bid_count: spot.bid_count + 1,
      });

      // 3. Update total raised in config
      const config = await getAuctionConfig();
      const newTotal = config.total_raised + bid.amount - spot.current_bid;
      await updateAuctionConfig({ total_raised: newTotal });

      // 4. Trigger Anti-Snipe protection
      await checkAntiSnipe();

      // 5. Send confirmation email to new owner
      await sendBidConfirmation({
        email: bid.bidder_email,
        name: bid.bidder_name,
        spotLabel: spot.label.replace(/—|–/g, '/'),
        amount: bid.amount,
      });

      // 6. Send outbid alert to replaced owner
      if (oldBidder.email && oldBidder.name && oldBidder.amount > 0) {
        await sendOutbidNotification({
          email: oldBidder.email,
          name: oldBidder.name,
          spotLabel: spot.label.replace(/—|–/g, '/'),
          oldAmount: oldBidder.amount,
          newAmount: bid.amount,
          newBidderName: bid.bidder_name,
        });
      }

      console.log(`[Dodo Webhook] Successfully processed payment for Bid #${bidId} on Spot #${spot.id}`);
    }

    return NextResponse.json({ received: true });
  } catch (err: any) {
    console.error('[Dodo Webhook Error]:', err);
    return NextResponse.json({ error: err.message || 'Webhook processing failed' }, { status: 500 });
  }
}
