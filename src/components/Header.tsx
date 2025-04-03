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
        className={`block px-3 py-2 rounded-full transition-all ${
          pathname === href ? "bg-black text-white" : "hover:bg-black hover:text-white"
        }`}
        onClick={() => setMenuOpen(false)}
      >
        {label}
      </Link>
    </li>
  );

  return (
    <header className="sticky top-4 z-50 backdrop-blur-sm bg-[rgba(245,241,232,0.9)] text-black px-6 py-4 shadow-md rounded-b-2xl mx-4 transition-all duration-300">
      <nav className="flex justify-between items-center max-w-5xl mx-auto">
        <Link href="/" className="text-2xl font-bold tracking-tight">
          James Square Booking Portal
        </Link>

        {user && (
          <div className="hidden sm:block text-sm text-gray-500 mr-4">
            Welcome, {userName?.split(" ")[0] || "Resident"}
          </div>
        )}

        <button
          className="sm:hidden text-xl z-50"
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
                className="px-3 py-2 rounded-full hover:bg-black hover:text-white transition-all"
              >
                Sign Out
              </button>
            </li>
          ) : (
            navLink("/login", "Sign In")
          )}
        </ul>
      </nav>

      <div
        className={`fixed top-0 right-0 h-full w-64 bg-[rgba(245,241,232,1)] shadow-lg z-40 transform transition-transform duration-300 ease-in-out ${
          menuOpen ? "translate-x-0" : "translate-x-full"
        } sm:hidden`}
      >
        <div className="flex items-center justify-between p-4 border-b border-gray-300">
          <span className="text-lg font-bold">Menu</span>
          <button
            className="text-xl"
            onClick={() => setMenuOpen(false)}
            aria-label="Close Menu"
          >
            ←
          </button>
        </div>
        <ul className="flex flex-col gap-2 p-4 text-sm">
          {navLink("/book", "Book Facilities")}
          {navLink("/local", "Local Suggestions")}
          {user ? (
            <li>
              <button
                onClick={handleSignOut}
                className="px-3 py-2 rounded-full hover:bg-black hover:text-white transition-all text-left w-full"
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
