import type { Metadata } from 'next';

import CleaningPageClient from './CleaningPageClient';

const title = 'James Square Cleaning Information';
const description =
  'Cleaning information, weekly cleaning schedule and reporting guidance for residents of James Square, Edinburgh.';

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: '/cleaning' },
  openGraph: {
    title,
    description,
    url: 'https://james-square.com/cleaning',
    siteName: 'James Square',
    type: 'website',
    images: [
      {
        url: '/images/logo/Myreside-JS-image.png',
        width: 1536,
        height: 1024,
        alt: 'James Square cleaning information managed by Myreside Management',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title,
    description,
    images: ['/images/logo/Myreside-JS-image.png'],
  },
};

export default function CleaningPage() {
  return <CleaningPageClient />;
}
