import 'server-only';

/**
 * Small in-process rate limiter for API routes and Server Actions.
 *
 * Deliberately dependency-free. On a serverless platform each instance keeps its
 * own counters, so this is a throttle rather than a hard guarantee — it stops
 * scripted brute-forcing of passcodes and mail endpoints, which is what it is
 * for. Anything needing a strict global limit should use the Firestore-backed
 * counter pattern already used for the committee mail daily cap.
 */

type Bucket = { count: number; resetAt: number };

const buckets = new Map<string, Bucket>();
let lastSweep = Date.now();

/** Drop expired buckets occasionally so the map cannot grow without bound. */
function sweep(now: number) {
  if (now - lastSweep < 60_000) return;
  lastSweep = now;
  for (const [key, bucket] of buckets) {
    if (bucket.resetAt <= now) buckets.delete(key);
  }
}

export type RateLimitResult = {
  allowed: boolean;
  remaining: number;
  /** Seconds until the window resets — suitable for a Retry-After header. */
  retryAfter: number;
};

export function rateLimit(
  key: string,
  options: { limit: number; windowMs: number },
): RateLimitResult {
  const now = Date.now();
  sweep(now);

  const existing = buckets.get(key);

  if (!existing || existing.resetAt <= now) {
    buckets.set(key, { count: 1, resetAt: now + options.windowMs });
    return { allowed: true, remaining: options.limit - 1, retryAfter: 0 };
  }

  existing.count += 1;
  const retryAfter = Math.max(1, Math.ceil((existing.resetAt - now) / 1000));

  if (existing.count > options.limit) {
    return { allowed: false, remaining: 0, retryAfter };
  }

  return { allowed: true, remaining: options.limit - existing.count, retryAfter };
}

/**
 * Best-effort client identifier. Vercel and most proxies set x-forwarded-for;
 * we take the left-most entry, which is the closest thing to the real client.
 *
 * The value is used only as an in-memory throttle key and is never stored, so no
 * IP address is retained beyond the length of the rate-limit window.
 */
export function clientKey(request: Request, scope: string): string {
  const forwarded = request.headers.get('x-forwarded-for') ?? '';
  const realIp = request.headers.get('x-real-ip') ?? '';
  const ip = forwarded.split(',')[0]?.trim() || realIp || 'unknown';
  return `${scope}:${ip}`;
}

/** Standard 429 response with the headers a well-behaved client expects. */
export function tooManyRequests(result: RateLimitResult, message?: string): Response {
  return new Response(
    JSON.stringify({
      error: message ?? 'Too many requests. Please wait a moment and try again.',
    }),
    {
      status: 429,
      headers: {
        'Content-Type': 'application/json',
        'Retry-After': String(result.retryAfter),
      },
    },
  );
}
