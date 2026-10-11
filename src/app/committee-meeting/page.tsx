import type { Metadata } from "next";
import QRCode from "qrcode";
import {
  DEFAULT_MEETINGS,
  DEFAULT_WHATSAPP_URL,
  londonToday,
} from "@/lib/committeeMeetings";
import { getPublicHub } from "@/lib/committeeMeetings.server";
import MeetingCommunityHub from "./MeetingCommunityHub";

export const dynamic = "force-dynamic";
export const metadata: Metadata = {
  title: "Committee Meetings & Community | James Square",
  description:
    "Meeting agendas, attendance requests and ways to get involved in the James Square community.",
  alternates: { canonical: "https://www.james-square.com/committee-meeting" },
  robots: { index: false, follow: false },
};
export default async function CommitteeMeetingPage() {
  let unavailable = false;
  const hub = await getPublicHub().catch(() => {
    unavailable = true;
    return { meetings: DEFAULT_MEETINGS, whatsappUrl: DEFAULT_WHATSAPP_URL };
  });
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
      unavailable={unavailable}
    />
  );
}
