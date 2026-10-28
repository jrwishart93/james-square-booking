'use client';

import { useId } from 'react';
import { MessageCircle } from 'lucide-react';

import { WhatsAppQrCode } from '@/components/home/communityUpdates';
import { RESIDENTS_WHATSAPP_URL } from '@/lib/community';

const qrLabel = 'QR code that opens the invitation to the James Square residents’ WhatsApp group';

/**
 * Invitation to the residents' WhatsApp group for chatting about the gym.
 * The button is the quickest route on a phone; the QR code is for scanning
 * from a computer or someone else's screen.
 */
export default function WhatsAppInvite() {
  const headingId = useId();
  return (
    <aside
      aria-labelledby={headingId}
      className="rounded-3xl border border-emerald-600/20 bg-gradient-to-br from-emerald-50 to-white p-5 sm:p-6 dark:border-emerald-400/20 dark:from-emerald-950/40 dark:to-slate-900"
    >
      <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:gap-6">
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2.5">
            <span
              aria-hidden="true"
              className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-emerald-600/10 text-emerald-700 dark:text-emerald-300"
            >
              <MessageCircle className="size-5" />
            </span>
            <h3 id={headingId} className="font-semibold text-slate-950 dark:text-white">
              Prefer to chat it through?
            </h3>
          </div>
          <p className="mt-3 text-sm leading-6 text-slate-700 dark:text-slate-300">
            Join the residents’ WhatsApp group to discuss ideas for the gym or offer to help out.
          </p>
          <a
            href={RESIDENTS_WHATSAPP_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-4 inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-xl bg-emerald-700 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-emerald-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-700 sm:w-auto"
          >
            <MessageCircle aria-hidden="true" className="size-4" />
            Join the residents’ WhatsApp group
            <span className="sr-only"> (opens WhatsApp)</span>
          </a>
          <p className="mt-3 text-xs leading-5 text-slate-500 dark:text-slate-400">
            Joining is optional. Other members of a WhatsApp group can see your phone number.
          </p>
        </div>
        <div className="flex shrink-0 flex-col items-center gap-2 border-t border-emerald-600/10 pt-5 sm:border-0 sm:pt-0">
          <WhatsAppQrCode size={128} url={RESIDENTS_WHATSAPP_URL} label={qrLabel} />
          <p className="text-xs text-slate-500 dark:text-slate-400">Scan with your phone</p>
        </div>
      </div>
    </aside>
  );
}
