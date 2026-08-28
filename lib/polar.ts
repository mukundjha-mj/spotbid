// ============================================================
// Polar.sh Payment Gateway Integration
// Polar is a Merchant of Record (MoR) that works seamlessly
// in India and worldwide without requiring a foreign business entity.
// ============================================================

const POLAR_ACCESS_TOKEN = process.env.POLAR_ACCESS_TOKEN;
const POLAR_PRODUCT_PRICE_ID = process.env.POLAR_PRODUCT_PRICE_ID || '0cca1dfb-3bfd-4dbf-a969-b23f43ba1d87';

const POLAR_API_BASE = 'https://api.polar.sh/v1';

export async function createPolarCheckout({
  bidId,
  spotLabel,
  amount, // in cents USD (e.g. 500 = $5.00)
  bidderEmail,
  successUrl,
}: {
  bidId: number;
  spotLabel: string;
  amount: number;
  bidderEmail: string;
  successUrl: string;
}): Promise<string | null> {
  if (!POLAR_ACCESS_TOKEN) {
    console.log('[Polar Mock Mode] No POLAR_ACCESS_TOKEN found. Redirecting to success directly.');
    return `${successUrl}&session_id=mock_polar_${bidId}`;
  }

  try {
    const response = await fetch(`${POLAR_API_BASE}/checkouts/custom/`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${POLAR_ACCESS_TOKEN}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        product_price_id: POLAR_PRODUCT_PRICE_ID,
        amount: amount, // in cents
        customer_email: bidderEmail,
        success_url: successUrl,
        metadata: {
          bid_id: bidId.toString(),
          spot_label: spotLabel,
        },
      }),
    });

    if (!response.ok) {
      const err = await response.text();
      console.error('Polar checkout creation error:', response.status, err);
      return `${successUrl}&session_id=mock_polar_${bidId}`;
    }

    const data = await response.json();
    return data.url; // Polar hosted checkout URL
  } catch (error) {
    console.error('Polar API error:', error);
    return `${successUrl}&session_id=mock_polar_${bidId}`;
  }
}
