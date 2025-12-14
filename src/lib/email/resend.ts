import type { ReactElement } from 'react';
import { Resend } from 'resend';

function getResendClient() {
  const apiKey = process.env.RESEND_API_KEY;

  if (!apiKey) {
    throw new Error('RESEND_API_KEY is not set');
  }

  return new Resend(apiKey);
}

type SendAdminEmailPayload = {
  from?: string;
  to: string | string[];
  subject: string;
  html?: string;
  react?: ReactElement;
};

export async function sendAdminEmail({ from, to, subject, html, react }: SendAdminEmailPayload) {
  if (!html && !react) {
    throw new Error('`html` or `react` content is required to send an email');
  }

  const resend = getResendClient();

  return resend.emails.send({
    from: from ?? 'James Square <no-reply@james-square.com>',
    to,
    subject,
    ...(react ? { react } : { html }),
  });
}
