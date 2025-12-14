import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendAdminEmail({
  to,
  subject,
  html,
}: {
  to: string | string[];
  subject: string;
  html: string;
}) {
  if (!process.env.RESEND_API_KEY) {
    throw new Error("RESEND_API_KEY missing");
  }

  return resend.emails.send({
    from: "James Square <no-reply@james-square.com>",
    to,
    subject,
    html,
  });
}
