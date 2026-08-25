"use client";

import { usePathname } from "next/navigation";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { AuthProvider } from "@/context/AuthContext";
import { ConsentProvider, ConsentSurface } from "@/components/consent";

export default function SiteFrame({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isStandaloneInvoice = pathname === "/invoice/HM3W";

  if (isStandaloneInvoice) {
    return (
      <main id="main-content" className="min-h-screen">
        {children}
      </main>
    );
  }

  return (
    <AuthProvider>
      <ConsentProvider>
        <a className="skip-to-content" href="#main-content">
          Skip to main content
        </a>
        <ConsentSurface />
        <Header />
        <main
          className="site-content max-w-6xl mx-auto px-4 sm:px-6 py-8"
          id="main-content"
        >
          {children}
        </main>
        <Footer />
      </ConsentProvider>
    </AuthProvider>
  );
}
