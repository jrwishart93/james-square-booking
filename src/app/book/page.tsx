import React, { Suspense } from 'react';

import BookClient from './BookClient';

export default function HomePage() {
  return (
    <Suspense>
      <BookClient />
    </Suspense>
  );
}
