import { Resend } from "resend";

function getResendClient() {
  const apiKey = process.env.RESEND_API_KEY;

  if (!apiKey) {
    throw new Error("RESEND_API_KEY is not set");
  }

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

export async function sendAdminEmail({
  to,
  subject,
  html,
  attachments,
}: {
  to: string | string[];
  subject: string;
  html: string;
  attachments?: {
    filename: string;
    content: string;
  }[];
}) {
  const resend = getResendClient();

  return resend.emails.send({
    from: "James Square <no-reply@james-square.com>",
    to,
    subject,
    html,
    text: stripHtml(html),
    attachments,
  });
}
