'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { AlertTriangle } from 'lucide-react';
import FireAction from '@/components/fire-action/FireAction';
import { isNoticeActive, noticeSummaries } from '@/components/home/notices';
import { secondaryButton } from './ui';

/**
 * Mirrors the site-wide pool notice, so this guide never says "book the pool"
 * without also saying it is closed. Edit the notice in notices.tsx, not here.
 */
export function FacilitiesStatus() {
  const [active, setActive] = useState(false);
  const notice = noticeSummaries.find((n) => n.id === 'pool-facilities');

  // Resolved after mount so the server and client markup match on date-gated notices.
  useEffect(() => setActive(Boolean(notice && isNoticeActive(notice))), [notice]);

  if (!active || !notice) return null;
  return (
    <div className="mb-4 flex gap-3 rounded-xl border border-rose-500/40 bg-rose-500/10 p-4 text-sm text-rose-950 dark:text-rose-100">
      <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0" aria-hidden />
      <div>
        <p className="font-semibold">{notice.title}</p>
        <p className="mt-1 opacity-90">{notice.summary}</p>
        <Link href="/updates#pool-facilities" className="mt-2 inline-block font-semibold underline underline-offset-2">
          Read the latest update
        </Link>
      </div>
    </div>
  );
}

export function FireActionBlock() {
  const [open, setOpen] = useState(false);
  return (
    <div className="space-y-4">
      <FireAction showDetails={open} />
      <button type="button" onClick={() => setOpen((v) => !v)} aria-expanded={open} className={secondaryButton}>
        {open ? 'Hide full fire action notice' : 'Show full notice and assembly point'}
      </button>
    </div>
  );
}

/** Old links (shared before the page was reorganised) still land somewhere sensible. */
const LEGACY_HASHES: Record<string, string> = {
  '#winter-visitors': '/stories#winter-visitors',
  '#history': '/stories#history',
  '#local-projects': '/local#projects',
  '#pool-access': '/local#facilities',
  '#factor': '/local#contacts',
  '#caretaker': '/local#contacts',
  '#restaurants': '/local#around',
  '#groceries': '/local#around',
  '#coffee': '/local#around',
};

export function LegacyHashRedirect() {
  const router = useRouter();
  useEffect(() => {
    const target = LEGACY_HASHES[window.location.hash];
    if (!target) return;
    if (target.startsWith('/local#')) {
      document.getElementById(target.slice('/local#'.length))?.scrollIntoView();
      window.history.replaceState(null, '', target);
    } else {
      router.replace(target);
    }
  }, [router]);
  return null;
}
