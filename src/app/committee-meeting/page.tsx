import type { Metadata } from "next";
import QRCode from "qrcode";
import {
  DEFAULT_MEETINGS,
  DEFAULT_WHATSAPP_URL,
  londonToday,
} from "@/lib/committeeMeetings";
import { getPublicHub, withTimeout } from "@/lib/committeeMeetings.server";
import MeetingCommunityHub from "./MeetingCommunityHub";

// Served from Vercel's cache and refreshed in the background at most every
// five minutes, so visitors never wait on the meetings database. The meeting
// list holds no private data; Teams links are only returned by the unlock API.
export const revalidate = 300;

const pageUrl = "https://www.james-square.com/committee-meeting";
const title = "Committee Meetings & Community | James Square";
const description =
  "Meeting agendas, attendance requests and ways to get involved in the James Square community.";
// A 141 KB copy of /images/logo/E7197D9E-8704-47EC-92E2-BC4D9C9506BC.png: the
// 2 MB original is too large for WhatsApp to show as a link preview.
const shareImage = {
  url: "https://www.james-square.com/images/logo/committee-meeting-share.jpg",
  width: 1200,
  height: 800,
  alt: "James Square Committee Meeting: updates, discussions and decisions for our community",
};

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: pageUrl },
  robots: { index: false, follow: false },
  openGraph: {
    title: "James Square Committee Meeting",
    description,
    url: pageUrl,
    siteName: "James Square",
    type: "website",
    images: [shareImage],
  },
  twitter: {
    card: "summary_large_image",
    title: "James Square Committee Meeting",
    description,
    images: [shareImage],
  },
};
export default async function CommitteeMeetingPage() {
  // If the database is slow or unreachable, fall back to the published meetings.
  const hub = await withTimeout(getPublicHub(), 3000).catch(() => ({
    meetings: DEFAULT_MEETINGS,
    whatsappUrl: DEFAULT_WHATSAPP_URL,
  }));
  const qrCode = await QRCode.toDataURL(hub.whatsappUrl, {
    width: 256,
    margin: 4,
    errorCorrectionLevel: "M",
    color: { dark: "#000000", light: "#ffffff" },
  });
  return (
    <MeetingCommunityHub
      hub={hub}
      qrCode={qrCode}
      today={londonToday()}
    />
  );
}
