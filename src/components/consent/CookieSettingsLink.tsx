'use client';

import CookieIcon from './CookieIcon';
import { openCookiePreferences } from './ConsentProvider';

/**
 * The permanent footer entry point. Deliberately not using `useConsent`, so it
 * can sit anywhere in the tree — it dispatches the same event the provider
 * listens for, rather than requiring context.
 */
export default function CookieSettingsLink({
  className,
  showIcon = true,
}: {
  className?: string;
  showIcon?: boolean;
}) {
  return (
    <button className={className} onClick={openCookiePreferences} type="button">
      {showIcon ? <CookieIcon className="h-3.5 w-3.5 shrink-0 md:h-4 md:w-4" /> : null}
      <span className="break-words text-[10px] sm:text-[11px] md:text-sm leading-tight">
        Cookie Settings
      </span>
    </button>
  );
}
