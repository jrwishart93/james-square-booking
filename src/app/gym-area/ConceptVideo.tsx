'use client';

import { ExternalLink } from 'lucide-react';

import { ConsentGate, useConsent } from '@/components/consent';

const VIDEO_ID = 'OwfcRBhuFEo';
const WATCH_URL = `https://youtube.com/shorts/${VIDEO_ID}`;
// The privacy-enhanced domain: YouTube does not set cookies until the visitor plays.
const EMBED_URL = `https://www.youtube-nocookie.com/embed/${VIDEO_ID}?rel=0&playsinline=1`;

const frame =
  'relative mx-auto aspect-[9/16] w-full max-w-[400px] lg:max-w-[360px] overflow-hidden rounded-3xl border border-slate-200/80 bg-slate-900 shadow-[0_18px_38px_rgba(15,23,42,0.16)] dark:border-white/10';

function VideoPlaceholder() {
  const { openPreferences } = useConsent();

  return (
    <div className={`${frame} flex flex-col items-center justify-center gap-4 p-6 text-center text-white`}>
      <p className="text-base font-semibold">The concept video is hosted on YouTube</p>
      <p className="max-w-xs text-sm leading-relaxed text-slate-300">
        To play it here, allow functional cookies. Nothing is requested from YouTube until you do.
      </p>
      <button className="consent-btn consent-btn--secondary" onClick={openPreferences} type="button">
        Cookie Preferences
      </button>
      <a
        href={WATCH_URL}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex min-h-11 items-center gap-2 text-sm font-medium text-white underline underline-offset-4"
      >
        Watch on YouTube instead
        <ExternalLink aria-hidden="true" className="size-4" />
      </a>
    </div>
  );
}

export default function ConceptVideo() {
  return (
    <ConsentGate category="functional" label="YouTube" fallback={<VideoPlaceholder />}>
      <div className={frame}>
        <iframe
          src={EMBED_URL}
          title="Concept video of the proposed gym relocation, with narration and captions"
          aria-label="Concept video of the proposed gym relocation, with narration and captions"
          className="absolute inset-0 h-full w-full"
          loading="lazy"
          allow="encrypted-media; fullscreen; picture-in-picture; web-share"
          allowFullScreen
          referrerPolicy="strict-origin-when-cross-origin"
        />
      </div>
    </ConsentGate>
  );
}
