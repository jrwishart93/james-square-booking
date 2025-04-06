'use client';

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { onAuthStateChanged, signOut, User } from "firebase/auth";
import { auth, db } from "@/lib/firebase";
import { collection, query, where, getDocs } from "firebase/firestore";

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [userName, setUserName] = useState("");
  const pathname = usePathname();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      if (currentUser?.email) {
        try {
          const q = query(collection(db, "users"), where("email", "==", currentUser.email));
          const snapshot = await getDocs(q);
          const docSnap = snapshot.docs[0];
          if (docSnap?.exists()) {
            const name = docSnap.data().name;
            setUserName(name || "");
          }
        } catch (err) {
          console.error("Error fetching user profile:", err);
        }
      }
    });
    return () => unsubscribe();
  }, []);

  const handleSignOut = async () => {
    await signOut(auth);
    setUser(null);
    setUserName("");
    setMenuOpen(false);
  };

  const navLink = (href: string, label: string) => (
    <li>
      <Link
        href={href}
        className={`block px-4 py-2 rounded-full transition-all ${
          pathname === href
            ? "bg-gray-200 text-black dark:bg-gray-800 dark:text-white"
            : "hover:bg-gray-100 dark:hover:bg-gray-700"
        }`}
        onClick={() => setMenuOpen(false)}
      >
        {label}
      </Link>
    </li>
  );

  return (
    <header className="sticky top-0 z-50 bg-white dark:bg-gray-900 text-black dark:text-white shadow-md">
      <nav className="flex justify-between items-center max-w-5xl mx-auto px-4 py-3">
        <Link href="/" className="text-2xl font-bold tracking-tight">
          James Square Booking Portal
        </Link>
        {user && (
          <div className="hidden sm:block text-sm text-gray-600 dark:text-gray-300 mr-4">
            Welcome, {userName?.split(" ")[0] || "Resident"}
          </div>
        )}
        <button
          className="sm:hidden text-2xl z-50"
          onClick={() => setMenuOpen(true)}
          aria-label="Open Menu"
        >
          ☰
        </button>
        <ul className="hidden sm:flex gap-4 text-sm items-center">
          {navLink("/book", "Book Facilities")}
          {navLink("/local", "Local Suggestions")}
          {user ? (
            <li>
              <button
                onClick={handleSignOut}
                className="px-4 py-2 rounded-full transition-all hover:bg-gray-200 dark:hover:bg-gray-700"
              >
                Sign Out
              </button>
            </li>
          ) : (
            navLink("/login", "Sign In")
          )}
        </ul>
      </nav>

      {/* Mobile Menu Dropdown */}
      <div
        className={`fixed top-0 left-0 w-full h-full bg-white dark:bg-gray-900 text-black dark:text-white z-40 transform transition-transform duration-300 ease-in-out ${
          menuOpen ? "translate-y-0" : "-translate-y-full"
        } sm:hidden`}
      >
        <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
          <span className="text-xl font-bold">Menu</span>
          <button
            className="text-2xl"
            onClick={() => setMenuOpen(false)}
            aria-label="Close Menu"
          >
            ←
          </button>
        </div>
        <ul className="flex flex-col gap-4 p-4 text-lg">
          {navLink("/book", "Book Facilities")}
          {navLink("/local", "Local Suggestions")}
          {user ? (
            <li>
              <button
                onClick={handleSignOut}
                className="w-full text-left px-4 py-2 rounded-full transition-all hover:bg-gray-200 dark:hover:bg-gray-700"
              >
                Sign Out
              </button>
            </li>
          ) : (
            navLink("/login", "Sign In")
          )}
        </ul>
      </div>
    </header>
  );
}
