'use client';

import { useEffect, useState } from 'react';

import { GlassCard } from '@/components/GlassCard';

type TimedVimeoEmbedProps = {
  videoId: string;
  title: string;
  expiryDate: string;
  aspectRatio?: number;
};

const TimedVimeoEmbed = ({ videoId, title, expiryDate, aspectRatio = 56.25 }: TimedVimeoEmbedProps) => {
  const [isExpired, setIsExpired] = useState(() => {
    const expiryTime = Date.parse(expiryDate);
    return Number.isNaN(expiryTime) ? false : Date.now() >= expiryTime;
  });

  useEffect(() => {
    const expiryTime = Date.parse(expiryDate);
    if (Number.isNaN(expiryTime)) {
      return;
    }

    if (Date.now() >= expiryTime) {
      setIsExpired(true);
      return;
    }

    const timeout = window.setTimeout(() => setIsExpired(true), expiryTime - Date.now());
    return () => window.clearTimeout(timeout);
  }, [expiryDate]);

  return (
    <GlassCard title="Recorded Online Presentation" className="jqs-glass">
      <div className="flex flex-wrap items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">
        <span className="rounded-full border border-slate-200/70 bg-white/80 px-3 py-1 text-[0.65rem] dark:border-white/10 dark:bg-white/10">
          ⏱ Time-limited
        </span>
      </div>
      <p className="text-sm text-slate-600 dark:text-slate-300">
        This presentation was delivered online as part of the factor review process and is provided for reference ahead
        of voting.
      </p>
      {!isExpired ? (
        <div className="space-y-3">
          <div className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white/70 shadow-sm dark:border-white/10 dark:bg-white/5">
            <div className="relative w-full" style={{ paddingTop: `${aspectRatio}%` }}>
              <iframe
                title={title}
                src={`https://player.vimeo.com/video/${videoId}?badge=0&autopause=0&player_id=0&app_id=58479`}
                className="absolute inset-0 h-full w-full"
                allow="autoplay; fullscreen; picture-in-picture; clipboard-write; encrypted-media; web-share"
                referrerPolicy="strict-origin-when-cross-origin"
              />
            </div>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            This recording will be available until 5:00pm on Friday 21 January 2026, after which it will be removed.
          </p>
        </div>
      ) : (
        <p className="text-sm text-slate-700 dark:text-slate-200">
          This recorded presentation is no longer available. Owners are encouraged to refer to the written proposal and
          voting page for further information.
        </p>
      )}
    </GlassCard>
  );
};

export default TimedVimeoEmbed;
