// src/app/layout.tsx
import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import AppLaunchShell from "@/components/AppLaunchShell";
import AppModeGate from "@/components/layout/AppModeGate";
import SiteFrame from "@/components/layout/SiteFrame";

const geistSans = Geist({ subsets: ["latin"], variable: "--font-geist-sans" });
const geistMono = Geist_Mono({ subsets: ["latin"], variable: "--font-geist-mono" });

export const metadata: Metadata = {
  title: "James Square",
  description:
    "Notices, building information and shared facilities for James Square, Caledonian Crescent, Edinburgh.",
  metadataBase: new URL("https://www.james-square.com"),
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    title: "James Square",
    statusBarStyle: "black-translucent",
  },
  openGraph: {
    title: "James Square",
    description:
      "Notices, building information and shared facilities for James Square, Caledonian Crescent, Edinburgh.",
    url: "https://james-square.com",
    siteName: "James Square",
    images: [{ url: "/images/logo/Logo.png", width: 1200, height: 630, alt: "James Square" }],
    locale: "en_GB",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "James Square",
    description:
      "Notices, building information and shared facilities for James Square, Edinburgh.",
    images: ["/images/logo/Logo.png"],
  },
  icons: {
    icon: [
      {
        url: "/images/logo/favicon-dark.png",
        sizes: "512x512",
        type: "image/png",
      },
      {
        url: "/images/logo/favicon-light.png",
        media: "(prefers-color-scheme: light)",
        sizes: "512x512",
        type: "image/png",
      },
      {
        url: "/images/logo/favicon-dark.png",
        media: "(prefers-color-scheme: dark)",
        sizes: "512x512",
        type: "image/png",
      },
    ],
    apple: [
      {
        url: "/images/logo/apple-touch-icon.png",
        sizes: "180x180",
        type: "image/png",
      },
    ],
  },
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
        <link rel="apple-touch-icon" href="/images/logo/apple-touch-icon.png" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-title" content="James Square" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
      </head>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen`}>
        <AppModeGate />
        <AppLaunchShell>
          <SiteFrame>{children}</SiteFrame>
        </AppLaunchShell>
      </body>
    </html>
  );
}
