import { Resend } from 'resend';

const resendApiKey = process.env.RESEND_API_KEY;

export const resend = resendApiKey ? new Resend(resendApiKey) : null;

export function getResendFromEmail() {
  const value = process.env.RESEND_FROM_EMAIL;

  if (!value) {
    throw new Error('RESEND_FROM_EMAIL is missing');
  }

  return value;
}

export function getResendReplyToEmail() {
  return process.env.RESEND_REPLY_TO_EMAIL || undefined;
}

type InquiryEmailInput = {
  providerBusinessName: string;
  providerEmail: string;
  adminEmail?: string;
  customerName: string;
  customerEmail: string;
  customerPhone?: string | null;
  message: string;
};

export async function sendInquiryEmails(input: InquiryEmailInput) {
  if (!resend) {
    throw new Error('RESEND_API_KEY is missing');
  }

  const from = getResendFromEmail();
  const replyTo = getResendReplyToEmail();

  const subject = `New inquiry for ${input.providerBusinessName}`;

  const html = `
    <div style="font-family: Arial, sans-serif; line-height: 1.6;">
      <h2>New inquiry received</h2>
      <p><strong>Provider:</strong> ${input.providerBusinessName}</p>
      <p><strong>Customer name:</strong> ${input.customerName}</p>
      <p><strong>Customer email:</strong> ${input.customerEmail}</p>
      <p><strong>Customer phone:</strong> ${input.customerPhone || 'Not provided'}</p>
      <p><strong>Message:</strong></p>
      <div style="padding: 12px; border: 1px solid #ddd; border-radius: 8px;">
        ${input.message.replace(/\n/g, '<br />')}
      </div>
    </div>
  `;

  const recipients = [input.providerEmail];
  if (input.adminEmail) {
    recipients.push(input.adminEmail);
  }

  await resend.emails.send({
    from,
    to: recipients,
    replyTo: replyTo ? [replyTo] : undefined,
    subject,
    html,
  });
}