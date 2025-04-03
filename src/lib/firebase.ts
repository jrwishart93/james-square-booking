// src/lib/firebase.ts
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyBhSRONShtqjQXVddguXca23ZP_-G1G9oU",
  authDomain: "jamessquarebookings.firebaseapp.com",
  projectId: "jamessquarebookings",
  storageBucket: "jamessquarebookings.appspot.com",
  messagingSenderId: "310610178744",
  appId: "1:310610178744:web:7acfdf5ee86ea54733ba4d",
  measurementId: "G-41P5M1KW90"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app); // ✅ this must be exported
