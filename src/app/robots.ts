import type { MetadataRoute } from 'next';

const BASE_URL = 'https://james-square.com';

/**
 * Keeps resident-facing and private areas out of search indexes.
 *
 * This is discouragement rather than access control — a crawler that ignores
 * robots.txt is unaffected, which is why the underlying areas are also protected
 * by Firestore rules, server-side checks and X-Robots-Tag headers.
 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          '/admin',
          '/api/',
          '/committee',
          '/owners',
          '/dashboard',
          '/account',
          '/message-board',
          '/book/my-bookings',
          '/login',
          '/reset-password',
          // Building surveys, AGM minutes and factor reports.
          '/docs/',
        ],
      },
    ],
    sitemap: `${BASE_URL}/sitemap.xml`,
    host: BASE_URL,
  };
}
