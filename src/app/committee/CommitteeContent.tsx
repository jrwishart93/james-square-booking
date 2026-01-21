import CommitteeInboxDemo from './CommitteeInboxDemo';
import InboundEmailFeed from './InboundEmailFeed';
import PreviouslySentEmails, { type SentEmail } from '../../components/committee/PreviouslySentEmails';

const glassCard =
  'jqs-glass rounded-2xl border border-white/20 bg-white/50 dark:bg-white/10 backdrop-blur-xl shadow-[0_8px_30px_rgba(0,0,0,0.08)]';

const egmReminderEmailHtml = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Meeting reminder – James Square</title>
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>

<body style="margin:0; padding:0; background-color:#102a50; font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif; color:#f1f5f9;">

<!-- Preheader (hidden) -->
<div style="display:none; max-height:0; overflow:hidden; opacity:0; mso-hide:all;">
Reminder: EGM Wednesday 21 January 2026 (18:00). Voting opens 20:00 and closes Friday 23 January 2026 (17:00).
</div>

<table width="100%" cellpadding="0" cellspacing="0" role="presentation" style="background-color:#102a50;">
  <tr>
    <td align="center" style="padding:24px 12px;">

      <table width="100%" cellpadding="0" cellspacing="0" role="presentation"
        style="max-width:640px; background-color:#0c2142; border-radius:16px; overflow:hidden;">

        <!-- Header -->
        <tr>
          <td>
            <img src="https://www.james-square.com/images/logo/header-banner-blue.png"
                 width="640" alt="James Square"
                 style="width:100%; display:block; border:0;">
          </td>
        </tr>

        <!-- Title -->
        <tr>
          <td align="center" style="padding:22px 32px 10px;">
            <h1 style="margin:0; font-size:22px; font-weight:600; color:#ffffff;">
              Meeting reminder
            </h1>
            <p style="margin:6px 0 0; font-size:15px; color:#c7d2fe;">
              Extraordinary General Meeting (EGM)
            </p>
          </td>
        </tr>

        <!-- Intro -->
        <tr>
          <td style="padding:20px 32px 10px; font-size:15px; line-height:1.6; color:#e5e7eb;">
            This is a reminder about the upcoming Extraordinary General Meeting (EGM) and the next
            steps regarding the appointment of a new property factor for James Square.
          </td>
        </tr>

        <tr>
          <td style="padding:0 32px 20px; font-size:15px; line-height:1.6; color:#e5e7eb;">
            The purpose of the EGM is to discuss whether owners wish to proceed with a vote to appoint
            Myreside or Newton as the new factor, following Fior’s decision to step down.
          </td>
        </tr>

        <!-- EGM Details -->
        <tr>
          <td style="padding:0 32px 18px;">
            <table width="100%" role="presentation" cellpadding="0" cellspacing="0"
              style="background-color:#0f274f; border-radius:12px;">
              <tr>
                <td style="padding:18px; font-size:14px; line-height:1.7; color:#ffffff;">
                  <table width="100%" role="presentation">
                    <tr>
                      <td width="26"><img src="https://www.james-square.com/images/icons/calendar-days-white.png" width="18" alt=""></td>
                      <td>Date: Wednesday 21 January 2026</td>
                    </tr>
                    <tr>
                      <td width="26"><img src="https://www.james-square.com/images/icons/clock-4-white.png" width="18" alt=""></td>
                      <td>Time: <strong>From 18:00</strong> (UK time)</td>
                    </tr>
                    <tr>
                      <td width="26"><img src="https://www.james-square.com/images/icons/monitor-smartphone-white.png" width="18" alt=""></td>
                      <td>Format: Microsoft Teams (online)</td>
                    </tr>
                    <tr>
                      <td width="26"><img src="https://www.james-square.com/images/icons/users-white.png" width="18" alt=""></td>
                      <td>Audience: James Square owners</td>
                    </tr>
                  </table>
                </td>
              </tr>
            </table>
          </td>
        </tr>

        <!-- Voting -->
        <tr>
          <td style="padding:0 32px 22px;">
            <table width="100%" role="presentation" style="background-color:#0f274f; border-radius:12px;">
              <tr>
                <td style="padding:18px; font-size:14px; line-height:1.7; color:#ffffff;">
                  <table width="100%" role="presentation">
                    <tr>
                      <td width="26"><img src="https://www.james-square.com/images/icons/circle-check-big-white.png" width="18" alt=""></td>
                      <td>
                        Voting will open at <strong>20:00</strong> on Wednesday 21 January 2026 and will close at
                        <strong>17:00</strong> on Friday 23 January 2026.
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>
            </table>
          </td>
        </tr>

        <!-- Image notice -->
        <tr>
          <td style="padding:14px 32px 18px;">
            <table width="100%" role="presentation"
              style="background:#0b1f3f; border-radius:10px; border:1px solid rgba(255,255,255,0.06);">
              <tr>
                <td style="padding:12px 14px; font-size:10.5px; line-height:1.5; color:#9ca3af;">
                  <strong style="color:#cbd5e1;">Image display notice</strong><br><br>
                  Some email clients hide images by default. If images are not visible, please select
                  “Display images” or “Always trust emails from this sender”.
                </td>
              </tr>
            </table>
          </td>
        </tr>

        <!-- Footer -->
        <tr>
          <td style="background:#081a35; padding:22px 24px; font-size:11px; color:#94a3b8;">
            <table width="100%" role="presentation">
              <tr>
                <td>
                  <table role="presentation" cellpadding="0" cellspacing="0">
                    <tr>
                      <td width="18">
                        <a href="mailto:contact@james-square.com">
                          <img src="https://www.james-square.com/images/icons/mail-white.png" width="14" alt="">
                        </a>
                      </td>
                      <td>
                        <a href="mailto:contact@james-square.com" style="color:#c7d2fe; text-decoration:none;">
                          contact@james-square.com
                        </a>
                      </td>
                    </tr>
                    <tr>
                      <td width="18">
                        <a href="https://www.james-square.com">
                          <img src="https://www.james-square.com/images/icons/globe-white.png" width="14" alt="">
                        </a>
                      </td>
                      <td>
                        <a href="https://www.james-square.com" style="color:#c7d2fe; text-decoration:none;">
                          www.james-square.com
                        </a>
                      </td>
                    </tr>
                  </table>

                  <div style="margin-top:10px;">© 2026 James Square</div>
                </td>

                <td align="right">
                  <img src="https://www.james-square.com/images/icons/Logo-white.PNG"
                       width="110" alt="James Square">
                </td>
              </tr>
            </table>
          </td>
        </tr>

        <!-- Unsubscribe (final bottom section) -->
        <tr>
          <td style="background:#07152b; padding:16px 24px; text-align:center;">
            <p style="margin:0 0 10px; font-size:10.5px; line-height:1.5; color:#94a3b8;">
              You are receiving this email because you are registered with the James Square community.
              You can unsubscribe at any time using the button below, or by emailing
              <a href="mailto:support@james-square.com" style="color:#c7d2fe; text-decoration:none;">
                support@james-square.com
              </a>
              and we will remove you from the mailing list.
            </p>

            <a href="mailto:support@james-square.com?subject=Unsubscribe"
               style="display:inline-block; padding:6px 16px; border-radius:999px;
                      border:1px solid rgba(255,255,255,0.18);
                      background:rgba(255,255,255,0.06);
                      color:#cbd5e1; text-decoration:none; font-size:11px; font-weight:600;">
              Unsubscribe
            </a>
          </td>
        </tr>

      </table>
    </td>
  </tr>
</table>

</body>
</html>`;

const sentEmails: SentEmail[] = [
  {
    id: 'egm-reminder-2026-01-20',
    subject: 'Extraordinary General Meeting (EGM) – Reminder – 21/01/2026',
    sentAt: '20 January 2026',
    audience: 'All registered owners',
    html: egmReminderEmailHtml,
  },
];

export default function CommitteeContent() {
  return (
    <main className="mx-auto flex w-full max-w-4xl flex-col gap-8 px-6 py-16 text-[color:var(--text-primary)]">
      <header className="flex flex-col gap-3">
        <div className="flex flex-wrap items-center gap-3">
          <h1 className="text-3xl font-semibold tracking-tight">Committee Area</h1>
          <span className="rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] jqs-glass">
            Private
          </span>
        </div>
        <p className="text-base text-[color:var(--text-muted)]">
          Private workspace for James Square committee members.
        </p>
      </header>

      <section className={`${glassCard} space-y-3 p-6`}>
        <h2 className="text-xl font-semibold">Under construction</h2>
        <p className="text-sm leading-relaxed text-[color:var(--text-muted)]">
          This space is under construction and will be developed in stages. It will be
          used for internal committee discussions, communications, and reference
          material. This page confirms access and intent while the workspace is being
          prepared.
        </p>
      </section>

      <PreviouslySentEmails emails={sentEmails} />

      <section className={`${glassCard} space-y-4 p-6`}>
        <div className="space-y-2">
          <h2 className="text-xl font-semibold">Committee Communications (Coming Soon)</h2>
          <p className="text-sm leading-relaxed text-[color:var(--text-muted)]">
            This section will be used to manage communications between residents and
            the committee in a clear and transparent way.
          </p>
          <p className="text-sm leading-relaxed text-[color:var(--text-muted)]">
            The aim is to allow messages sent to the committee to be tracked, marked as
            actioned or unactioned, and responded to without relying on individual
            inboxes. This helps ensure continuity, visibility, and accountability across
            the committee.
          </p>
          <p className="text-sm leading-relaxed text-[color:var(--text-muted)]">
            This functionality is still being developed and is not yet active.
          </p>
        </div>
        <div className="space-y-2">
          <h3 className="text-sm font-semibold uppercase tracking-[0.2em] text-[color:var(--text-muted)]">
            Planned features
          </h3>
          <ul className="list-disc space-y-2 pl-5 text-sm text-[color:var(--text-muted)]">
            <li>Shared committee inbox (instead of personal emails).</li>
            <li>Clear visibility of incoming messages.</li>
            <li>Status markers (e.g. unactioned / replied).</li>
            <li>Full reply history visible to committee members.</li>
            <li>Ability for multiple committee members to manage communications.</li>
          </ul>
        </div>
      </section>

      <section className={`${glassCard} space-y-4 p-6`}>
        <div className="space-y-2">
          <h2 className="text-lg font-semibold">Inbound messages (email)</h2>
          <p className="text-xs text-[color:var(--text-muted)]">
            Emails sent to the committee address. Internal visibility only.
          </p>
        </div>
        <InboundEmailFeed />
      </section>

      <section className={`${glassCard} p-4 text-xs text-[color:var(--text-muted)]`}>
        This page and its features are under active development. Functionality will be
        introduced gradually once agreed by the committee.
      </section>

      <section className={`${glassCard} space-y-4 p-6`}>
        <div className="space-y-2">
          <h2 className="text-lg font-semibold">Committee email</h2>
          <p className="text-sm text-[color:var(--text-muted)]">
            The committee email exists to centralise communication, reduce reliance on
            individual inboxes, and keep continuity over time.
          </p>
        </div>
        <div className="flex flex-col gap-2">
          <span className="text-xs uppercase tracking-[0.2em] text-[color:var(--text-muted)]">
            Email address
          </span>
          <a
            className="inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold jqs-glass w-fit"
            href="mailto:committee@james-square.com"
          >
            committee@james-square.com
          </a>
        </div>
      </section>

      <section className={`${glassCard} space-y-4 p-6`}>
        <h2 className="text-lg font-semibold">What will live here</h2>
        <ul className="list-disc space-y-2 pl-5 text-sm text-[color:var(--text-muted)]">
          <li>Internal committee discussions.</li>
          <li>Draft communications before sending to residents.</li>
          <li>Reference documents and records.</li>
          <li>Continuity for future committee members.</li>
        </ul>
      </section>

      <p className="text-xs text-[color:var(--text-muted)]">
        Access is currently via passcode. This will move to named committee access in
        due course.
      </p>

      <section className={`${glassCard} p-6`}>
        <CommitteeInboxDemo />
      </section>
    </main>
  );
}
