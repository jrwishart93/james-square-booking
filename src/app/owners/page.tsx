'use client';

import { useRouter } from 'next/navigation';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { FormEvent, useState } from 'react';

import { GlassCard } from '@/components/GlassCard';
import GradientBG from '@/components/GradientBG';
import PageContainer from '@/components/layout/PageContainer';

const OWNERS_ACCESS_CODE = '3579';
const OWNERS_ACCESS_KEY = 'owners_secure_access';

const OwnersPage = () => {
  const router = useRouter();
  const prefersReducedMotion = useReducedMotion();
  const [accessCode, setAccessCode] = useState('');
  const [showError, setShowError] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleOwnersAccessSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (accessCode === OWNERS_ACCESS_CODE) {
      sessionStorage.setItem(OWNERS_ACCESS_KEY, 'true');
      setIsSubmitting(true);
      const delay = prefersReducedMotion ? 0 : 250;
      window.setTimeout(() => {
        router.replace('/owners/secure');
      }, delay);
      return;
    }

    setShowError(true);
  };

  return (
    <PageContainer className="max-w-none px-0">
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
          <GlassCard
            title="Owners access"
            titleClassName="text-slate-800/80 dark:text-slate-100/90"
            className="bg-white/80 border-white/80 shadow-[0_18px_45px_rgba(15,23,42,0.08)] dark:bg-slate-900/30"
          >
            <p className="text-sm text-slate-700 dark:text-slate-200">A private area for James Square owners.</p>
            <p className="text-sm text-slate-700 dark:text-slate-200">
              This section provides access to secure documents and owners-only updates.
            </p>
            <div className="space-y-2 pt-2 text-left">
              <p className="text-sm leading-relaxed text-slate-700 dark:text-slate-300">
                Voting is currently open to <strong>owners of James Square</strong>.
              </p>

              <p className="mt-2 text-sm leading-relaxed text-slate-700 dark:text-slate-300">
                To access the voting area, you will need an access code. This code can be obtained by contacting
                committee members or by asking another owner to share the code with you.
              </p>

              <p className="mt-2 text-sm leading-relaxed text-slate-700 dark:text-slate-300">
                The access code will be shared during the upcoming General Special Meeting taking place at{' '}
                <strong>18:00 on 21/01/2026</strong>. Further details will be published shortly.
              </p>

              <p className="mt-2 text-sm leading-relaxed text-slate-700 dark:text-slate-300">
                Any owner without the access code will be provided with the relevant details during this meeting.
              </p>
            </div>

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
                  className="w-full rounded-xl border border-black/10 bg-white/85 px-4 py-2 text-sm font-medium text-slate-900 shadow-sm transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-500/50 focus-visible:border-cyan-500/40 dark:border-white/15 dark:bg-white/20 dark:text-white"
                />
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="inline-flex items-center justify-center rounded-full px-5 py-2.5 text-sm font-semibold text-slate-900 bg-white/90 backdrop-blur-lg shadow-[0_6px_18px_rgba(0,0,0,0.08)] border border-black/5 transition-all duration-200 hover:-translate-y-0.5 hover:scale-[1.01] hover:shadow-[0_10px_28px_rgba(0,0,0,0.12)] active:translate-y-[1px] active:shadow-[0_4px_12px_rgba(0,0,0,0.08)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-500/40 disabled:opacity-70 disabled:cursor-not-allowed dark:bg-white/85 dark:text-slate-900 dark:border-white/20"
                >
                  Enter secure area
                </button>
              </div>
            </form>

            <AnimatePresence>
              {showError && (
                <motion.p
                  initial={{ opacity: 0, y: prefersReducedMotion ? 0 : 4 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: prefersReducedMotion ? 0 : 4 }}
                  transition={{ duration: prefersReducedMotion ? 0 : 0.2, ease: 'easeOut' }}
                  className="text-sm text-rose-600 dark:text-rose-300"
                >
                  Incorrect access code.
                  <br />
                  If you’re an owner and don’t have the code, please contact the factor or ask another owner.
                </motion.p>
              )}
            </AnimatePresence>
          </GlassCard>
        </div>
        </div>
      </GradientBG>
    </PageContainer>
  );
};

export default OwnersPage;
