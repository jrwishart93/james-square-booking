"use client";

import dynamic from "next/dynamic";

const LogoutButton = dynamic(() => import("./LogoutButton"), { ssr: false });

export default function ClientOnlyLogout() {
  return <LogoutButton />;
}