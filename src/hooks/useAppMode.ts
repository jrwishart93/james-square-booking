"use client";

import { useEffect, useState } from "react";

export function useAppMode() {
  const [isApp, setIsApp] = useState(false);

  useEffect(() => {
    const iosStandalone = (window.navigator as { standalone?: boolean }).standalone === true;
    const standalone = window.matchMedia?.("(display-mode: standalone)")?.matches;
    const fullscreen = window.matchMedia?.("(display-mode: fullscreen)")?.matches;

    setIsApp(Boolean(iosStandalone || standalone || fullscreen));
  }, []);

  return isApp;
}
