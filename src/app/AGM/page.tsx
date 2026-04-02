import type { Metadata } from "next";

const pageUrl = "https://www.james-square.com/AGM";

export const metadata: Metadata = {
  title: "James Square – Annual General Meeting",
  description:
    "Announcement of the planned James Square Annual General Meeting to be held online on 4 June 2026 at 19:00.",
  alternates: { canonical: pageUrl },
};

export default function AGMPage() {
  return (
    <div className="mx-auto max-w-4xl rounded-3xl border border-slate-200/70 bg-white/80 px-6 py-10 shadow-xl dark:border-slate-800/70 dark:bg-slate-900/70 sm:px-10">
      <div className="space-y-8">
        <header className="space-y-4">
          <p className="text-sm uppercase tracking-[0.12em] text-slate-500 dark:text-slate-400">James Square</p>
          <h1 className="text-4xl font-semibold leading-tight text-slate-900 dark:text-slate-100 sm:text-5xl">
            Annual General Meeting (AGM)
          </h1>
          <p className="text-lg leading-relaxed text-slate-700 dark:text-slate-300">
            There is a planned Annual General Meeting to be held online on <strong>4 June 2026 at 19:00 hours</strong>.
          </p>
        </header>

        <section className="space-y-4 rounded-2xl border border-slate-200/80 bg-slate-50/80 p-6 shadow-sm dark:border-slate-800/80 dark:bg-slate-900/70">
          <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-100">Meeting notice</h2>
          <p className="text-base leading-relaxed text-slate-700 dark:text-slate-300">
            The meeting will be held online. More details to follow.
          </p>
          <p className="text-base leading-relaxed text-slate-700 dark:text-slate-300">
            Please contact Myreside ahead of time to discuss agenda points and make sure you have given your contact
            details to Myreside.
          </p>
        </section>
      </div>
    </div>
  );
}
