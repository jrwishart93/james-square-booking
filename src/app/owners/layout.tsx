import type { Metadata } from "next";
import type { ReactNode } from "react";

export const metadata: Metadata = {
  openGraph: {
    images: [],
  },
  twitter: {
    images: [],
  },
};

export default function OwnersLayout({ children }: { children: ReactNode }) {
  return children;
}
