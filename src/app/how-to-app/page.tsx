import HowToCarousel from "./HowToCarousel";

export default function HowToAppPage() {
  return (
    <main className="min-h-screen bg-[#0b0d12] text-white overflow-hidden">
      <section className="max-w-[1600px] mx-auto px-6 pt-24">
        <p className="text-xs tracking-widest text-white/50 uppercase">iPhone · Safari</p>

        <h1 className="mt-3 text-3xl md:text-4xl font-semibold">Your guided setup</h1>

        <p className="mt-3 text-white/70 max-w-xl">
          Follow each step to add James Square to your home screen.
        </p>
      </section>

      <HowToCarousel />
    </main>
  );
}
