import type { Metadata } from "next";
import type { ReactNode } from "react";

export const metadata: Metadata = {
  title: "Useful Information | James Square",
  description:
    "Local information for residents and visitors to James Square, including updates like our winter waxwing sightings.",
  metadataBase: new URL("https://www.james-square.com"),
  openGraph: {
    title: "Winter Visitors at James Square",
    description: "A rare visit from Bohemian waxwings spotted at James Square.",
    url: "https://www.james-square.com/local#winter-visitors",
    type: "article",
    images: [
      {
        url: "https://www.james-square.com/images/buildingimages/Bird-3.JPG",
        width: 1200,
        height: 630,
        alt: "Bohemian waxwings perched at James Square",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Winter Visitors at James Square",
    description: "A rare visit from Bohemian waxwings spotted at James Square.",
    images: ["https://www.james-square.com/images/buildingimages/Bird-3.JPG"],
  },
};

export default function LocalLayout({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
