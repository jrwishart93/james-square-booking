'use client';

import { useEffect, useMemo, useState } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { B_EFFECT_PRODUCTS, DEFAULT_LOCATIONS, RETURN_CONDITIONS, SCAN_TYPES, ScanType } from '@/lib/kegTrackerData';
import {
  addLocation,
  kegTrackerDb,
  logKegMovement,
  seedKegTrackerCollections,
  touchLocation,
  upsertKegRecord,
} from '@/lib/kegTrackerFirebase';

type FormState = {
  scanType: ScanType;
  currentLocation: string;
  nextLocation: string;
  carrier: string;
  product: string;
  brewer: string;
  beerName: string;
  batch: string;
  beerAbv: string;
  packagingDate: string;
  bestBeforeDate: string;
  condition: (typeof RETURN_CONDITIONS)[number];
  notes: string;
  lastKnownLocation: string;
};

const todayIso = () => new Date().toISOString().slice(0, 10);

function addDays(isoDate: string, days: number) {
  const date = new Date(isoDate);
  date.setDate(date.getDate() + days);
  return date.toISOString().slice(0, 10);
}

const INITIAL_FORM_STATE: FormState = {
  scanType: 'Fill',
  currentLocation: 'Brewery',
  nextLocation: '',
  carrier: '',
  product: B_EFFECT_PRODUCTS[0].name,
  brewer: 'b.effect team',
  beerName: B_EFFECT_PRODUCTS[0].name,
  batch: '',
  beerAbv: String(B_EFFECT_PRODUCTS[0].abv),
  packagingDate: todayIso(),
  bestBeforeDate: addDays(todayIso(), 120),
  condition: 'Empty',
  notes: '',
  lastKnownLocation: 'Brewery',
};

const FIELDS_BY_SCAN_TYPE: Record<ScanType, Array<keyof FormState>> = {
  Fill: ['scanType', 'currentLocation', 'product', 'brewer', 'beerName', 'batch', 'beerAbv', 'packagingDate', 'bestBeforeDate'],
  Deliver: ['scanType', 'currentLocation', 'nextLocation', 'carrier'],
  Return: ['scanType', 'currentLocation', 'nextLocation', 'condition'],
  Empty: ['scanType', 'currentLocation', 'notes'],
  Maintenance: ['scanType', 'currentLocation', 'notes'],
  Lost: ['scanType', 'lastKnownLocation', 'notes'],
};

export default function KegTrackerPage() {
  const [form, setForm] = useState<FormState>(INITIAL_FORM_STATE);
  const [locations, setLocations] = useState<string[]>(DEFAULT_LOCATIONS);
  const [scannedCode, setScannedCode] = useState('');
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    const hydrate = async () => {
      await seedKegTrackerCollections();
      const locationSnapshot = await getDocs(collection(kegTrackerDb, 'locations'));
      const locationNames = locationSnapshot.docs
        .map((locationDoc) => String(locationDoc.data().name ?? '').trim())
        .filter(Boolean);

      if (locationNames.length > 0) {
        setLocations(Array.from(new Set(locationNames)));
      }
    };

    hydrate().catch((error) => {
      console.error('Unable to load keg tracker defaults', error);
    });
  }, []);

  const visibleFields = useMemo(() => FIELDS_BY_SCAN_TYPE[form.scanType], [form.scanType]);

  const scanKeg = () => {
    const generated = `BEF-${Math.floor(100000 + Math.random() * 900000)}`;
    setScannedCode(generated);
    setMessage(`Scanned keg barcode: ${generated}`);
  };

  const updateForm = <K extends keyof FormState>(field: K, value: FormState[K]) => {
    setForm((previous) => ({ ...previous, [field]: value }));
  };

  const onScanTypeChange = (scanType: ScanType) => {
    setForm((previous) => ({
      ...previous,
      scanType,
      notes: '',
      nextLocation: '',
      carrier: '',
      condition: 'Empty',
      currentLocation: previous.currentLocation || 'Brewery',
      lastKnownLocation: previous.currentLocation || 'Brewery',
    }));
  };

  const onProductChange = (productName: string) => {
    const selected = B_EFFECT_PRODUCTS.find((product) => product.name === productName);
    setForm((previous) => ({
      ...previous,
      product: productName,
      beerName: productName,
      beerAbv: selected ? String(selected.abv) : previous.beerAbv,
    }));
  };

  const submitScan = async () => {
    if (!scannedCode) {
      setMessage('Please scan a keg barcode first.');
      return;
    }

    if (form.scanType === 'Deliver' || form.scanType === 'Return') {
      if (!form.nextLocation) {
        setMessage('Please choose a next location before submitting.');
        return;
      }
    }

    setSaving(true);
    setMessage('');

    try {
      if (form.nextLocation === '__add_new__') {
        setMessage('Please type a location name to add.');
        setSaving(false);
        return;
      }

      if ((form.scanType === 'Deliver' || form.scanType === 'Return') && form.nextLocation) {
        await touchLocation(form.nextLocation);
      }

      const targetLocation = form.scanType === 'Lost'
        ? form.lastKnownLocation
        : (form.nextLocation || form.currentLocation);

      await upsertKegRecord({
        kegId: scannedCode,
        qrCode: scannedCode,
        currentStatus: form.scanType,
        currentLocation: targetLocation,
        product: form.product || undefined,
        batch: form.batch || undefined,
        beerName: form.beerName || undefined,
        abv: form.beerAbv ? Number(form.beerAbv) : undefined,
        packagingDate: form.packagingDate || undefined,
        bestBeforeDate: form.bestBeforeDate || undefined,
      });

      await logKegMovement({
        kegId: scannedCode,
        scanType: form.scanType,
        fromLocation: form.scanType === 'Lost' ? form.lastKnownLocation : form.currentLocation,
        toLocation: targetLocation,
        product: form.product || undefined,
        batch: form.batch || undefined,
        notes: [form.notes, form.scanType === 'Return' ? `Condition: ${form.condition}` : '']
          .filter(Boolean)
          .join(' | '),
        updatedBy: 'b.effect app',
      });

      setMessage(`Saved ${form.scanType} movement for keg ${scannedCode}.`);
    } catch (error) {
      console.error(error);
      setMessage('Something went wrong saving this movement.');
    } finally {
      setSaving(false);
    }
  };

  const addNewLocation = async () => {
    const value = window.prompt('Add new location');
    if (!value) return;

    const trimmed = value.trim();
    if (!trimmed) return;

    await addLocation(trimmed);
    setLocations((previous) => Array.from(new Set([...previous, trimmed])));
    updateForm('nextLocation', trimmed);
  };

  const rowClass = 'grid grid-cols-[130px_1fr] items-center gap-3 rounded-xl border border-slate-200 bg-white px-3 py-3';
  const labelClass = 'text-sm font-semibold text-slate-700';
  const inputClass = 'w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-800 outline-none focus:ring-2 focus:ring-slate-300';

  return (
    <div className="mx-auto flex min-h-screen w-full max-w-md flex-col bg-gradient-to-b from-slate-50 to-white pb-24">
      <header className="sticky top-0 z-20 border-b border-slate-200 bg-white/90 px-4 py-4 backdrop-blur-xl">
        <h1 className="text-lg font-bold text-slate-900">Scan Keg Barcodes</h1>
        <p className="text-xs font-medium text-slate-500">b.effect brewery • New Zealand</p>
      </header>

      <main className="flex-1 space-y-4 px-4 py-4">
        <button
          onClick={scanKeg}
          className="w-full rounded-2xl bg-slate-900 px-4 py-4 text-base font-semibold text-white shadow-lg shadow-slate-300 transition active:scale-[0.98]"
        >
          Scan
        </button>

        {scannedCode ? <p className="rounded-xl bg-emerald-50 px-3 py-2 text-sm text-emerald-700">{message}</p> : null}

        <section className="space-y-3">
          {visibleFields.includes('scanType') && (
            <div className={rowClass}>
              <label className={labelClass}>Scan Type</label>
              <select
                value={form.scanType}
                onChange={(event) => onScanTypeChange(event.target.value as ScanType)}
                className={inputClass}
              >
                {SCAN_TYPES.map((scanType) => (
                  <option key={scanType} value={scanType}>{scanType}</option>
                ))}
              </select>
            </div>
          )}

          {visibleFields.includes('currentLocation') && (
            <div className={rowClass}>
              <label className={labelClass}>Current Location</label>
              <select value={form.currentLocation} onChange={(event) => updateForm('currentLocation', event.target.value)} className={inputClass}>
                {locations.map((location) => (
                  <option key={location} value={location}>{location}</option>
                ))}
              </select>
            </div>
          )}

          {visibleFields.includes('lastKnownLocation') && (
            <div className={rowClass}>
              <label className={labelClass}>Last Known Location</label>
              <select value={form.lastKnownLocation} onChange={(event) => updateForm('lastKnownLocation', event.target.value)} className={inputClass}>
                {locations.map((location) => (
                  <option key={location} value={location}>{location}</option>
                ))}
              </select>
            </div>
          )}

          {visibleFields.includes('nextLocation') && (
            <div className={rowClass}>
              <label className={labelClass}>Next Location</label>
              <div className="space-y-2">
                <select value={form.nextLocation} onChange={(event) => updateForm('nextLocation', event.target.value)} className={inputClass}>
                  <option value="">Select location</option>
                  {locations.map((location) => (
                    <option key={location} value={location}>{location}</option>
                  ))}
                  <option value="__add_new__">Add new location</option>
                </select>
                {form.nextLocation === '__add_new__' && (
                  <button type="button" onClick={addNewLocation} className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm font-semibold text-slate-700">
                    Add new location
                  </button>
                )}
              </div>
            </div>
          )}

          {visibleFields.includes('product') && (
            <div className={rowClass}>
              <label className={labelClass}>Product</label>
              <select value={form.product} onChange={(event) => onProductChange(event.target.value)} className={inputClass}>
                {B_EFFECT_PRODUCTS.map((product) => (
                  <option key={product.name} value={product.name}>{product.name}</option>
                ))}
              </select>
            </div>
          )}

          {visibleFields.includes('brewer') && (
            <div className={rowClass}>
              <label className={labelClass}>Brewer</label>
              <input value={form.brewer} onChange={(event) => updateForm('brewer', event.target.value)} className={inputClass} />
            </div>
          )}

          {visibleFields.includes('beerName') && (
            <div className={rowClass}>
              <label className={labelClass}>Beer Name</label>
              <input value={form.beerName} onChange={(event) => updateForm('beerName', event.target.value)} className={inputClass} />
            </div>
          )}

          {visibleFields.includes('batch') && (
            <div className={rowClass}>
              <label className={labelClass}>Batch</label>
              <input value={form.batch} onChange={(event) => updateForm('batch', event.target.value)} className={inputClass} placeholder="e.g. 26-APR-A" />
            </div>
          )}

          {visibleFields.includes('beerAbv') && (
            <div className={rowClass}>
              <label className={labelClass}>Beer ABV</label>
              <input value={form.beerAbv} onChange={(event) => updateForm('beerAbv', event.target.value)} className={inputClass} inputMode="decimal" />
            </div>
          )}

          {visibleFields.includes('packagingDate') && (
            <div className={rowClass}>
              <label className={labelClass}>Packaging Date</label>
              <input
                type="date"
                value={form.packagingDate}
                onChange={(event) => {
                  const value = event.target.value;
                  updateForm('packagingDate', value);
                  updateForm('bestBeforeDate', addDays(value, 120));
                }}
                className={inputClass}
              />
            </div>
          )}

          {visibleFields.includes('bestBeforeDate') && (
            <div className={rowClass}>
              <label className={labelClass}>Best Before Date</label>
              <input type="date" value={form.bestBeforeDate} onChange={(event) => updateForm('bestBeforeDate', event.target.value)} className={inputClass} />
            </div>
          )}

          {visibleFields.includes('carrier') && (
            <div className={rowClass}>
              <label className={labelClass}>Carrier</label>
              <input value={form.carrier} onChange={(event) => updateForm('carrier', event.target.value)} className={inputClass} placeholder="Driver / courier" />
            </div>
          )}

          {visibleFields.includes('condition') && (
            <div className={rowClass}>
              <label className={labelClass}>Condition</label>
              <select value={form.condition} onChange={(event) => updateForm('condition', event.target.value as FormState['condition'])} className={inputClass}>
                {RETURN_CONDITIONS.map((condition) => (
                  <option key={condition} value={condition}>{condition}</option>
                ))}
              </select>
            </div>
          )}

          {visibleFields.includes('notes') && (
            <div className={rowClass}>
              <label className={labelClass}>Notes</label>
              <textarea value={form.notes} onChange={(event) => updateForm('notes', event.target.value)} className={inputClass} rows={2} placeholder="Optional notes" />
            </div>
          )}
        </section>

        <button
          onClick={submitScan}
          disabled={saving}
          className="w-full rounded-2xl bg-slate-900 px-4 py-3 text-base font-semibold text-white disabled:opacity-60"
        >
          {saving ? 'Submitting...' : 'Submit'}
        </button>

        {!scannedCode && message ? (
          <p className="rounded-xl bg-amber-50 px-3 py-2 text-sm text-amber-700">{message}</p>
        ) : null}
      </main>

      <footer className="fixed bottom-0 left-0 right-0 border-t border-slate-200 bg-white/95 px-4 py-3 backdrop-blur-xl">
        <nav className="mx-auto grid w-full max-w-md grid-cols-3 gap-2 text-xs font-semibold text-slate-600">
          <button className="rounded-lg bg-slate-900 px-2 py-2 text-white">Scan</button>
          <button className="rounded-lg bg-slate-100 px-2 py-2">History</button>
          <button className="rounded-lg bg-slate-100 px-2 py-2">Settings</button>
        </nav>
      </footer>
    </div>
  );
}
