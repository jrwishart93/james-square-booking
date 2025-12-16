'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { onAuthStateChanged, signOut, User } from 'firebase/auth';
import { auth, db } from '@/lib/firebase';
import { doc, getDoc, serverTimestamp, setDoc } from 'firebase/firestore';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  logout: async () => {}, // default noop
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const ensureUserDoc = async (firebaseUser: User) => {
    const ref = doc(db, 'users', firebaseUser.uid);
    const snap = await getDoc(ref);

    if (!snap.exists()) {
      await setDoc(
        ref,
        {
          email: firebaseUser.email ?? '',
          residentType: 'unknown',
          residentTypeLabel: 'Unknown',
          createdAt: serverTimestamp(),
        },
        { merge: true }
      );
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser);

      if (firebaseUser) {
        ensureUserDoc(firebaseUser)
          .catch((error) => console.error('Failed to ensure user document', error))
          .finally(() => setLoading(false));
      } else {
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);

  const logout = () => signOut(auth);

  return (
    <AuthContext.Provider value={{ user, loading, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
