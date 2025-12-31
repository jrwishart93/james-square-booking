import type { Metadata } from "next";
import HomePageClient from "@/components/home/HomePageClient";

const shareTitle = "James Square";
const shareDescription =
  "A residents’ community website for James Square, Edinburgh, providing shared facilities booking, building information, local guidance, and community updates.";
const shareImage = "https://www.james-square.com/images/james-square-website-photo-link.png";

export const metadata: Metadata = {
  metadataBase: new URL("https://www.james-square.com"),
  title: shareTitle,
  description: shareDescription,
  openGraph: {
    type: "website",
    url: "https://www.james-square.com/",
    title: shareTitle,
    description: shareDescription,
    siteName: "James Square",
    images: [
      {
        url: shareImage,
        width: 1200,
        height: 630,
        alt: shareTitle,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: shareTitle,
    description: shareDescription,
    images: [shareImage],
  },
};

export default function HomePage() {
  return <HomePageClient />;
}
