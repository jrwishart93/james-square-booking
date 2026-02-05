'use client';

const SHOW_ANNOUNCEMENT = true;

export default function AnnouncementNotice() {
  if (!SHOW_ANNOUNCEMENT) {
    return null;
  }

  return (
    <section className="mx-auto max-w-6xl mt-6 sm:mt-8">
      <div className="jqs-glass rounded-2xl border border-white/30 bg-white/60 p-6 shadow-[0_8px_30px_rgba(0,0,0,0.06)] backdrop-blur-xl dark:border-white/10 dark:bg-white/10 sm:p-8">
        <div className="flex flex-col gap-8">
          <div className="flex flex-col gap-4">
            <header className="space-y-1">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-amber-700/80 dark:text-amber-300/90">
                Owner Notice
              </p>
              <h2 className="text-xl font-semibold text-neutral-900 dark:text-neutral-100 sm:text-2xl">
                Update – Appointment of New Factor
              </h2>
            </header>

            <div className="space-y-3 text-sm text-neutral-700 dark:text-neutral-200 sm:text-base">
              <p>
                Following the conclusion of the owner vote, Myreside Property Management received
                the most votes and are now the appointed factor for James Square with effect from 1
                February 2026, replacing Fior Asset &amp; Property.
              </p>
              <p>
                As Myreside are now responsible for the management of the development, owners are
                strongly encouraged to contact Myreside directly as soon as possible to introduce
                themselves and ensure their contact and payment details are up to date. Early
                engagement will help ensure a smooth handover and minimise any disruption during
                the transition.
              </p>
              <p>
                Further information regarding the transition and key dates will continue to be
                published on the website and within the owners’ section.
              </p>
              <p>
                Thank you to everyone who took the time to participate in the voting process.
              </p>
            </div>
          </div>

          <div className="flex flex-col gap-4">
            <header className="space-y-1">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-amber-700/80 dark:text-amber-300/90">
                Owner Notice
              </p>
              <h2 className="text-xl font-semibold text-neutral-900 dark:text-neutral-100 sm:text-2xl">
                Faulty Main Gates
              </h2>
            </header>

            <div className="space-y-3 text-sm text-neutral-700 dark:text-neutral-200 sm:text-base">
              <p>The damage to the main entrance gates has been reported.</p>
              <p>
                The caretaker is aware and is progressing the matter. Contact has been made with
                the relevant company to attend site and carry out repairs.
              </p>
              <p>Further updates will follow.</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
