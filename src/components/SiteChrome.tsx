'use client';

import { usePathname } from 'next/navigation';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export default function SiteChrome({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isGuestRoute = pathname === '/guest' || pathname?.startsWith('/guest/');

  if (isGuestRoute) {
    return <>{children}</>;
  }

  return (
    <>
      <Header />
      <main className="site-content max-w-6xl mx-auto px-4 sm:px-6 py-8">{children}</main>
      <Footer />
    </>
  );
}
