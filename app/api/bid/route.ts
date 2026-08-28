import { NextRequest, NextResponse } from 'next/server';
import { getSpot, createBid, updateSpot, uploadLogo, getAuctionConfig, updateAuctionConfig } from '@/lib/supabase';
import { createPolarCheckout } from '@/lib/polar';
import { checkAntiSnipe } from '@/lib/anti-snipe';
import { sendBidConfirmation, sendOutbidNotification } from '@/lib/resend';
import { getAutoLogoUrl } from '@/lib/logo';
import { getNextSpotPriceCents } from '@/lib/pricing';

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const spotId = Number(formData.get('spot_id'));
    const bidderName = formData.get('bidder_name') as string;
    const bidderEmail = formData.get('bidder_email') as string;
    const bidderUrl = (formData.get('bidder_url') as string) || null;
    const logoFile = formData.get('logo') as File | null;
    const clientAutoLogo = formData.get('auto_logo_url') as string | null;

    if (!spotId || !bidderName || !bidderEmail) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const spot = await getSpot(spotId);
    if (!spot) {
      return NextResponse.json({ error: 'Spot not found' }, { status: 404 });
    }

    // Exact BrandMyMac fixed price (+70% takeover or base price)
    const exactRequiredCents = getNextSpotPriceCents(spot);

    // Determine Logo: Uploaded File > Auto-detected Logo > Existing Spot Logo
    let logoUrl: string | null = spot.logo_url;

    if (logoFile && logoFile.size > 0) {
      try {
        logoUrl = await uploadLogo(logoFile, spotId);
      } catch (err) {
        console.warn('Logo upload failed, using fallback', err);
      }
    } else if (clientAutoLogo) {
      logoUrl = clientAutoLogo;
    } else if (bidderUrl) {
      logoUrl = getAutoLogoUrl(bidderUrl) || spot.logo_url;
    }

    // Create Bid record with exact fixed price
    const bid = await createBid({
      spot_id: spotId,
      bidder_name: bidderName,
      bidder_email: bidderEmail,
      bidder_url: bidderUrl,
      amount: exactRequiredCents,
      logo_path: logoUrl,
      status: 'pending',
      stripe_session_id: null,
    });

    const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
    const successUrl = `${appUrl}/success?spot_id=${spotId}&bid_id=${bid.id}`;

    // 1. Polar Checkout (Full Fixed Payment - Non-refundable)
    if (process.env.POLAR_ACCESS_TOKEN) {
      const polarUrl = await createPolarCheckout({
        bidId: bid.id,
        spotLabel: `Spot #${spot.id} (${spot.label.replace(/—|–/g, '/')})`,
        amount: exactRequiredCents,
        bidderEmail,
        successUrl,
      });

      return NextResponse.json({
        success: true,
        bid,
        checkout_url: polarUrl,
      });
    }

    // 2. Direct Mock Mode
    const oldBidder = {
      email: spot.bidder_email,
      name: spot.bidder_name,
      amount: spot.current_bid,
    };

    await updateSpot(spotId, {
      current_bid: exactRequiredCents,
      bidder_name: bidderName,
      bidder_email: bidderEmail,
      bidder_url: bidderUrl,
      logo_url: logoUrl,
      bid_count: spot.bid_count + 1,
    });

    const config = await getAuctionConfig();
    await updateAuctionConfig({
      total_raised: config.total_raised + exactRequiredCents - spot.current_bid,
    });

    await checkAntiSnipe();

    // Send confirmation email via Resend
    await sendBidConfirmation({
      email: bidderEmail,
      name: bidderName,
      spotLabel: spot.label.replace(/—|–/g, '/'),
      amount: exactRequiredCents,
    });

    // Send outbid alert if someone was replaced
    if (oldBidder.email && oldBidder.name && oldBidder.amount > 0) {
      await sendOutbidNotification({
        email: oldBidder.email,
        name: oldBidder.name,
        spotLabel: spot.label.replace(/—|–/g, '/'),
        oldAmount: oldBidder.amount,
        newAmount: exactRequiredCents,
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
