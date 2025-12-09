import type { Metadata, Viewport } from "next";
import LoginPageClient from "./LoginPageClient";

export const metadata: Metadata = {
  title: "Login",
  description: "Sign in or register",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
};

export default function LoginPage() {
  return <LoginPageClient />;
}
