/**
 * Turns whatever the visitor typed into the email address Firebase Auth expects.
 *
 * Usernames are resolved by a server route, because the /users collection is no
 * longer readable from the browser. Returns null when no account matches.
 */
export async function resolveLoginEmail(identifier: string): Promise<string | null> {
  const trimmed = identifier.trim();
  if (!trimmed) return null;
  if (trimmed.includes('@')) return trimmed.toLowerCase();

  const res = await fetch('/api/auth/resolve-identifier', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username: trimmed }),
  });

  if (res.status === 429) {
    throw new Error('Too many attempts. Please wait a few minutes and try again.');
  }

  if (!res.ok) {
    throw new Error('We could not look up that username. Please try your email address.');
  }

  const data = (await res.json()) as { email?: string | null };
  return data.email ?? null;
}
