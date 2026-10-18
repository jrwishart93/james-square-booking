import type { Metadata } from "next";
import type { ReactNode } from "react";

const title = "Living Here | James Square";
const description =
  "A practical guide for owners and tenants at James Square: key contacts, pool access, parking, bins, parcels, fire safety and what's nearby in Dalry.";

export const metadata: Metadata = {
  title,
  description,
  metadataBase: new URL("https://www.james-square.com"),
  alternates: { canonical: "https://www.james-square.com/local" },
  openGraph: {
    title: "Living at James Square",
    description,
    url: "https://www.james-square.com/local",
    type: "website",
    images: [
      {
        url: "https://www.james-square.com/images/buildingimages/garden.jpg",
        alt: "Illustration of the gardens at James Square",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Living at James Square",
    description,
    images: ["https://www.james-square.com/images/buildingimages/garden.jpg"],
  },
};

export default function LocalLayout({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
