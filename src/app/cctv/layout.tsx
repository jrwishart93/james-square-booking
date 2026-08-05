import type { Metadata } from 'next';

const title = 'CCTV Review Requests | James Square';
const description =
  'Information about requesting a review of CCTV recordings at James Square and accessing the official CCTV review forms.';

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: 'https://www.james-square.com/cctv' },
  openGraph: {
    title,
    description,
    url: 'https://www.james-square.com/cctv',
    siteName: 'James Square',
    type: 'website',
    images: [
      {
        url: '/images/james-square-website-photo-link.png',
        width: 1200,
        height: 630,
        alt: 'James Square residents community website',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title,
    description,
    images: ['/images/james-square-website-photo-link.png'],
  },
};

export default function CctvLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return children;
}
