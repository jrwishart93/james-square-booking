'use client';

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { onAuthStateChanged, signOut, User } from "firebase/auth";
import { auth, db } from "@/lib/firebase";
import { collection, getDocs, query, where, DocumentData } from "firebase/firestore";
import { motion } from "framer-motion";

/** Shape of the Firestore user document */
type UserDoc = {
  fullName?: string;
  isAdmin?: boolean;
  email?: string;
} & DocumentData;

export default function Header() {
  const pathname = usePathname();
  const [user, setUser] = useState<User | null>(null);
  const [userName, setUserName] = useState<string>("");
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const [open, setOpen] = useState<boolean>(false);

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

  // Close mobile nav on route change
  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  function NavLink({ href, label }: { href: string; label: string }) {
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
            <span className="relative z-10">{label}</span>

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
    <header className="sticky top-0 z-40">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 py-3">
        <div className="glass border flex items-center justify-between px-3 sm:px-4 py-2">
          {/* Brand */}
          <motion.div whileHover={{ scale: 1.02 }} className="rounded-xl">
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
              <NavLink href="/message-board" label="Message Board" />
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
            onClick={() => setOpen((v) => !v)}
          >
            {open ? "Close" : "Menu"}
          </motion.button>
        </div>

        {/* Mobile sheet */}
        {open && (
          <div className="mt-2 glass p-3 sm:hidden">
            <ul className="flex flex-col gap-2">
              <NavLink href="/book" label="Book Facilities" />
              <NavLink href="/dashboard" label="My Dashboard" />
              <NavLink href="/message-board" label="Message Board" />
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
                        setOpen(false);
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
        )}
      </div>
    </header>
  );
}
