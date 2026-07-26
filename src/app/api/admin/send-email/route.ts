import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";

import { renderAdminEmail } from "@/lib/email/renderAdminEmail";
import { EMAIL_GROUPS, type EmailGroupKey, isEmailGroupKey } from "@/lib/emailGroups";
import { clientKey, rateLimit, tooManyRequests } from "@/lib/security/rateLimit";
import { requireAdmin } from "@/lib/security/requireAuth";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type RecipientMode = "all" | "owners" | "selected" | "custom";

type RecipientSelection = {
  mode: RecipientMode;
  emails?: string[];
};

type AdminEmailRequest = {
  subject: string;
  message: string;
  sender?: string;
  recipients: RecipientSelection;
  cc?: string[];
  bcc?: string[];
  /** Named groups (e.g. "committee") resolved to addresses server-side. */
  groups?: string[];
};

const MAX_RECIPIENTS_PER_BATCH = 50;
const MAX_TOTAL_RECIPIENTS = 500;
const MAX_SUBJECT_LENGTH = 200;
const MAX_MESSAGE_LENGTH = 50_000;
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

const isValidEmail = (email: string) =>
  email.length <= 254 && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

const resolveSender = (sender?: unknown) => {
  if (sender === undefined || sender === null) {
    return DEFAULT_SENDER;
  }

  if (typeof sender !== "string") {
    return null;
  }

  const candidate = sender.trim();
  if (!candidate) {
    return DEFAULT_SENDER;
  }

  return ALLOWED_SENDERS.has(candidate) ? candidate : null;
};

export async function POST(req: NextRequest) {
  try {
    // Throttle before doing any work, so an unauthenticated flood is cheap to shed.
    const limit = rateLimit(clientKey(req, "admin-email"), {
      limit: 10,
      windowMs: 10 * 60_000,
    });
    if (!limit.allowed) {
      return tooManyRequests(limit, "Too many email attempts. Please wait before trying again.");
    }

    // Previously this route verified the caller's token but never checked that
    // they were an admin, so any signed-in resident could send mail from a
    // james-square.com address to any recipient list they chose.
    const auth = await requireAdmin(req);
    if (!auth.ok) return auth.response;
    const decodedToken = auth.token;

    const body = (await req.json().catch(() => null)) as AdminEmailRequest | null;

    if (!body?.subject || !body?.message || !body?.recipients) {
      return NextResponse.json(
        { error: "Missing subject, message, or recipients" },
        { status: 400 },
      );
    }

    const subject = String(body.subject).trim().slice(0, MAX_SUBJECT_LENGTH);
    const message = String(body.message).slice(0, MAX_MESSAGE_LENGTH);
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

    // Named groups are expanded here rather than in the browser, so committee
    // members' personal addresses are never shipped in the client bundle.
    const groupKeys: EmailGroupKey[] = (Array.isArray(body.groups) ? body.groups : []).filter(
      isEmailGroupKey,
    );
    const groupEmails = groupKeys.flatMap((key) => [...EMAIL_GROUPS[key]]);

    const primaryEmails = Array.from(
      new Set(
        [
          ...(Array.isArray(recipients.emails) ? recipients.emails : []),
          ...groupEmails,
        ]
          .map((email) => (typeof email === "string" ? email.trim() : ""))
          .filter((email) => email.length > 0),
      ),
    );

    const ccEmails = Array.from(
      new Set(
        (Array.isArray(body.cc) ? body.cc : [])
          .map((email) => (typeof email === "string" ? email.trim() : ""))
          .filter((email) => email.length > 0),
      ),
    );

    const bccEmails = Array.from(
      new Set(
        (Array.isArray(body.bcc) ? body.bcc : [])
          .map((email) => (typeof email === "string" ? email.trim() : ""))
          .filter((email) => email.length > 0),
      ),
    );

    const emails = Array.from(new Set([...primaryEmails, ...ccEmails, ...bccEmails]));

    if (recipients.mode === "custom") {
      if (primaryEmails.length !== 1) {
        return NextResponse.json(
          { error: "Custom recipient mode requires exactly one email address." },
          { status: 400 },
        );
      }

      if (!isValidEmail(primaryEmails[0] ?? "")) {
        return NextResponse.json(
          { error: "Custom recipient email address is invalid." },
          { status: 400 },
        );
      }
    }

    if (primaryEmails.length === 0 && ccEmails.length === 0 && bccEmails.length === 0) {
      return NextResponse.json(
        { error: "No recipient emails found" },
        { status: 400 },
      );
    }

    if (emails.some((email) => !isValidEmail(email))) {
      return NextResponse.json(
        { error: "One or more recipient email addresses are invalid." },
        { status: 400 },
      );
    }

    // Upper bound on blast radius: a mistake or a compromised admin session
    // cannot turn this endpoint into a bulk mailer.
    if (emails.length > MAX_TOTAL_RECIPIENTS) {
      return NextResponse.json(
        { error: `A single send is limited to ${MAX_TOTAL_RECIPIENTS} recipients.` },
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

    const isBulkSend = primaryEmails.length > 1 || ["all", "owners", "selected"].includes(recipients.mode);
    const batches = isBulkSend ? chunk(emails, MAX_RECIPIENTS_PER_BATCH) : [emails];
    let lastMessageId: string | null = null;

    for (const batch of batches) {
      const { error, data } = await resend.emails.send({
        from: sender,
        to: isBulkSend ? sender : (primaryEmails[0] ?? sender),
        cc: !isBulkSend && ccEmails.length > 0 ? ccEmails : undefined,
        bcc: isBulkSend ? batch : bccEmails.length > 0 ? bccEmails : undefined,
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
      primaryRecipientCount: primaryEmails.length,
      ccRecipientCount: ccEmails.length,
      bccRecipientCount: bccEmails.length,
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
