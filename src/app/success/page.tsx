'use client';

import Link from 'next/link';

export default function SuccessPage() {
  return (
    <main className="text-center mt-32">
      <h1 className="text-3xl font-bold text-green-600 mb-4">🎉 You&apos;re signed in successfully!</h1>
      <p className="text-lg text-gray-700 mb-6">You may now access bookings or return to the home page.</p>
      <Link href="/" className="text-blue-600 underline">
        Go to Home
      </Link>
    </main>
  );
}
