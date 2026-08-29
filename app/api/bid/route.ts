import { NextRequest, NextResponse } from 'next/server';
import { getSpot, createBid, uploadLogo } from '@/lib/supabase';
import { createDodoPayment } from '@/lib/dodo';
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
      return NextResponse.json({ error: 'Please provide all required fields.' }, { status: 400 });
    }

    const spot = await getSpot(spotId);
    if (!spot) {
      return NextResponse.json({ error: 'Spot not found. Please refresh and try again.' }, { status: 404 });
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

    // Create Bid record with pending status
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

    const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://spotbid.top';
    const successUrl = `${appUrl}/success?spot_id=${spotId}&bid_id=${bid.id}`;

    // Create Dodo Payments Checkout Session
    const paymentUrl = await createDodoPayment({
      bidId: bid.id,
      spotLabel: `Spot #${spot.id} (${spot.label.replace(/—|–/g, '/')})`,
      amountCents: exactRequiredCents,
      bidderEmail,
      bidderName,
      successUrl,
    });

    return NextResponse.json({
      success: true,
      bid,
      checkout_url: paymentUrl,
    });
  } catch (error: any) {
    console.error('[Bid API Error]:', error);
    const msg = error?.message || 'Payment initiation failed. Please check gateway configuration.';
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
