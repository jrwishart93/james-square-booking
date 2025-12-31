import type { Metadata } from "next";
import HomePageClient from "./HomePageClient";

export const metadata: Metadata = {
  title: "James Square",
  description:
    "A residents’ community website for James Square, Edinburgh, providing shared facilities booking, building information, local guidance, and community updates.",
  openGraph: {
    type: "website",
    url: "https://www.james-square.com/",
    title: "James Square",
    description:
      "A residents’ community website for James Square, Edinburgh, providing shared facilities booking, building information, local guidance, and community updates.",
    siteName: "James Square",
    images: ["https://www.james-square.com/images/james-square-website-photo-link.png"],
  },
  twitter: {
    card: "summary_large_image",
    title: "James Square",
    description:
      "A residents’ community website for James Square, Edinburgh, providing shared facilities booking, building information, local guidance, and community updates.",
    images: ["https://www.james-square.com/images/james-square-website-photo-link.png"],
  },
};

export default function HomePage() {
  return <HomePageClient />;
}
