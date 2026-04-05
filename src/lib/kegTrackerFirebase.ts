import { FirebaseApp, getApp, getApps, initializeApp } from 'firebase/app';
import {
  addDoc,
  collection,
  doc,
  getDocs,
  limit,
  query,
  serverTimestamp,
  setDoc,
  updateDoc,
} from 'firebase/firestore';
import { getFirestore } from 'firebase/firestore';
import { B_EFFECT_PRODUCTS, DEFAULT_LOCATIONS } from '@/lib/kegTrackerData';

const kegTrackerFirebaseConfig = {
  apiKey: 'AIzaSyD9-zJ3t7zzzM2k8erIuez_ZFB24BXRDo0',
  authDomain: 'keg-tracker-635ce.firebaseapp.com',
  projectId: 'keg-tracker-635ce',
  storageBucket: 'keg-tracker-635ce.firebasestorage.app',
  messagingSenderId: '94819354072',
  appId: '1:94819354072:web:99bc7c6dc8e6212e455ead',
  measurementId: 'G-4MXK8TFKBV',
};

const APP_NAME = 'keg-tracker-beffect';

const kegTrackerApp: FirebaseApp = getApps().some((item) => item.name === APP_NAME)
  ? getApp(APP_NAME)
  : initializeApp(kegTrackerFirebaseConfig, APP_NAME);

export const kegTrackerDb = getFirestore(kegTrackerApp);

export async function seedKegTrackerCollections(): Promise<void> {
  const productsRef = collection(kegTrackerDb, 'products');
  const productSnapshot = await getDocs(query(productsRef, limit(1)));
  if (productSnapshot.empty) {
    await Promise.all(
      B_EFFECT_PRODUCTS.map((product) =>
        setDoc(doc(productsRef), {
          ...product,
          createdAt: serverTimestamp(),
          brewery: 'b.effect',
        }),
      ),
    );
  }

  const locationsRef = collection(kegTrackerDb, 'locations');
  const locationSnapshot = await getDocs(query(locationsRef, limit(1)));
  if (locationSnapshot.empty) {
    await Promise.all(
      DEFAULT_LOCATIONS.map((name) =>
        setDoc(doc(locationsRef), {
          name,
          type: name === 'Brewery' ? 'brewery' : 'taproom',
          createdAt: serverTimestamp(),
        }),
      ),
    );
  }
}

export type KegRecordPayload = {
  kegId: string;
  qrCode: string;
  currentStatus: string;
  currentLocation: string;
  product?: string;
  batch?: string;
  beerName?: string;
  abv?: number;
  packagingDate?: string;
  bestBeforeDate?: string;
};

export type KegMovementPayload = {
  kegId: string;
  scanType: string;
  fromLocation?: string;
  toLocation?: string;
  product?: string;
  batch?: string;
  notes?: string;
  updatedBy?: string;
};

export async function upsertKegRecord(payload: KegRecordPayload): Promise<void> {
  const kegRef = doc(kegTrackerDb, 'kegs', payload.kegId);
  const stamp = { lastUpdatedAt: serverTimestamp() };

  await setDoc(
    kegRef,
    {
      ...payload,
      ...stamp,
    },
    { merge: true },
  );
}

export async function logKegMovement(payload: KegMovementPayload): Promise<void> {
  await addDoc(collection(kegTrackerDb, 'movements'), {
    ...payload,
    timestamp: serverTimestamp(),
  });
}

export async function addLocation(name: string): Promise<void> {
  await setDoc(doc(collection(kegTrackerDb, 'locations')), {
    name,
    type: 'customer',
    createdAt: serverTimestamp(),
  });
}

export async function touchLocation(name: string): Promise<void> {
  const snap = await getDocs(collection(kegTrackerDb, 'locations'));
  const existing = snap.docs.find((docSnapshot) => docSnapshot.data().name === name);
  if (existing) {
    await updateDoc(existing.ref, { lastUsedAt: serverTimestamp() });
  }
}
