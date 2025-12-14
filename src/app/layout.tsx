// src/app/layout.tsx
import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import { AuthProvider } from "@/context/AuthContext";

const geistSans = Geist({ subsets: ["latin"], variable: "--font-geist-sans" });
const geistMono = Geist_Mono({ subsets: ["latin"], variable: "--font-geist-mono" });

export const metadata: Metadata = {
  title: "James Square Booking Portal",
  description: "Book the pool, gym and sauna at James Square. Residents only.",
  metadataBase: new URL("https://james-square.com"),
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
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen`}>
        <AuthProvider>
          <Header />
          <main className="max-w-6xl mx-auto px-4 sm:px-6 py-8">{children}</main>
        </AuthProvider>
      </body>
    </html>
  );
}