'use client';

/**
 * A small cookie mark drawn to sit alongside the site's other line icons —
 * 1.5 stroke, rounded caps, no fill. The crumbs drift very slightly (see
 * .consent-icon) which stops the panel feeling static without demanding
 * attention.
 */
export default function CookieIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
    >
      <path d="M21 12a9 9 0 1 1-9-9 3.6 3.6 0 0 0 3.6 3.6A2.4 2.4 0 0 0 18 9a3 3 0 0 0 3 3Z" />
      <g className="consent-icon">
        <path d="M8.5 9.5h.01" />
        <path d="M12 14h.01" />
        <path d="M7.5 14.5h.01" />
        <path d="M15.5 15.5h.01" />
        <path d="M11 10.5h.01" />
      </g>
    </svg>
  );
}
