// src/app/layout.tsx
import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import { AuthProvider } from "@/context/AuthContext";
import AppLaunchShell from "@/components/AppLaunchShell";

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
        <AppLaunchShell>
          <AuthProvider>
            <Header />
            <main className="max-w-6xl mx-auto px-4 sm:px-6 py-8">{children}</main>
          </AuthProvider>
        </AppLaunchShell>
      </body>
    </html>
  );
}
