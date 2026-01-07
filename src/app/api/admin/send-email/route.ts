import { NextResponse } from "next/server";
import { getAuth } from "firebase-admin/auth";
import { initAdmin } from "@/lib/firebaseAdmin";
import { renderAdminEmail } from "@/lib/email/renderAdminEmail";
import { sendWithResend } from "@/lib/email/sendWithResend";

export const runtime = "nodejs";

initAdmin();

type AttachmentPayload = {
  filename: string;
  content: string;
};

export async function POST(req: Request) {
  try {
    const authHeader = req.headers.get("authorization");
    if (!authHeader?.startsWith("Bearer ")) {
      return NextResponse.json({ error: "Unauthorised" }, { status: 401 });
    }

    const token = authHeader.slice("Bearer ".length);
    const decoded = await getAuth().verifyIdToken(token);

    if (!decoded.admin && !decoded.isAdmin) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const body = (await req.json().catch(() => null)) as null | {
      to: string | string[];
      subject: string;
      message: string;
      attachments?: AttachmentPayload[];
    };

    if (!body?.to || !body?.subject || !body?.message) {
      return NextResponse.json(
        { error: "Missing to, subject, or message" },
        { status: 400 },
      );
    }

    const subject = String(body.subject).trim();
    const message = String(body.message);

    const html = await renderAdminEmail(subject, message);

    const attachments = (body.attachments ?? [])
      .slice(0, 5)
      .map((a) => ({
        filename: String(a.filename || "attachment"),
        content: String(a.content || ""),
      }))
      .filter((a) => a.content.length > 0);

    for (const a of attachments) {
      if (a.content.length > 7_000_000) {
        return NextResponse.json(
          { error: `Attachment too large: ${a.filename}` },
          { status: 400 },
        );
      }
    }

    const data = await sendWithResend({
      to: body.to,
      subject,
      html,
      attachments: attachments.length ? attachments : undefined,
    });

    return NextResponse.json({ ok: true, id: data?.id ?? null });
  } catch (err) {
    console.error("Admin email send error:", err);
    const message = err instanceof Error ? err.message : "Failed to send email";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
