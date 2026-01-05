"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function OwnersVotingGate() {
  const router = useRouter();

  useEffect(() => {
    const hasAccess =
      typeof window !== "undefined" &&
      sessionStorage.getItem("owners_secure_access") === "true";

    if (hasAccess) {
      router.replace("/owners/secure/voting");
    } else {
      router.replace("/owners/secure");
    }
  }, [router]);

  return null;
}
