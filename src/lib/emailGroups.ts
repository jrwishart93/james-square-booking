import 'server-only';

/**
 * Named mailing groups.
 *
 * `server-only` is load-bearing here: these are committee members' and the
 * factor's personal email addresses, and this module was previously imported by
 * a client component, which published every address in the JavaScript bundle
 * served to anonymous visitors. The import now fails the build if that happens
 * again.
 *
 * Group membership reaches the browser only through /api/admin/email-groups,
 * which requires a verified administrator.
 */
export const EMAIL_GROUPS = {
  committee: [
    'derekp19@gmail.com',
    'prworks22@aol.com',
    'agnesdcw@icloud.com',
    'derek.turnbull568@btinternet.com',
    'm.trusson@outlook.com',
    'Jrwishart@hotmail.co.uk',
  ],
  myreside: [
    'leigh@myreside-management.co.uk',
    'cory@myreside-management.co.uk',
  ],
} as const;

export type EmailGroupKey = keyof typeof EMAIL_GROUPS;

export const EMAIL_GROUP_KEYS = Object.keys(EMAIL_GROUPS) as EmailGroupKey[];

export function isEmailGroupKey(value: unknown): value is EmailGroupKey {
  return typeof value === 'string' && (EMAIL_GROUP_KEYS as string[]).includes(value);
}

/** Sizes only — safe to expose without revealing addresses. */
export function emailGroupCounts(): Record<EmailGroupKey, number> {
  return EMAIL_GROUP_KEYS.reduce(
    (acc, key) => {
      acc[key] = EMAIL_GROUPS[key].length;
      return acc;
    },
    {} as Record<EmailGroupKey, number>,
  );
}
