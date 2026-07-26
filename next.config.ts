import type { NextConfig } from "next";
import withPWA from "next-pwa";

/**
 * Content Security Policy.
 *
 * Shipped in **Report-Only** mode deliberately. The policy below is believed to
 * cover everything the site legitimately loads, but a CSP that is even slightly
 * wrong silently breaks pages, and this one cannot be verified against every
 * route from here. Watch the browser console (or wire up `report-uri`) for a
 * week, then promote the header to `Content-Security-Policy` by flipping
 * CSP_ENFORCED below. See finding S-13 in docs/gdpr-audit-2026.md.
 *
 * `'unsafe-inline'` on script-src is required by Next.js's inline hydration
 * bootstrap; removing it needs the nonce-based approach documented in the audit.
 */
const CSP_ENFORCED = false;

const contentSecurityPolicy = [
  "default-src 'self'",
  // 'wasm-unsafe-eval' is needed by the PlayCanvas pool model viewer.
  "script-src 'self' 'unsafe-inline' 'wasm-unsafe-eval'",
  // Tailwind and Framer Motion both set element styles at runtime.
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: blob: https:",
  "font-src 'self' data:",
  "media-src 'self' blob:",
  // Firebase Auth, Firestore (including its streaming transport) and Storage.
  [
    "connect-src 'self'",
    "https://*.googleapis.com",
    "https://*.firebaseio.com",
    "wss://*.firebaseio.com",
    "https://*.cloudfunctions.net",
    "https://firebaseinstallations.googleapis.com",
  ].join(" "),
  // Vimeo player, Google Maps embeds and Microsoft Forms are embedded in places.
  "frame-src 'self' https://player.vimeo.com https://www.google.com https://forms.office.com",
  "worker-src 'self' blob:",
  "manifest-src 'self'",
  "base-uri 'self'",
  "form-action 'self'",
  // Stops any other site from framing James Square (clickjacking).
  "frame-ancestors 'self'",
  "object-src 'none'",
  "upgrade-insecure-requests",
].join("; ");

/** Applied to every response. */
const securityHeaders = [
  // Stop MIME sniffing turning an upload into an executable script.
  { key: "X-Content-Type-Options", value: "nosniff" },
  // Legacy equivalent of frame-ancestors, for older browsers.
  { key: "X-Frame-Options", value: "SAMEORIGIN" },
  // Send the origin, never the full path, to third parties.
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  // Deny device APIs the site has no use for.
  {
    key: "Permissions-Policy",
    value: [
      "camera=()",
      "microphone=()",
      "geolocation=()",
      "payment=()",
      "usb=()",
      "interest-cohort=()",
    ].join(", "),
  },
  // Two years, subdomains included: james-square.com should never be reachable
  // over plain HTTP.
  {
    key: "Strict-Transport-Security",
    value: "max-age=63072000; includeSubDomains; preload",
  },
  // Isolate the browsing context so cross-origin pages cannot poke at ours.
  { key: "Cross-Origin-Opener-Policy", value: "same-origin" },
  { key: "X-DNS-Prefetch-Control", value: "off" },
  {
    key: CSP_ENFORCED ? "Content-Security-Policy" : "Content-Security-Policy-Report-Only",
    value: contentSecurityPolicy,
  },
];

const nextConfig: NextConfig = {
  reactStrictMode: true,
  // Do not advertise the framework version to scanners.
  poweredByHeader: false,
  async headers() {
    return [
      {
        source: "/:path*",
        headers: securityHeaders,
      },
      {
        // Building surveys, AGM minutes and factor reports. These are owner
        // material rather than public documents, so at minimum keep them out of
        // search indexes. Note this is discouragement, not access control — the
        // files are still directly fetchable by URL. See finding P-02.
        source: "/docs/:path*",
        headers: [{ key: "X-Robots-Tag", value: "noindex, nofollow, noarchive" }],
      },
      {
        // Never let a proxy or CDN cache an authenticated API response.
        source: "/api/:path*",
        headers: [
          { key: "Cache-Control", value: "no-store, max-age=0" },
          { key: "X-Robots-Tag", value: "noindex, nofollow" },
        ],
      },
    ];
  },
  async redirects() {
    return [
      {
        source: '/book/pool',
        destination: '/book/schedule?facility=pool',
        permanent: true,
      },
      {
        source: '/book/gym',
        destination: '/book/schedule?facility=gym',
        permanent: true,
      },
      {
        source: '/book/sauna',
        destination: '/book/schedule?facility=sauna',
        permanent: true,
      },
      {
        source: '/useful-info',
        destination: '/local',
        permanent: true,
      },

    ];
  },
};

const withPWAConfig = withPWA({
  dest: "public",
  disable: process.env.NODE_ENV === "development",
});

export default withPWAConfig(nextConfig);
