'use client';

import React, { Suspense } from 'react';
import SchedulePageClientInner from './SchedulePageClientInner';

export default function SchedulePageClient() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <SchedulePageClientInner />
    </Suspense>
  );
}
