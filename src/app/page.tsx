import type { Metadata } from 'next';
import HomePageClient from './HomePageClient';

const socialImage = 'https://www.james-square.com/images/james-square-website-photo-link.png';
const socialTitle = 'James Square';
const socialDescription = 'Residents community website for James Square, Edinburgh.';

export const metadata: Metadata = {
  title: socialTitle,
  description: socialDescription,
  openGraph: {
    title: socialTitle,
    description: socialDescription,
    url: 'https://www.james-square.com',
    siteName: 'James Square',
    images: [
      {
        url: socialImage,
        width: 1200,
        height: 630,
        alt: 'James Square residents community website',
      },
    ],
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: socialTitle,
    description: socialDescription,
    images: [socialImage],
  },
};

export default function HomePage() {
  return <HomePageClient />;
}
