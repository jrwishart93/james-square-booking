'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useMemo, useState } from 'react';
import { User } from 'firebase/auth';

import { useAuth } from '@/context/AuthContext';

type DashboardTabsProps = {
  user?: User | null;
  isOwner?: boolean;
  isAdmin?: boolean;
};

type TabConfig = {
  label: string;
  href: string;
  requiresOwner?: boolean;
  matchPrefixes?: string[];
};

const tabs: TabConfig[] = [
  { label: 'Dashboard', href: '/dashboard' },
  { label: 'Book Facilities', href: '/book' },
  { label: 'Useful Info', href: '/useful-info', matchPrefixes: ['/useful-info', '/local'] },
  { label: 'Owners', href: '/owners', requiresOwner: true },
  {
    label: 'Voting',
    href: 'https://www.james-square.com/owners/voting',
    matchPrefixes: ['/owners/voting', '/voting'],
  },
];

export default function DashboardTabs({ user: providedUser, isOwner, isAdmin }: DashboardTabsProps) {
  const pathname = usePathname();
  const { user: contextUser } = useAuth();
  const [ownerAccess, setOwnerAccess] = useState<boolean>(Boolean(isOwner));
  const [adminAccess, setAdminAccess] = useState<boolean>(Boolean(isAdmin));
  const user = providedUser ?? contextUser;

  useEffect(() => {
    setOwnerAccess(Boolean(isOwner));
  }, [isOwner]);

  useEffect(() => {
    setAdminAccess(Boolean(isAdmin));
  }, [isAdmin]);

  useEffect(() => {
    let isMounted = true;

    const fetchClaims = async () => {
      if (!user) {
        if (isOwner === undefined) setOwnerAccess(false);
        if (isAdmin === undefined) setAdminAccess(false);
        return;
      }

      try {
        const tokenResult = await user.getIdTokenResult();
        if (!isMounted) return;

        if (isOwner === undefined) {
          setOwnerAccess(Boolean(tokenResult.claims?.owner));
        }
        if (isAdmin === undefined) {
          setAdminAccess(Boolean(tokenResult.claims?.admin || tokenResult.claims?.isAdmin));
        }
      } catch {
        if (!isMounted) return;
        if (isOwner === undefined) setOwnerAccess(false);
        if (isAdmin === undefined) setAdminAccess(false);
      }
    };

    void fetchClaims();

    return () => {
      isMounted = false;
    };
  }, [user, isOwner, isAdmin]);

  const visibleTabs = useMemo(() => {
    const canSeeOwnerTab = ownerAccess || adminAccess;
    return tabs.filter((tab) => !tab.requiresOwner || canSeeOwnerTab);
  }, [adminAccess, ownerAccess]);

  return (
    <nav aria-label="Dashboard navigation" className="mb-6">
      <div className="relative overflow-hidden rounded-2xl border border-white/60 bg-white/80 p-1 shadow-sm backdrop-blur dark:border-white/10 dark:bg-white/5">
        <ul className="flex flex-nowrap items-stretch gap-1 overflow-x-auto pb-1 text-sm font-semibold text-[color:var(--text-secondary)] sm:pb-0">
          {visibleTabs.map((tab) => {
            const prefixes = tab.matchPrefixes ?? [tab.href];
            const isActive = prefixes.some((prefix) => pathname?.startsWith(prefix));

            return (
              <li key={tab.href} className="flex-none">
                <Link
                  href={tab.href}
                  aria-current={isActive ? 'page' : undefined}
                  className={[
                    'group relative inline-flex min-w-[120px] items-center justify-center gap-2 rounded-xl px-4 py-2 transition',
                    'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black/60 dark:focus-visible:outline-white/80',
                    isActive
                      ? 'bg-white text-slate-900 shadow-sm dark:bg-white/10 dark:text-white'
                      : 'text-[color:var(--text-secondary)] hover:text-[color:var(--text-primary)] hover:bg-white/70 dark:hover:bg-white/10',
                  ].join(' ')}
                >
                  <span className="relative z-10 whitespace-nowrap">{tab.label}</span>
                  <span
                    aria-hidden
                    className={[
                      'pointer-events-none absolute inset-x-3 -bottom-1 h-[3px] rounded-full',
                      isActive
                        ? 'bg-gradient-to-r from-indigo-500/90 via-blue-500/90 to-indigo-400/90 dark:from-indigo-300 dark:via-sky-300 dark:to-indigo-300'
                        : 'bg-slate-300/70 dark:bg-white/20 scale-x-0 group-hover:scale-x-100 origin-left transition-transform',
                    ].join(' ')}
                  />
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
    </nav>
  );
}
