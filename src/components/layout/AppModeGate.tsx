"use client";

import { useEffect } from "react";
import { useAppMode } from "@/hooks/useAppMode";

export default function AppModeGate() {
  const isApp = useAppMode();

  useEffect(() => {
    document.body.classList.toggle("app-mode", isApp);
    document.body.setAttribute("data-display-mode", isApp ? "standalone" : "browser");
  }, [isApp]);

  return null;
}
