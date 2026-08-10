import { Resend } from "resend";

/**
 * SECURITY NOTE:
 * This module must only be used server-side.
 * API keys are read from Vercel environment variables.
 * Do not log or expose process.env values.
 */
if (typeof window !== "undefined") {
  throw new Error("sendWithResend must only be used server-side");
}

function getResendClient() {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) throw new Error("RESEND_API_KEY is not set");
  return new Resend(apiKey);
}

function stripHtml(html: string) {
  return html
    .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, "")
    .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, "")
    .replace(/<[^>]+>/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

export async function sendWithResend(args: {
  from?: string;
  to: string | string[];
  replyTo?: string;
  subject: string;
  html: string;
  text?: string;
  attachments?: { filename: string; content: string }[];
}) {
  const resend = getResendClient();
  const from = args.from ?? process.env.RESEND_FROM_EMAIL;
  if (!from) throw new Error("An email sender is not configured");

  const { error, data } = await resend.emails.send({
    from,
    to: args.to,
    replyTo: args.replyTo,
    subject: args.subject,
    html: args.html,
    text: args.text ?? stripHtml(args.html),
    attachments: args.attachments,
  });

  if (error) throw new Error(error.message);
  return data;
}
