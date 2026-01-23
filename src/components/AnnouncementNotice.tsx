'use client';

const SHOW_ANNOUNCEMENT = true;

export default function AnnouncementNotice() {
  if (!SHOW_ANNOUNCEMENT) {
    return null;
  }

  return (
    <section className="mx-auto max-w-6xl mt-6 sm:mt-8">
      <div className="jqs-glass rounded-2xl border border-white/30 bg-white/60 p-6 shadow-[0_8px_30px_rgba(0,0,0,0.06)] backdrop-blur-xl dark:border-white/10 dark:bg-white/10 sm:p-8">
        <div className="flex flex-col gap-4">
          <header className="space-y-1">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-amber-700/80 dark:text-amber-300/90">
              Owner Notice
            </p>
            <h2 className="text-xl font-semibold text-neutral-900 dark:text-neutral-100 sm:text-2xl">
              Update – Outcome of Factor Vote
            </h2>
          </header>

          <div className="space-y-3 text-sm text-neutral-700 dark:text-neutral-200 sm:text-base">
            <p>
              Voting has now closed. Following the conclusion of the owner vote, Myreside received
              the majority of votes and will therefore be appointed as the new factor for James
              Square, replacing Fior Asset &amp; Property.
            </p>
            <p>
              Thank you to everyone who took the time to review the proposals and participate in
              the voting process. Further details regarding the transition will be published on the
              website and in the owners’ section in due course.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
