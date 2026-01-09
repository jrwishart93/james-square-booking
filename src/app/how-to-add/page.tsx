import HowToCarousel from '@/components/howto/HowToCarousel';

const HowToAddPage = () => {
  return (
    <main className="min-h-screen bg-slate-50 px-6 pb-16 pt-16 text-slate-900 md:px-12">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-12">
        <header className="max-w-2xl space-y-4">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-400">How it works</p>
          <h1 className="text-4xl font-semibold tracking-tight text-slate-900 md:text-5xl">
            Add James Square to your Home Screen
          </h1>
          <p className="text-base leading-relaxed text-slate-600 md:text-lg">
            Follow the guided steps below to save James Square like a real app. Each step is built to
            keep you moving left to right, just like iOS.
          </p>
        </header>

        <HowToCarousel />

        <footer className="rounded-2xl border border-slate-200 bg-white px-6 py-4 text-sm text-slate-600 shadow-sm">
          James Square will open full-screen like an app once it is saved to your Home Screen.
        </footer>
      </div>
    </main>
  );
};

export default HowToAddPage;
