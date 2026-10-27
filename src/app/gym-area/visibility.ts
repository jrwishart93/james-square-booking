/**
 * Whether /gym-area is listed publicly.
 *
 * false: shared with owners by direct link only. The page sets robots
 * metadata, next.config sends a matching X-Robots-Tag header, and the page is
 * left out of the sitemap and the main navigation (same pattern as /fior-info).
 *
 * true: listed in the sitemap and open to search engines.
 *
 * Either way anyone with the URL can open the page; this is not access control.
 */
export const PUBLIC_LISTING = false;
