import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'James Square Guest Guide',
  description: 'Private guest information for visitors staying at James Square, Edinburgh.',
  robots: {
    index: false,
    follow: false,
    nocache: true,
    googleBot: { index: false, follow: false, noimageindex: true, 'max-snippet': -1 },
  },
};

export default function GuestLayout({ children }: { children: React.ReactNode }) {
  return children;
}
