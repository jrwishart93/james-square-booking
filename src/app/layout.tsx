import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/context/AuthContext"; // 👈 add this line

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "James Square Booking Portal",
  description: "Facilities Booking at James Square",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased bg-[#f5f1e8] text-black`}>
        <AuthProvider>
          <header className="bg-gray-800 text-white p-4">
            <nav className="flex justify-between max-w-5xl mx-auto">
              <span className="font-semibold text-xl">James Square</span>
              <ul className="flex gap-4 text-sm items-center">
                <li><a href="/book" className="hover:underline">Book Facilities</a></li>
                <li><a href="/local" className="hover:underline">Local Suggestions</a></li>
              </ul>
            </nav>
          </header>

          <main className="max-w-5xl mx-auto p-4">
            {children}
          </main>
        </AuthProvider>
      </body>
    </html>
  );
}
