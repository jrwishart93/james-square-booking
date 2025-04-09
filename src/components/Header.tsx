'use client';

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { onAuthStateChanged, signOut, User } from "firebase/auth";
import { auth, db } from "@/lib/firebase";
import { collection, query, where, getDocs } from "firebase/firestore";
import Image from "next/image";

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [userName, setUserName] = useState("");
  const [isAdmin, setIsAdmin] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      if (currentUser?.email) {
        try {
          const q = query(
            collection(db, "users"),
            where("email", "==", currentUser.email)
          );
          const snapshot = await getDocs(q);
          const docSnap = snapshot.docs[0];
          if (docSnap?.exists()) {
            const data = docSnap.data();
            // Change from data.name to data.fullName to display the user's name.
            setUserName(data.fullName || "");
            setIsAdmin(!!data.isAdmin);
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
    setIsAdmin(false);
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
    <header className="sticky top-0 z-50 bg-white text-black shadow-md">
      <nav className="flex justify-between items-center max-w-5xl mx-auto px-4 py-3">
        {/* Logo and Brand Section */}
        <Link href="/" className="flex items-center">
          <Image
            src="/images/logo/Logo.png"
            alt="James Square Logo"
            width={40}
            height={40}
            className="h-10 w-auto mr-3"
          />
          <span className="text-2xl font-sans whitespace-nowrap">
            <span className="text-black font-bold">James</span>
            <span className="text-[#708090]">Square</span>
          </span>
        </Link>

        {/* Welcome message for logged-in user (desktop only) */}
        {user && (
          <div className="hidden sm:block text-sm text-gray-600 mr-4">
            {userName ? `Welcome, ${userName.split(" ")[0]}` : "Welcome"}
          </div>
        )}

        {/* Mobile Menu Toggle Button */}
        <button
          className="sm:hidden text-2xl z-50"
          onClick={() => setMenuOpen(true)}
          aria-label="Open Menu"
        >
          ☰
        </button>

        {/* Desktop Navigation */}
        <ul className="hidden sm:flex gap-4 text-sm items-center">
          {navLink("/book", "Book Facilities")}
          {navLink("/book/my-bookings", "My Bookings")}
          {navLink("/local", "Local Suggestions")}
          {navLink("/factor", "Factor")}
          {isAdmin && navLink("/admin", "Admin")}
          {user ? (
            <li>
              <button
                onClick={handleSignOut}
                className="px-4 py-2 rounded-full transition-all hover:bg-gray-200"
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
        className={`fixed top-0 left-0 w-full h-full bg-white text-black z-40 transform transition-transform duration-300 ease-in-out ${
          menuOpen ? "translate-y-0" : "-translate-y-full"
        } sm:hidden`}
      >
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
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
          {navLink("/book/my-bookings", "My Bookings")}
          {navLink("/local", "Local Suggestions")}
          {navLink("/factor", "Factor")}
          {isAdmin && navLink("/admin", "Admin")}
          {user ? (
            <li>
              <button
                onClick={handleSignOut}
                className="w-full text-left px-4 py-2 rounded-full transition-all hover:bg-gray-200"
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