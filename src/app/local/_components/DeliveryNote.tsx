'use client';

import { useState } from 'react';
import { Check, Copy } from 'lucide-react';
import { secondaryButton } from './ui';

/** Builds a courier instruction from the resident's own address, and copies it. */
export default function DeliveryNote() {
  const [flat, setFlat] = useState('');
  const [copied, setCopied] = useState(false);

  const address = flat.trim() || '[your flat, e.g. 45/3]';
  const note = `Please deliver to the door of flat ${address}, James Square, Caledonian Crescent. Do not leave parcels in the communal foyer or entrance.`;

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(note);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  };

  return (
    <div className="space-y-3">
      <label className="block text-sm font-medium" htmlFor="delivery-flat">
        Your flat number
      </label>
      <input
        id="delivery-flat"
        value={flat}
        onChange={(e) => setFlat(e.target.value.slice(0, 20))}
        placeholder="e.g. 45/3"
        autoComplete="off"
        className="w-full max-w-xs rounded-xl border border-black/10 bg-white/80 px-3 py-2 text-sm outline-none focus:border-neutral-900 focus:ring-2 focus:ring-neutral-900/20 dark:border-white/15 dark:bg-white/10 dark:focus:border-white"
      />
      <blockquote className="rounded-xl border border-dashed border-black/15 bg-white/60 p-3 text-sm dark:border-white/20 dark:bg-white/5">
        {note}
      </blockquote>
      <button type="button" onClick={copy} className={secondaryButton}>
        {copied ? <Check className="h-4 w-4" aria-hidden /> : <Copy className="h-4 w-4" aria-hidden />}
        {copied ? 'Copied' : 'Copy delivery note'}
      </button>
      <span className="sr-only" aria-live="polite">
        {copied ? 'Delivery note copied to clipboard' : ''}
      </span>
    </div>
  );
}
