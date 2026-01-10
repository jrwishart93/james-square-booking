"use client";

export default function AndroidStepCard({
  step,
}: {
  step: { id: number; title: string; text: string };
}) {
  return (
    <article className="w-[80vw] max-w-[420px] rounded-2xl border border-slate-200/80 bg-white px-6 py-7 shadow-sm backdrop-blur-lg dark:border-white/10 dark:bg-white/[0.04] dark:shadow-none">
      <div className="text-xs tracking-[0.3em] text-slate-500 dark:text-white/50">
        STEP {step.id}
      </div>

      <h2 className="mt-2 text-2xl font-semibold">{step.title}</h2>

      <p className="mt-3 text-base leading-relaxed text-slate-600 dark:text-white/70">{step.text}</p>

      <div className="mt-5 text-xs text-slate-500 dark:text-white/40">Swipe to continue →</div>
    </article>
  );
}
