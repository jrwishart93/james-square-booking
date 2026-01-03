import type { Metadata } from "next";

const shareImageUrl = "https://www.james-square.com/images/james-square-voting-share.png";

export const metadata: Metadata = {
  title: "James Square – Voting",
  description: "Owners community voting for James Square residents.",
  openGraph: {
    title: "James Square – Voting",
    description: "Owners community voting for James Square residents.",
    url: "https://www.james-square.com/owners/voting",
    siteName: "James Square",
    images: [
      {
        url: shareImageUrl,
        width: 1200,
        height: 630,
        alt: "James Square owners community voting",
      },
    ],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "James Square – Voting",
    description: "Owners community voting for James Square residents.",
    images: [shareImageUrl],
  },
};

export default metadata;
