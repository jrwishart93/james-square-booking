import { NextResponse } from "next/server";
import { Resend } from "resend";

import { renderAdminEmail } from "@/lib/email/renderAdminEmail";

export const runtime = "nodejs";

type RecipientMode = "all" | "owners" | "selected";

type RecipientSelection = {
  mode: RecipientMode;
  emails?: string[];
};

type AdminEmailRequest = {
  subject: string;
  message: string;
  recipients: RecipientSelection;
};

const MAX_RECIPIENTS_PER_BATCH = 50;

const chunk = <T,>(items: T[], size: number) =>
  Array.from({ length: Math.ceil(items.length / size) }, (_, index) =>
    items.slice(index * size, index * size + size),
  );

const stripHtml = (html: string) =>
  html
    .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, "")
    .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, "")
    .replace(/<[^>]+>/g, "")
    .replace(/\s+/g, " ")
    .trim();

const getResendClient = () => {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    throw new Error("RESEND_API_KEY is not set");
  }
  return new Resend(apiKey);
};

const getFromEmail = () => {
  const fromEmail = process.env.RESEND_FROM_EMAIL;
  if (!fromEmail) {
    throw new Error("RESEND_FROM_EMAIL is not set");
  }
  return fromEmail;
};

export async function POST(req: Request) {
  try {
    const body = (await req.json().catch(() => null)) as AdminEmailRequest | null;

    if (!body?.subject || !body?.message || !body?.recipients) {
      return NextResponse.json(
        { error: "Missing subject, message, or recipients" },
        { status: 400 },
      );
    }

    const subject = String(body.subject).trim();
    const message = String(body.message);
    const recipients = body.recipients;

    if (!subject || !message) {
      return NextResponse.json(
        { error: "Subject and message are required" },
        { status: 400 },
      );
    }

    const emails = Array.from(
      new Set(
        (Array.isArray(recipients.emails) ? recipients.emails : [])
          .map((email) => (typeof email === "string" ? email.trim() : ""))
          .filter((email) => email.length > 0),
      ),
    );

    if (emails.length === 0) {
      return NextResponse.json(
        { error: "No recipient emails found" },
        { status: 400 },
      );
    }

    const html = await renderAdminEmail(subject, message);

    const resend = getResendClient();
    const fromEmail = getFromEmail();

    const batches = chunk(emails, MAX_RECIPIENTS_PER_BATCH);
    let lastMessageId: string | null = null;

    for (const batch of batches) {
      const { error, data } = await resend.emails.send({
        from: fromEmail,
        to: batch,
        subject,
        html,
        text: stripHtml(html),
      });

      if (error) {
        throw new Error(error.message);
      }

      lastMessageId = data?.id ?? lastMessageId;
    }

    console.info(
      `Admin email sent to ${emails.length} recipient(s) in ${batches.length} batch(es).`,
    );

    return NextResponse.json({
      ok: true,
      id: lastMessageId,
      recipients: emails.length,
    });
  } catch (err) {
    console.error("Admin email send error:", err);
    const message = err instanceof Error ? err.message : "Failed to send email";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
