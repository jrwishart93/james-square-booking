'use client';

import React, { Suspense } from 'react';
import SchedulePageClientInner from './SchedulePageClientInner';

function GlassFallback() {
  return (
    <main className="jqs-gradient-bg min-h-screen">
      <div className="max-w-6xl mx-auto py-12 px-4">
        <div className="jqs-glass rounded-2xl p-6">
          <div className="flex items-center gap-3">
            <div className="h-3 w-3 rounded-full animate-pulse bg-black/60 dark:bg-white/70" />
            <p className="text-sm opacity-80">Loading schedule…</p>
          </div>
        </div>
      </div>
    </main>
  );
}

export default function SchedulePageClient() {
  return (
    <Suspense fallback={<GlassFallback />}>
      <SchedulePageClientInner />
    </Suspense>
  );
}