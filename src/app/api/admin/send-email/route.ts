import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";

import { renderAdminEmail } from "@/lib/email/renderAdminEmail";
import { adminAuth } from "@/lib/firebaseAdmin";

export const runtime = "nodejs";

type RecipientMode = "all" | "owners" | "selected";

type RecipientSelection = {
  mode: RecipientMode;
  emails?: string[];
};

type AdminEmailRequest = {
  subject: string;
  message: string;
  sender?: string;
  recipients: RecipientSelection;
};

const MAX_RECIPIENTS_PER_BATCH = 50;
const DEFAULT_SENDER = "no-reply@james-square.com";
const ALLOWED_SENDERS = new Set([
  "no-reply@james-square.com",
  "committee@james-square.com",
  "support@james-square.com",
]);

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

const parseBearerToken = (request: NextRequest) => {
  const header = request.headers.get("authorization") ?? "";
  const match = header.match(/^Bearer\s+(.+)$/i);
  return match?.[1];
};

const resolveSender = (sender?: string) => {
  const candidate = sender?.trim() || DEFAULT_SENDER;
  if (!ALLOWED_SENDERS.has(candidate)) {
    return null;
  }
  return candidate;
};

export async function POST(req: NextRequest) {
  try {
    const token = parseBearerToken(req);
    if (!token) {
      return NextResponse.json({ error: "Not authenticated." }, { status: 401 });
    }

    let decodedToken;
    try {
      decodedToken = await adminAuth.verifyIdToken(token, true);
    } catch (error) {
      console.error("[admin-email] Failed to verify token", error);
      return NextResponse.json({ error: "Session invalid or expired." }, { status: 401 });
    }

    if (decodedToken.admin !== true && decodedToken.isAdmin !== true) {
      return NextResponse.json({ error: "Admins only." }, { status: 403 });
    }

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
    const sender = resolveSender(body.sender);

    if (!sender) {
      return NextResponse.json({ error: "Invalid sender address" }, { status: 400 });
    }

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

    if (process.env.DISABLE_MASS_EMAILS === "true" && emails.length > 1) {
      return NextResponse.json(
        { error: "Mass emails are currently disabled. Please try again later." },
        { status: 403 },
      );
    }

    const html = await renderAdminEmail(subject, message);

    const resend = getResendClient();

    const batches = chunk(emails, MAX_RECIPIENTS_PER_BATCH);
    let lastMessageId: string | null = null;

    const isBulkSend = emails.length > 1;

    for (const batch of batches) {
      const { error, data } = await resend.emails.send({
        from: `${sender}`,
        to: isBulkSend ? sender : batch,
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

    const emailType =
      recipients.mode === "all" ? "all" : emails.length === 1 ? "single" : "group";

    console.info(
      `Admin email sent to ${emails.length} recipient(s) in ${batches.length} batch(es).`,
    );
    console.info("[admin-email] audit", {
      timestamp: new Date().toISOString(),
      adminUserId: decodedToken.uid,
      sender,
      recipientCount: emails.length,
      emailType,
    });

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
