const USE_REAL_RESEND = !!process.env.RESEND_API_KEY;

interface EmailParams {
  to: string;
  subject: string;
  html: string;
}

async function sendEmail(params: EmailParams): Promise<boolean> {
  if (!USE_REAL_RESEND) {
    console.log(`[Mock Email] To: ${params.to} | Subject: ${params.subject}`);
    return true;
  }

  try {
    const { Resend } = await import('resend');
    const resend = new Resend(process.env.RESEND_API_KEY);
    await resend.emails.send({
      from: 'SpotBid <noreply@spotbid.top>',
      to: params.to,
      subject: params.subject,
      html: params.html,
    });
    return true;
  } catch (error) {
    console.error('[Email Error]', error);
    return false;
  }
}

export async function sendBidConfirmation({
  email,
  name,
  spotLabel,
  amount,
}: {
  email: string;
  name: string;
  spotLabel: string;
  amount: number; // in cents
}) {
  const dollars = (amount / 100).toFixed(2);
  return sendEmail({
    to: email,
    subject: `✅ Your bid of $${dollars} on "${spotLabel}" is live!`,
    html: `
      <div style="font-family: Inter, sans-serif; max-width: 480px; margin: 0 auto; padding: 32px; background: #0a0a0f; color: #fff; border-radius: 16px;">
        <h1 style="font-size: 24px; margin: 0 0 16px;">Your bid is live! 🎉</h1>
        <p style="color: #9ca3af; line-height: 1.6;">Hey ${name},</p>
        <p style="color: #9ca3af; line-height: 1.6;">Your bid of <strong style="color: #22c55e;">$${dollars}</strong> on <strong style="color: #fff;">"${spotLabel}"</strong> is now live on SpotBid.</p>
        <p style="color: #9ca3af; line-height: 1.6;">We'll notify you if someone outbids you.</p>
        <a href="https://spotbid.top" style="display: inline-block; margin-top: 16px; padding: 12px 24px; background: #3b82f6; color: #fff; text-decoration: none; border-radius: 9999px; font-weight: 600;">View the Board →</a>
      </div>
    `,
  });
}

export async function sendOutbidNotification({
  email,
  name,
  spotLabel,
  oldAmount,
  newAmount,
  newBidderName,
}: {
  email: string;
  name: string;
  spotLabel: string;
  oldAmount: number;
  newAmount: number;
  newBidderName: string;
}) {
  const oldDollars = (oldAmount / 100).toFixed(2);
  const newDollars = (newAmount / 100).toFixed(2);
  return sendEmail({
    to: email,
    subject: `🔥 You've been outbid on "${spotLabel}"!`,
    html: `
      <div style="font-family: Inter, sans-serif; max-width: 480px; margin: 0 auto; padding: 32px; background: #0a0a0f; color: #fff; border-radius: 16px;">
        <h1 style="font-size: 24px; margin: 0 0 16px;">You've been outbid! 🔥</h1>
        <p style="color: #9ca3af; line-height: 1.6;">Hey ${name},</p>
        <p style="color: #9ca3af; line-height: 1.6;"><strong style="color: #fff;">${newBidderName}</strong> just outbid you on <strong style="color: #fff;">"${spotLabel}"</strong>.</p>
        <table style="width: 100%; margin: 16px 0; border-collapse: collapse;">
          <tr>
            <td style="color: #9ca3af; padding: 8px 0;">Your bid:</td>
            <td style="text-align: right; color: #ef4444; text-decoration: line-through; padding: 8px 0;">$${oldDollars}</td>
          </tr>
          <tr>
            <td style="color: #9ca3af; padding: 8px 0;">New top bid:</td>
            <td style="text-align: right; color: #22c55e; font-weight: 700; padding: 8px 0;">$${newDollars}</td>
          </tr>
        </table>
        <a href="https://spotbid.top/#spots" style="display: inline-block; margin-top: 16px; padding: 12px 24px; background: #ef4444; color: #fff; text-decoration: none; border-radius: 9999px; font-weight: 600;">Outbid Them Back →</a>
      </div>
    `,
  });
}
