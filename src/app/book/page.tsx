import { Suspense } from 'react';

import BookClient from './BookClient';

export default function BookPage() {
  return (
    <Suspense fallback={null}>
      <BookClient />
    </Suspense>
  );
}
