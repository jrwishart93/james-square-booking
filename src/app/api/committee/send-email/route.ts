import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";
import { Timestamp } from "firebase-admin/firestore";

import { renderAdminEmail } from "@/lib/email/renderAdminEmail";
import { adminAuth, adminDb } from "@/lib/firebaseAdmin";

export const runtime = "nodejs";

type CommitteeEmailRequest = {
  subject: string;
  message: string;
  recipients: string[];
};

const FROM_EMAIL = "committee@james-square.com";
const DAILY_RECIPIENT_LIMIT = 100;
const MAX_RECIPIENTS_PER_BATCH = 50;

const parseBearerToken = (request: NextRequest) => {
  const header = request.headers.get("authorization") ?? "";
  const match = header.match(/^Bearer\s+(.+)$/i);
  return match?.[1];
};

const isValidEmail = (email: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

const escapeHtml = (value: string) =>
  value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/\"/g, "&quot;")
    .replace(/'/g, "&#039;");

const normalizeMessage = (value: string) => {
  const hasHtml = /<[^>]+>/.test(value);
  if (hasHtml) return value;
  return escapeHtml(value).replace(/\r?\n/g, "<br />");
};

const stripHtml = (html: string) =>
  html
    .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, "")
    .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, "")
    .replace(/<[^>]+>/g, "")
    .replace(/\s+/g, " ")
    .trim();

const chunk = <T,>(items: T[], size: number) =>
  Array.from({ length: Math.ceil(items.length / size) }, (_, index) =>
    items.slice(index * size, index * size + size),
  );

const getResendClient = () => {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    throw new Error("RESEND_API_KEY is not set");
  }
  return new Resend(apiKey);
};

const getDailyRecipientCount = async () => {
  const startOfDay = new Date();
  startOfDay.setHours(0, 0, 0, 0);

  const snapshot = await adminDb
    .collection("committeeSentEmails")
    .where("sentAt", ">=", Timestamp.fromDate(startOfDay))
    .get();

  let total = 0;
  snapshot.forEach((doc) => {
    const data = doc.data() as { recipientCount?: number };
    if (typeof data.recipientCount === "number") {
      total += data.recipientCount;
    }
  });

  return total;
};

export async function POST(req: NextRequest) {
  try {
    const token = parseBearerToken(req);
    let senderEmail: string | null = null;

    if (token) {
      try {
        const decoded = await adminAuth.verifyIdToken(token);
        senderEmail = decoded.email ?? null;
      } catch (error) {
        console.error("[committee-email] Failed to verify token", error);
        return NextResponse.json({ error: "Session invalid or expired." }, { status: 401 });
      }
    }

    const body = (await req.json().catch(() => null)) as CommitteeEmailRequest | null;

    if (!body?.subject || !body?.message || !Array.isArray(body.recipients)) {
      return NextResponse.json(
        { error: "Missing subject, message, or recipients." },
        { status: 400 },
      );
    }

    const subject = String(body.subject).trim();
    const message = String(body.message).trim();

    const recipients = Array.from(
      new Set(
        body.recipients
          .map((email) => (typeof email === "string" ? email.trim() : ""))
          .filter(Boolean),
      ),
    );

    if (!subject || !message) {
      return NextResponse.json(
        { error: "Subject and message are required." },
        { status: 400 },
      );
    }

    if (recipients.length === 0) {
      return NextResponse.json({ error: "No recipient emails found." }, { status: 400 });
    }

    const invalidRecipients = recipients.filter((email) => !isValidEmail(email));
    if (invalidRecipients.length > 0) {
      return NextResponse.json(
        { error: "One or more recipient emails are invalid." },
        { status: 400 },
      );
    }

    const dailyRecipientCount = await getDailyRecipientCount();
    if (dailyRecipientCount + recipients.length > DAILY_RECIPIENT_LIMIT) {
      return NextResponse.json(
        {
          error:
            "Daily committee email limit reached. Please try again tomorrow or reduce recipients.",
        },
        { status: 429 },
      );
    }

    const html = await renderAdminEmail(
      subject,
      normalizeMessage(message),
      "Sent on behalf of the James Square committee.",
    );

    const resend = getResendClient();
    const batches = chunk(recipients, MAX_RECIPIENTS_PER_BATCH);
    let lastMessageId: string | null = null;

    for (const batch of batches) {
      const isBulkSend = batch.length > 1 || recipients.length > 1;
      const { error, data } = await resend.emails.send({
        from: FROM_EMAIL,
        to: isBulkSend ? FROM_EMAIL : batch[0],
        bcc: isBulkSend ? batch : undefined,
        subject,
        html,
        text: stripHtml(html),
      });

      if (error) {
        throw new Error(error.message);
      }

      lastMessageId = data?.id ?? lastMessageId;
    }

    await adminDb.collection("committeeSentEmails").add({
      subject,
      sentAt: Timestamp.now(),
      senderEmail,
      recipientCount: recipients.length,
      manualRecipientMode: true,
    });

    return NextResponse.json({
      ok: true,
      id: lastMessageId,
      recipients: recipients.length,
    });
  } catch (err) {
    console.error("Committee email send error:", err);
    const message = err instanceof Error ? err.message : "Failed to send email";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
