'use client';

import { useEffect, useState } from 'react';

export function useAppMode() {
  const [isApp, setIsApp] = useState(false);

  useEffect(() => {
    const isStandalone =
      window.matchMedia('(display-mode: standalone)').matches ||
      (window.navigator as { standalone?: boolean }).standalone === true;

    setIsApp(isStandalone);
  }, []);

  return isApp;
}
