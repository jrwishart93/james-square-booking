import { NextResponse } from "next/server";
import { sendAdminEmail } from "@/lib/email/resend";
import { getAuth } from "firebase-admin/auth";
import { adminApp } from "@/lib/firebase/admin";

export const runtime = "nodejs";

export async function POST(req: Request) {
  try {
    const authHeader = req.headers.get("authorization");
    if (!authHeader) {
      return NextResponse.json({ error: "Unauthorised" }, { status: 401 });
    }

    const token = authHeader.replace("Bearer ", "");
    const decoded = await getAuth(adminApp).verifyIdToken(token);

    if (!decoded.admin) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const { to, subject, message, attachments } = await req.json();

    if (!to || !subject || !message) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }

    await sendAdminEmail({
      to,
      subject,
      html: message,
      attachments,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Admin email error:", error);
    return NextResponse.json({ error: "Email failed to send" }, { status: 500 });
  }
}
