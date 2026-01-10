import { Suspense } from "react";
import type { Metadata, Viewport } from "next";
import LoginClient from "./LoginClient";
import PageContainer from "@/components/layout/PageContainer";

export const metadata: Metadata = {
  title: "Login",
  description: "Sign in or register",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
};

export default function LoginPage() {
  return (
    <Suspense fallback={<div />}>
      <PageContainer>
        <LoginClient />
      </PageContainer>
    </Suspense>
  );
}
