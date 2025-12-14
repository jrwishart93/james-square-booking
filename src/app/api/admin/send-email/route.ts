import React from 'react';
import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';
import type { DecodedIdToken } from 'firebase-admin/auth';
import { FieldValue } from 'firebase-admin/firestore';

import AdminBroadcastEmail from '@/lib/emails/AdminBroadcastEmail';
import { sanitizeHtml } from '@/lib/sanitizeHtml';
import { adminAuth, adminDb } from '@/lib/firebase-admin';

const FROM = process.env.EMAIL_FROM || 'James Square <no-reply@example.com>';

function stripHtml(html: string) {
  return html
    .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '')
    .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '')
    .replace(/<[^>]+>/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}

type AdminClaims = DecodedIdToken & { isAdmin?: boolean };

type EmailPayload = {
  to: string[];
  subject: string;
  bodyHtml: string;
};

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as EmailPayload;
    const authHeader = req.headers.get('authorization') || '';
    const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : null;
    if (!token) {
      return NextResponse.json({ error: 'Missing auth token' }, { status: 401 });
    }

    const decoded: DecodedIdToken = await adminAuth.verifyIdToken(token);
    const claims = decoded as AdminClaims;
    const uid = decoded.uid;

    const isAdmin = claims.isAdmin === true;
    if (!isAdmin) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    if (!process.env.RESEND_API_KEY) {
      console.warn('RESEND_API_KEY missing – email sending is temporarily disabled.');

      return NextResponse.json(
        {
          ok: false,
          message: 'Email sending temporarily disabled (no API key provided).',
          bodyReceived: body,
        },
        { status: 200 },
      );
    }

    const { to, subject, bodyHtml } = body;

    if (!Array.isArray(to) || to.length === 0) {
      return NextResponse.json({ error: '`to` must be a non-empty array' }, { status: 400 });
    }
    if (!subject || !String(subject).trim()) {
      return NextResponse.json({ error: '`subject` is required' }, { status: 400 });
    }
    if (!bodyHtml || !String(bodyHtml).trim()) {
      return NextResponse.json({ error: '`bodyHtml` is required' }, { status: 400 });
    }

    const safeHtml = sanitizeHtml(bodyHtml);

    const resend = new Resend(process.env.RESEND_API_KEY);

    const { data, error } = await resend.emails.send({
      from: FROM,
      to,
      subject,
      react: React.createElement(AdminBroadcastEmail, { subject, bodyHtml: safeHtml }),
      text: stripHtml(safeHtml),
    });

    if (error) {
      try {
        await adminDb.collection('adminEmails').add({
          uid,
          to,
          subject,
          bodyHtml: safeHtml,
          success: false,
          error: String((error as Error)?.message || error),
          createdAt: FieldValue.serverTimestamp(),
        });
      } catch {
        /* ignore log failure */
      }
      return NextResponse.json({ error: String((error as Error)?.message || error) }, { status: 500 });
    }

    try {
      await adminDb.collection('adminEmails').add({
        uid,
        to,
        subject,
        bodyHtml: safeHtml,
        success: true,
        providerId: data?.id ?? null,
        createdAt: FieldValue.serverTimestamp(),
      });
    } catch {
      /* ignore log failure */
    }

    return NextResponse.json({ ok: true, id: data?.id ?? null });
  } catch (e: unknown) {
    const message = e instanceof Error ? e.message : 'Unexpected error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
