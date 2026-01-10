import React, { Suspense } from 'react';
import PageContainer from '@/components/layout/PageContainer';

import BookClient from './BookClient';

export default function HomePage() {
  return (
    <Suspense>
      <PageContainer>
        <BookClient />
      </PageContainer>
    </Suspense>
  );
}
