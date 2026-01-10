'use client';

import Image from 'next/image';
import { useEffect, useState } from 'react';
import { useAppMode } from '@/hooks/useAppMode';

export default function AppLaunchShell({ children }: { children: React.ReactNode }) {
  const [hydrated, setHydrated] = useState(false);
  const isApp = useAppMode();

  useEffect(() => {
    setHydrated(true);
  }, []);

  useEffect(() => {
    document.body.classList.toggle('app-mode', isApp);
  }, [isApp]);

  return (
    <div className="relative min-h-screen">
      {!hydrated && (
        <div
          className="pointer-events-none absolute inset-0 flex items-center justify-center bg-[#0f172a]"
          aria-hidden="true"
        >
          <Image
            src="/images/icons/JS-app-icon-1024.png"
            alt=""
            width={180}
            height={180}
            priority
            className="h-28 w-28"
          />
        </div>
      )}
      <div className="relative z-10 min-h-screen">{children}</div>
    </div>
  );
}
