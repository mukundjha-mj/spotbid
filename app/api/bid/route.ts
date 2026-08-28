import { NextRequest, NextResponse } from 'next/server';
import { getSpot, createBid, updateSpot, uploadLogo, getAuctionConfig, updateAuctionConfig } from '@/lib/supabase';
import { createPolarCheckout } from '@/lib/polar';
import { checkAntiSnipe, calculateDeposit } from '@/lib/anti-snipe';
import { sendBidConfirmation, sendOutbidNotification } from '@/lib/resend';

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const spotId = Number(formData.get('spot_id'));
    const bidderName = formData.get('bidder_name') as string;
    const bidderEmail = formData.get('bidder_email') as string;
    const bidderUrl = (formData.get('bidder_url') as string) || null;
    const amount = Number(formData.get('amount')); // in cents
    const logoFile = formData.get('logo') as File | null;

    if (!spotId || !bidderName || !bidderEmail || !amount) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const spot = await getSpot(spotId);
    if (!spot) {
      return NextResponse.json({ error: 'Spot not found' }, { status: 404 });
    }

    // Min bid validation ($5 increment if already taken)
    const minRequired = spot.current_bid > 0 ? spot.current_bid + 500 : spot.min_bid;
    if (amount < minRequired) {
      return NextResponse.json(
        { error: `Bid must be at least $${(minRequired / 100).toFixed(2)}` },
        { status: 400 }
      );
    }

    let logoUrl: string | null = spot.logo_url;
    if (logoFile && logoFile.size > 0) {
      try {
        logoUrl = await uploadLogo(logoFile, spotId);
      } catch (err) {
        console.warn('Logo upload failed, using fallback', err);
      }
    }

    const config = await getAuctionConfig();
    const depositAmount = calculateDeposit(amount, config);

    // Create Bid record
    const bid = await createBid({
      spot_id: spotId,
      bidder_name: bidderName,
      bidder_email: bidderEmail,
      bidder_url: bidderUrl,
      amount,
      logo_path: logoUrl,
      status: 'pending',
      stripe_session_id: null,
    });

    const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
    const successUrl = `${appUrl}/success?spot_id=${spotId}&bid_id=${bid.id}`;

    // 1. Polar Checkout (Primary gateway for India + Worldwide)
    if (process.env.POLAR_ACCESS_TOKEN) {
      const polarUrl = await createPolarCheckout({
        bidId: bid.id,
        spotLabel: `Spot #${spot.id} (${spot.label})`,
        amount: depositAmount,
        bidderEmail,
        successUrl,
      });

      return NextResponse.json({
        success: true,
        bid,
        checkout_url: polarUrl,
      });
    }

    // 2. Direct Mock Mode (If no Polar key provided)
    const oldBidder = {
      email: spot.bidder_email,
      name: spot.bidder_name,
      amount: spot.current_bid,
    };

    await updateSpot(spotId, {
      current_bid: amount,
      bidder_name: bidderName,
      bidder_email: bidderEmail,
      bidder_url: bidderUrl,
      logo_url: logoUrl,
      bid_count: spot.bid_count + 1,
    });

    await updateAuctionConfig({
      total_raised: config.total_raised + amount - spot.current_bid,
    });

    await checkAntiSnipe();

    // Send confirmation email via Resend
    await sendBidConfirmation({
      email: bidderEmail,
      name: bidderName,
      spotLabel: spot.label,
      amount,
    });

    // Send outbid alert if someone was replaced
    if (oldBidder.email && oldBidder.name && oldBidder.amount > 0) {
      await sendOutbidNotification({
        email: oldBidder.email,
        name: oldBidder.name,
        spotLabel: spot.label,
        oldAmount: oldBidder.amount,
        newAmount: amount,
        newBidderName: bidderName,
      });
    }

    return NextResponse.json({
      success: true,
      bid,
      checkout_url: null,
      message: 'Bid placed in test mode',
    });
  } catch (error: any) {
    console.error('Bid creation error:', error);
    return NextResponse.json({ error: error.message || 'Internal error' }, { status: 500 });
  }
}
