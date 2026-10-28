'use client';

import { useId } from 'react';
import { MessageCircle } from 'lucide-react';

import ResidentWhatsAppGate from '@/components/community/ResidentWhatsAppGate';

/**
 * Invitation to the residents' WhatsApp group for chatting about the gym. The
 * link and QR code only appear after the resident check.
 */
export default function WhatsAppInvite() {
  const headingId = useId();
  return (
    <aside
      aria-labelledby={headingId}
      className="rounded-3xl border border-emerald-600/20 bg-gradient-to-br from-emerald-50 to-white p-5 sm:p-6 dark:border-emerald-400/20 dark:from-emerald-950/40 dark:to-slate-900"
    >
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
      <div className="mt-4">
        <ResidentWhatsAppGate
          group="residents"
          ctaLabel="Join the residents’ WhatsApp group"
          groupName="the James Square residents’ WhatsApp group"
          qrSize={128}
        />
      </div>
      <p className="mt-3 text-xs leading-5 text-slate-500 dark:text-slate-400">
        Joining is optional. Other members of a WhatsApp group can see your phone number.
      </p>
    </aside>
  );
}
