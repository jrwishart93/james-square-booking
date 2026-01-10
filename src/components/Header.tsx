'use client';

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { onAuthStateChanged, signOut, User } from "firebase/auth";
import { auth, db } from "@/lib/firebase";
import { collection, doc, getDocs, onSnapshot, query, where, DocumentData, type Timestamp } from "firebase/firestore";
import { motion } from "framer-motion";
import { getUnreadMessageBoardCount } from "@/lib/messageBoardNotifications";
import { lightHaptic } from "@/lib/haptics";

/** Shape of the Firestore user document */
type UserDoc = {
  fullName?: string;
  isAdmin?: boolean;
  email?: string;
  lastSeenMessageBoardAt?: Timestamp;
} & DocumentData;

export default function Header() {
  const pathname = usePathname();
  const [user, setUser] = useState<User | null>(null);
  const [userName, setUserName] = useState<string>("");
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const [open, setOpen] = useState<boolean>(false);
  const [hidden, setHidden] = useState(false);
  const lastScrollY = useRef(0);
  const [lastSeenMessageBoardAt, setLastSeenMessageBoardAt] = useState<Timestamp | null | undefined>(
    undefined
  );
  const [hasUnreadMessageBoard, setHasUnreadMessageBoard] = useState<boolean>(false);

  const handleMenuToggle = () => {
    setOpen((prev) => {
      const next = !prev;
      if (next !== prev) {
        lightHaptic();
      }
      return next;
    });
  };

  const handleMenuClose = () => {
    setOpen((prev) => {
      if (prev) {
        lightHaptic();
      }
      return false;
    });
  };

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (u) => {
      setUser(u);
      if (!u) {
        setUserName("");
        setIsAdmin(false);
        return;
      }
      try {
        const qUsers = query(collection(db, "users"), where("email", "==", u.email));
        const snap = await getDocs(qUsers);
        const docData = snap.docs[0]?.data() as UserDoc | undefined;

        setUserName(docData?.fullName || u.displayName || "");
        setIsAdmin(Boolean(docData?.isAdmin));
      } catch {
        // ignore
      }
    });
    return () => unsub();
  }, []);

  useEffect(() => {
    if (!user) {
      setLastSeenMessageBoardAt(undefined);
      return;
    }

    const userRef = doc(db, "users", user.uid);
    const unsub = onSnapshot(userRef, (snap) => {
      const data = snap.data() as UserDoc | undefined;
      setLastSeenMessageBoardAt(data?.lastSeenMessageBoardAt ?? null);
    });

    return () => unsub();
  }, [user]);

  useEffect(() => {
    let active = true;

    const checkUnread = async () => {
      if (!user) {
        setHasUnreadMessageBoard(false);
        return;
      }

      try {
        const { hasUnread } = await getUnreadMessageBoardCount(user.uid, lastSeenMessageBoardAt);
        if (active) setHasUnreadMessageBoard(hasUnread);
      } catch {
        if (active) setHasUnreadMessageBoard(false);
      }
    };

    void checkUnread();

    return () => {
      active = false;
    };
  }, [user, lastSeenMessageBoardAt]);

  // Close mobile nav on route change
  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  useEffect(() => {
    const onScroll = () => {
      const currentScrollY = window.scrollY;

      if (currentScrollY > lastScrollY.current && currentScrollY > 64) {
        setHidden(true);
      } else {
        setHidden(false);
      }

      lastScrollY.current = currentScrollY;
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  function NavLink({ href, label, showUnread }: { href: string; label: string; showUnread?: boolean }) {
    const active = pathname?.startsWith(href);

    return (
      <li>
        <motion.div
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.98 }}
          className="relative group rounded-xl"
        >
          <Link
            href={href}
            onClick={() => open && setOpen(false)}
            aria-current={active ? "page" : undefined}
            className={[
              "px-3 py-2 rounded-xl transition-colors",
              "hover:bg-white/55 hover:backdrop-blur",
              active ? "bg-white/60 font-semibold" : "bg-transparent"
            ].join(" ")}
          >
            <span className="relative z-10 inline-flex items-center gap-2">
              {label}
              {showUnread ? (
                <>
                  <span
                    className="inline-flex h-2 w-2 rounded-full bg-emerald-400/80 shadow-[0_0_0_3px_rgba(52,211,153,0.15)]"
                    aria-hidden="true"
                  />
                  <span className="sr-only">New message board activity</span>
                </>
              ) : null}
            </span>

            {/* sheen on hover */}
            <span
              className="pointer-events-none absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity"
              aria-hidden="true"
            >
              <span className="absolute -inset-0.5 rounded-xl bg-gradient-to-tr from-white/20 to-white/0" />
            </span>

            {/* underline slide */}
            <span
              className={[
                "pointer-events-none absolute left-3 right-3 -bottom-1 h-[2px] rounded-full",
                active
                  ? "bg-black/60"
                  : "bg-black/30 scale-x-0 group-hover:scale-x-100 origin-left transition-transform"
              ].join(" ")}
              aria-hidden="true"
            />
          </Link>
        </motion.div>
      </li>
    );
  }

  return (
    <div
      className={[
        "header-safe-wrapper",
        "transition-transform duration-300 ease-out",
        hidden ? "-translate-y-full" : "translate-y-0",
        "md:translate-y-0"
      ].join(" ")}
    >
      <div className="site-header-shell">
        <header className="site-header mx-auto max-w-6xl px-4 sm:px-6">
          <div className="flex items-center justify-between px-3 sm:px-4 py-2">
            {/* Brand */}
            <motion.div whileHover={{ scale: 1.02 }} className="nav-logo rounded-xl">
              <Link
                href="/"
                onClick={() => open && setOpen(false)}
                className="flex items-center gap-2 font-semibold tracking-tight rounded-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black/40"
                aria-label="Go to homepage"
              >
                <span className="relative inline-flex items-center justify-center">
                  <Image
                    src="/images/logo/Logo.png"
                    alt="James Square logo"
                    width={36}
                    height={36}
                    priority
                    className="rounded-lg"
                  />
                  <span
                    className="absolute -inset-1 rounded-2xl bg-white/30 blur-md opacity-0 hover:opacity-100 transition-opacity"
                    aria-hidden="true"
                  />
                </span>
                <span className="text-lg sm:text-xl">
                  James <span className="text-slate-500">Square</span>
                </span>
              </Link>
            </motion.div>

            {/* Desktop nav */}
            <nav className="hidden sm:block">
              <ul className="flex items-center gap-2 text-sm">
                <NavLink href="/book" label="Book Facilities" />
                <NavLink href="/dashboard" label="My Dashboard" />
                <NavLink href="/message-board" label="Message Board" showUnread={hasUnreadMessageBoard} />
                {user && <NavLink href="/owners" label="Owners" />}
                <NavLink href="/local" label="Useful Info" />
                {isAdmin && <NavLink href="/admin" label="Admin" />}

                {user ? (
                  <>
                    {userName && (
                      <li className="px-2 py-1 text-slate-600 dark:text-slate-300 hidden md:block">
                        Hi, {userName.split(" ")[0]}
                      </li>
                    )}
                    <li>
                      <motion.button
                        whileHover={{ scale: 1.03 }}
                        whileTap={{ scale: 0.97 }}
                        onClick={() => signOut(auth)}
                        className="px-3 py-2 rounded-xl bg-black/80 text-white hover:bg-black"
                      >
                        Sign Out
                      </motion.button>
                    </li>
                  </>
                ) : (
                  <NavLink href="/login" label="Sign In" />
                )}
              </ul>
            </nav>

            {/* Mobile toggle */}
            <motion.button
              whileTap={{ scale: 0.96 }}
              className="sm:hidden px-3 py-2 rounded-xl bg-white/50"
              aria-expanded={open}
              aria-label="Toggle menu"
              onClick={handleMenuToggle}
            >
              {open ? "Close" : "Menu"}
            </motion.button>
          </div>
        </header>
      </div>

      {/* Mobile sheet */}
      {open && (
        <div className="mt-2 px-4 sm:px-6">
          <div className="glass p-3 sm:hidden">
            <ul className="flex flex-col gap-2">
              <NavLink href="/book" label="Book Facilities" />
              <NavLink href="/dashboard" label="My Dashboard" />
              <NavLink href="/message-board" label="Message Board" showUnread={hasUnreadMessageBoard} />
              {user && <NavLink href="/owners" label="Owners" />}
              <NavLink href="/local" label="Useful Info" />
              {isAdmin && <NavLink href="/admin" label="Admin" />}

              {user ? (
                <>
                  {userName && (
                    <li className="px-2 py-1 text-slate-600 dark:text-slate-300">
                      Hi, {userName.split(" ")[0]}
                    </li>
                  )}
                  <li>
                    <motion.button
                      whileTap={{ scale: 0.97 }}
                      onClick={() => {
                        handleMenuClose();
                        signOut(auth);
                      }}
                      className="w-full px-3 py-2 rounded-xl bg-black/80 text-white hover:bg-black"
                    >
                      Sign Out
                    </motion.button>
                  </li>
                </>
              ) : (
                <NavLink href="/login" label="Sign In" />
              )}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}
