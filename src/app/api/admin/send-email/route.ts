import { NextResponse } from "next/server";
import type {
  DocumentData,
  DocumentSnapshot,
  QueryDocumentSnapshot,
} from "firebase-admin/firestore";
import { adminAuth, adminDb, initAdmin } from "@/lib/firebaseAdmin";
import { renderAdminEmail } from "@/lib/email/renderAdminEmail";
import { sendWithResend } from "@/lib/email/sendWithResend";

export const runtime = "nodejs";

initAdmin();

type RecipientMode = "all" | "owners" | "selected";
type RecipientSelection = {
  mode: RecipientMode;
  userIds?: string[];
};
type AdminEmailRequest = {
  subject: string;
  message: string;
  recipients: RecipientSelection;
};

const MAX_RECIPIENTS_PER_BATCH = 50;

const isOwnerRecord = (data: DocumentData | undefined) => {
  if (!data) return false;
  if (data.residentType === "owner") return true;
  return Boolean(data.roles?.owner);
};

const getEmailsFromDocs = (docs: QueryDocumentSnapshot[]) => {
  const emails = docs
    .map((doc) => doc.data()?.email)
    .filter((value): value is string => typeof value === "string" && value.length > 0);
  return Array.from(new Set(emails));
};

const getEmailsFromSnapshots = (snapshots: DocumentSnapshot[]) => {
  const emails = snapshots
    .map((snap) => snap.data()?.email)
    .filter((value): value is string => typeof value === "string" && value.length > 0);
  return Array.from(new Set(emails));
};

const chunk = <T,>(items: T[], size: number) =>
  Array.from({ length: Math.ceil(items.length / size) }, (_, index) =>
    items.slice(index * size, index * size + size),
  );

export async function POST(req: Request) {
  try {
    const authHeader = req.headers.get("authorization");
    if (!authHeader?.startsWith("Bearer ")) {
      return NextResponse.json({ error: "Unauthorised" }, { status: 401 });
    }

    const token = authHeader.slice("Bearer ".length);
    const decoded = await adminAuth.verifyIdToken(token);

    if (!decoded.admin && !decoded.isAdmin) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
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

    if (!subject || !message) {
      return NextResponse.json(
        { error: "Subject and message are required" },
        { status: 400 },
      );
    }

    let emails: string[] = [];

    if (recipients.mode === "all") {
      const snapshot = await adminDb.collection("users").get();
      emails = getEmailsFromDocs(snapshot.docs);
    } else if (recipients.mode === "owners") {
      const snapshot = await adminDb.collection("users").get();
      emails = getEmailsFromDocs(snapshot.docs.filter((doc) => isOwnerRecord(doc.data())));
    } else if (recipients.mode === "selected") {
      const ids = Array.isArray(recipients.userIds) ? recipients.userIds : [];
      if (ids.length === 0) {
        return NextResponse.json(
          { error: "No selected recipients provided" },
          { status: 400 },
        );
      }

      const refs = ids.map((id) => adminDb.collection("users").doc(id));
      const snapshots = await adminDb.getAll(...refs);
      emails = getEmailsFromSnapshots(snapshots);
    } else {
      return NextResponse.json(
        { error: "Invalid recipient selection" },
        { status: 400 },
      );
    }

    if (emails.length === 0) {
      return NextResponse.json(
        { error: "No recipient emails found" },
        { status: 400 },
      );
    }

    const html = await renderAdminEmail(subject, message);

    const batches = chunk(emails, MAX_RECIPIENTS_PER_BATCH);
    let lastMessageId: string | null = null;

    for (const batch of batches) {
      const data = await sendWithResend({
        to: batch,
        subject,
        html,
      });
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
