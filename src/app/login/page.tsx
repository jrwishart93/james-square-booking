import { Suspense } from "react";
import type { Metadata, Viewport } from "next";
import LoginClient from "./LoginClient";

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
      <LoginClient />
    </Suspense>
  );
}
