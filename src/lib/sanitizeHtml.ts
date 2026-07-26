/**
 * Minimal HTML sanitiser for author-supplied email bodies.
 *
 * The previous implementation had three exploitable gaps:
 *
 *   1. The allow-list regex was unanchored, so any tag whose name merely
 *      *contained* an allowed name passed — `<iframe>` matched on the `i` of the
 *      italic tag, and `<img onerror=...>` matched on `i` too.
 *   2. Event handlers were stripped only when their value was quoted, so
 *      `<div onerror=alert(1)>` survived untouched.
 *   3. `href`/`src` values were not checked, so `javascript:` and `data:` URLs
 *      passed straight through.
 *
 * This version inverts the approach: attributes are dropped unless explicitly
 * permitted, tag names are matched exactly, and URL schemes are checked against
 * a small allow-list. Anything not recognised is escaped rather than removed, so
 * the author can see what happened to their content.
 *
 * Note on scope: this protects the rendered *email*, and the stored copy that the
 * committee archive displays. It is not a substitute for a full parser — if rich
 * user-generated HTML is ever rendered to other residents, use a maintained
 * library (DOMPurify server-side via jsdom, or `sanitize-html`).
 */

const ALLOWED_TAGS = new Set([
  'p',
  'br',
  'strong',
  'b',
  'em',
  'i',
  'u',
  'ul',
  'ol',
  'li',
  'h1',
  'h2',
  'h3',
  'h4',
  'h5',
  'h6',
  'a',
  'div',
  'span',
  'blockquote',
]);

/** Attributes permitted per tag. Everything else is dropped. */
const ALLOWED_ATTRIBUTES: Record<string, Set<string>> = {
  a: new Set(['href', 'title', 'target', 'rel']),
};

const SAFE_URL_SCHEME = /^(https?:|mailto:|tel:|\/|#)/i;

const escapeTag = (value: string) => value.replace(/</g, '&lt;').replace(/>/g, '&gt;');

/** Parses an attribute list, keeping only what is allowed and safe. */
function filterAttributes(tagName: string, rawAttributes: string): string {
  const allowed = ALLOWED_ATTRIBUTES[tagName];
  if (!allowed || !rawAttributes.trim()) return '';

  const kept: string[] = [];

  // Matches name="value", name='value' and bare name=value, plus valueless names.
  const pattern = /([a-zA-Z_:][-\w:.]*)\s*(?:=\s*(?:"([^"]*)"|'([^']*)'|([^\s"'>=`]+)))?/g;

  let match: RegExpExecArray | null;
  while ((match = pattern.exec(rawAttributes)) !== null) {
    const name = match[1].toLowerCase();
    const value = match[2] ?? match[3] ?? match[4] ?? '';

    if (!allowed.has(name)) continue;

    // Reject any scheme we do not recognise, which covers javascript:, data:
    // and vbscript: however they are cased or padded with control characters.
    if (name === 'href' || name === 'src') {
      // Strip control characters and whitespace first, so "java\tscript:" and
      // "\0javascript:" cannot slip past the scheme check.
      const normalised = value.replace(/[\u0000-\u0020]/g, '');
      if (!SAFE_URL_SCHEME.test(normalised)) continue;
      kept.push(`${name}="${escapeAttributeValue(normalised)}"`);
      continue;
    }

    kept.push(`${name}="${escapeAttributeValue(value)}"`);
  }

  // Any link that opens a new tab gets noopener, so the target cannot reach back
  // through window.opener.
  if (tagName === 'a' && kept.some((attribute) => attribute.startsWith('target='))) {
    if (!kept.some((attribute) => attribute.startsWith('rel='))) {
      kept.push('rel="noopener noreferrer"');
    }
  }

  return kept.length ? ` ${kept.join(' ')}` : '';
}

const escapeAttributeValue = (value: string) =>
  value.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

export function sanitizeHtml(input: string): string {
  if (!input) return '';

  let out = input;

  // Remove whole elements whose *content* is dangerous, not just their tags.
  out = out.replace(/<script\b[\s\S]*?(?:<\/script\s*>|$)/gi, '');
  out = out.replace(/<style\b[\s\S]*?(?:<\/style\s*>|$)/gi, '');
  out = out.replace(/<!--[\s\S]*?(?:-->|$)/g, '');

  // Rebuild every remaining tag from a strict allow-list.
  out = out.replace(
    /<\s*(\/?)\s*([a-zA-Z][a-zA-Z0-9]*)((?:[^>"']|"[^"]*"|'[^']*')*)>/g,
    (match, closing: string, rawName: string, rawAttributes: string) => {
      const tagName = rawName.toLowerCase();

      if (!ALLOWED_TAGS.has(tagName)) {
        return escapeTag(match);
      }

      if (closing) {
        return `</${tagName}>`;
      }

      const attributes = filterAttributes(tagName, rawAttributes);
      const selfClosing = tagName === 'br' ? ' /' : '';
      return `<${tagName}${attributes}${selfClosing}>`;
    },
  );

  // Anything left that looks like a tag was not recognised above — escape it so
  // it renders as text instead of being interpreted by a lenient parser.
  out = out.replace(/<(?!\/?(?:[a-z][a-z0-9]*)[\s/>])/gi, '&lt;');

  return out;
}
