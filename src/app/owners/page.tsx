'use client';

import { useRouter } from 'next/navigation';
import { FormEvent, useState } from 'react';

import { GlassCard } from '@/components/GlassCard';
import GradientBG from '@/components/GradientBG';

const OWNERS_ACCESS_CODE = '3579';
const OWNERS_ACCESS_KEY = 'owners_secure_access';

const OwnersPage = () => {
  const router = useRouter();
  const [accessCode, setAccessCode] = useState('');
  const [showError, setShowError] = useState(false);

  const handleOwnersAccessSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (accessCode === OWNERS_ACCESS_CODE) {
      sessionStorage.setItem(OWNERS_ACCESS_KEY, 'true');
      router.replace('/owners/secure');
      return;
    }

    setShowError(true);
  };

  return (
    <GradientBG className="relative isolate min-h-screen w-screen -ml-[calc((100vw-100%)/2)] -mr-[calc((100vw-100%)/2)] px-4 md:px-8 py-12">
      <div className="relative mx-auto max-w-5xl px-2 sm:px-4 md:px-0 space-y-10">
        <header className="pt-5 md:pt-6 space-y-4 md:space-y-5 text-center md:text-left">
          <h1 className="text-3xl md:text-4xl font-semibold text-neutral-900 dark:text-white">
            Owners Area
          </h1>
          <p className="max-w-3xl text-sm md:text-base text-slate-600 dark:text-slate-300">
            A private space for James Square owners to access secure information and building updates.
          </p>
        </header>

        <div className="space-y-6">
          <GlassCard title="Owners access" titleClassName="text-slate-800/80 dark:text-slate-100/90">
            <p className="text-sm text-slate-700 dark:text-slate-200">A private area for James Square owners.</p>
            <p className="text-sm text-slate-700 dark:text-slate-200">
              This section provides access to secure documents and owners-only updates.
            </p>

            <form className="space-y-3 pt-2" onSubmit={handleOwnersAccessSubmit}>
              <label className="block text-sm font-semibold text-slate-800 dark:text-slate-100">
                Enter owners access code
              </label>
              <div className="flex flex-col gap-3 sm:flex-row">
                <input
                  type="number"
                  inputMode="numeric"
                  placeholder="Access code"
                  value={accessCode}
                  onChange={(event) => {
                    setAccessCode(event.target.value);
                    setShowError(false);
                  }}
                  className="w-full rounded-xl border border-black/10 bg-white/85 px-4 py-2 text-sm font-medium text-slate-900 shadow-sm transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-500 dark:border-white/15 dark:bg-white/20 dark:text-white"
                />
                <button
                  type="submit"
                  className="inline-flex items-center justify-center rounded-full px-5 py-2.5 text-sm font-semibold text-slate-900 bg-white/90 backdrop-blur-lg shadow-[0_6px_18px_rgba(0,0,0,0.08)] border border-black/5 transition-transform transition-shadow duration-200 hover:-translate-y-0.5 hover:scale-[1.01] hover:shadow-[0_10px_28px_rgba(0,0,0,0.12)] active:translate-y-[1px] active:shadow-[0_4px_12px_rgba(0,0,0,0.08)] dark:bg-white/85 dark:text-slate-900 dark:border-white/20"
                >
                  Enter secure area
                </button>
              </div>
            </form>

            {showError && (
              <p className="text-sm text-rose-600 dark:text-rose-300">
                Incorrect access code.
                <br />
                If you’re an owner and don’t have the code, please contact the factor or ask another owner.
              </p>
            )}
          </GlassCard>
        </div>
      </div>
    </GradientBG>
  );
};

export default OwnersPage;
