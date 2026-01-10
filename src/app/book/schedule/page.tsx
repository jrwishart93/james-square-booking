'use client';

import React, { Suspense } from 'react';
import PageContainer from '@/components/layout/PageContainer';
import SchedulePageClientInner from './SchedulePageClientInner';

export default function SchedulePageClient() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <PageContainer className="max-w-none px-0">
        <SchedulePageClientInner />
      </PageContainer>
    </Suspense>
  );
}
