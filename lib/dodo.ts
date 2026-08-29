import DodoPayments from 'dodopayments';

interface CreateDodoPaymentParams {
  bidId: number;
  spotLabel: string;
  amountCents: number; // in cents ($25.00 = 2500)
  bidderEmail: string;
  bidderName: string;
  successUrl: string;
}

export async function createDodoPayment({
  bidId,
  spotLabel,
  amountCents,
  bidderEmail,
  bidderName,
  successUrl,
}: CreateDodoPaymentParams): Promise<string> {
  const apiKey = process.env.DODO_PAYMENTS_API_KEY;

  if (!apiKey) {
    throw new Error('DODO_PAYMENTS_API_KEY is not configured in environment variables');
  }

  const environment =
    process.env.DODO_PAYMENTS_ENVIRONMENT === 'live_mode' || apiKey.startsWith('live_')
      ? 'live_mode'
      : 'test_mode';

  const dodo = new DodoPayments({
    bearerToken: apiKey,
    environment,
  });

  const productId = process.env.DODO_PRODUCT_ID;

  if (!productId) {
    throw new Error('DODO_PRODUCT_ID is not configured in environment variables');
  }

  const payment = await dodo.payments.create({
    billing: {
      city: 'San Francisco',
      country: 'US',
      state: 'CA',
      street: '1 Market St',
      zipcode: '94105',
    },
    customer: {
      email: bidderEmail,
      name: bidderName,
    },
    payment_link: true,
    product_cart: [
      {
        product_id: productId,
        amount: amountCents, // Exact dynamic fixed price in cents USD
        quantity: 1,
      },
    ],
    metadata: {
      bid_id: bidId.toString(),
      spot_label: spotLabel,
    },
    return_url: successUrl,
  });

  const paymentUrl = payment.payment_link;
  if (!paymentUrl) {
    throw new Error('No payment URL returned from Dodo Payments');
  }

  return paymentUrl;
}
