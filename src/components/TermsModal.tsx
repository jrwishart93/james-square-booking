'use client';

import Link from 'next/link';
import { useEffect } from 'react';

interface TermsModalProps {
  open: boolean;
  onClose: () => void;
}

export default function TermsModal({ open, onClose }: TermsModalProps) {
  useEffect(() => {
    if (!open) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4"
      role="dialog"
      aria-modal="true"
    >
      <div className="bg-white dark:bg-gray-900 w-full max-w-3xl rounded-lg shadow-xl overflow-hidden max-h-[80vh] flex flex-col">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
            Terms of Use, Data Protection, and Code of Conduct
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 rounded"
            aria-label="Close terms and conduct information"
          >
            ✕
          </button>
        </div>
        <div className="px-6 py-4 overflow-y-auto space-y-4 text-sm text-gray-800 dark:text-gray-200">
          <section className="space-y-2">
            <h3 className="font-semibold text-gray-900 dark:text-gray-100">Terms of Use and Data Protection</h3>
            <p>By creating an account, I confirm that the information I provide is accurate and up to date.</p>
            <p>
              I agree that my personal information will be collected and used in line with UK data protection legislation, including the
              UK GDPR and Data Protection Act 2018. This information will be used solely for the purpose of managing access to the James
              Square website, communicating relevant updates, and enabling features such as facility bookings, voting, and owner communications.
            </p>
            <p>
              I understand that my details will not be shared with third parties except where required by law or where necessary to
              operate the website and its services securely.
            </p>
            <p>
              Users are expected to behave respectfully when using the website and any associated messaging, voting, or communication
              features. Abuse, harassment, threats, or any other inappropriate behaviour will not be tolerated.
            </p>
            <p>
              Any messages or content that are abusive, threatening, or of a criminal nature may be retained and, where appropriate,
              reported to the police or other relevant authorities.
            </p>
            <p>
              Misuse of the website, including providing false information or attempting to interfere with bookings, voting, or access
              controls, may result in an account being restricted, suspended, or removed.
            </p>
          </section>
          <section className="space-y-2">
            <h3 className="font-semibold text-gray-900 dark:text-gray-100">Data Handling</h3>
            <p>
              On successful sign-up, James Square will record that you accepted these terms (including the date and time) alongside your
              account information.
            </p>
            <p className="text-sm text-blue-700 dark:text-blue-300">
              Looking for the full policy? Visit our{' '}
              <Link href="/terms" className="underline hover:no-underline">
                Terms
              </Link>{' '}
              or{' '}
              <Link href="/privacy" className="underline hover:no-underline">
                Privacy
              </Link>{' '}
              pages.
            </p>
          </section>
        </div>
        <div className="px-6 py-4 border-t border-gray-200 dark:border-gray-700 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
