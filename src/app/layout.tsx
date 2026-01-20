// src/app/layout.tsx
import type { Metadata, Viewport } from "next";
import Link from "next/link";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import { AuthProvider } from "@/context/AuthContext";
import AppLaunchShell from "@/components/AppLaunchShell";
import AppModeGate from "@/components/layout/AppModeGate";

const geistSans = Geist({ subsets: ["latin"], variable: "--font-geist-sans" });
const geistMono = Geist_Mono({ subsets: ["latin"], variable: "--font-geist-mono" });

export const metadata: Metadata = {
  title: "James Square",
  description: "Residents community website for James Square, Edinburgh",
  metadataBase: new URL("https://james-square.com"),
  manifest: "/manifest.json",
  themeColor: "#0f172a",
  appleWebApp: {
    capable: true,
    title: "James Square",
    statusBarStyle: "black-translucent",
  },
  openGraph: {
    title: "James Square Booking Portal",
    description: "Residents can book the pool, gym and sauna.",
    url: "https://james-square.com",
    siteName: "James Square",
    images: [{ url: "/images/logo/Logo.png", width: 1200, height: 630, alt: "James Square" }],
    locale: "en_GB",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "James Square Booking Portal",
    description: "Book pool, gym and sauna.",
    images: ["/images/logo/Logo.png"],
  },
  icons: { icon: "/favicon.ico" },
};

// New: proper Next.js viewport export (removes build warnings)
export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  // Adaptive PWA toolbar color for light/dark
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#0b0f14" },
  ],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="apple-touch-icon" href="/images/icons/JS-app-icon-180.png" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-title" content="James Square" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
      </head>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen`}>
        <AppModeGate />
        <AppLaunchShell>
          <AuthProvider>
            <Header />
            <main className="site-content max-w-6xl mx-auto px-4 sm:px-6 py-8">{children}</main>
            <footer className="mt-12 border-t border-slate-200/70 dark:border-slate-800/70">
              <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 text-sm text-slate-600 dark:text-slate-400 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <p className="text-xs sm:text-sm">James Square community website.</p>
                <nav aria-label="Legal" className="flex items-center gap-4">
                  <Link href="/privacy" className="hover:text-slate-900 dark:hover:text-slate-100 transition-colors">
                    Privacy Policy
                  </Link>
                  <Link href="/terms" className="hover:text-slate-900 dark:hover:text-slate-100 transition-colors">
                    Terms of Use
                  </Link>
                </nav>
              </div>
            </footer>
          </AuthProvider>
        </AppLaunchShell>
      </body>
    </html>
  );
}
