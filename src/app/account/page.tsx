import type { Metadata, Viewport } from "next";
import AccountPageClient from "./AccountPageClient";
import PageContainer from "@/components/layout/PageContainer";

export const metadata: Metadata = {
  title: "Account",
  description: "Manage your account details",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
};

export default function AccountPage() {
  return (
    <PageContainer>
      <AccountPageClient />
    </PageContainer>
  );
}
