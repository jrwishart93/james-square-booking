"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function VotingEntryRedirect() {
  const router = useRouter();

  useEffect(() => {
    const hasAccess = sessionStorage.getItem("owners_secure_access") === "true";

    if (hasAccess) {
      router.replace("/owners/secure/voting");
    } else {
      router.replace("/owners");
    }
  }, [router]);

  return null;
}
