'use client';

import { KeyboardEvent, useEffect, useMemo, useRef, useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import HowToStepCard, { HowToStep } from './HowToStepCard';

const easeOutCubic: [number, number, number, number] = [0.33, 1, 0.68, 1];

const HOW_TO_STEPS: HowToStep[] = [
  {
    id: 1,
    title: 'Open Safari',
    description: 'Go to www.james-square.com in Safari.',
    image: '/images/howto/step-1.svg',
  },
  {
    id: 2,
    title: 'Tap Share',
    description: 'Tap the share icon at the bottom of the screen.',
    image: '/images/howto/step-2.svg',
    focus: { x: '90%', y: '92%', size: 56 },
  },
  {
    id: 3,
    title: 'Add to Home Screen',
    description: 'Select “Add to Home Screen” from the share sheet.',
    image: '/images/howto/step-3.svg',
    focus: { x: '50%', y: '54%', size: 64 },
  },
  {
    id: 4,
    title: 'Name & Add',
    description: 'Confirm the name, then tap Add in the top-right corner.',
    image: '/images/howto/step-4.svg',
    focus: { x: '83%', y: '10%', size: 50 },
  },
];

const HowToCarousel = () => {
  const prefersReducedMotion = useReducedMotion();
  const containerRef = useRef<HTMLDivElement | null>(null);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);
  const [activeIndex, setActiveIndex] = useState(0);

  const stepCount = HOW_TO_STEPS.length;

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const index = cardRefs.current.findIndex((node) => node === entry.target);
            if (index >= 0) {
              setActiveIndex(index);
            }
          }
        });
      },
      { root: container, threshold: 0.6 },
    );

    cardRefs.current.forEach((card) => {
      if (card) observer.observe(card);
    });

    return () => {
      observer.disconnect();
    };
  }, []);

  const scrollToStep = (index: number) => {
    const container = containerRef.current;
    const card = cardRefs.current[index];
    if (!container || !card) return;

    container.scrollTo({ left: card.offsetLeft, behavior: 'smooth' });
  };

  const handleArrowClick = (direction: 'prev' | 'next') => {
    const nextIndex = direction === 'next' ? Math.min(activeIndex + 1, stepCount - 1) : Math.max(activeIndex - 1, 0);
    scrollToStep(nextIndex);
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key === 'ArrowRight') {
      event.preventDefault();
      handleArrowClick('next');
    }
    if (event.key === 'ArrowLeft') {
      event.preventDefault();
      handleArrowClick('prev');
    }
  };

  const motionProps = useMemo(
    () => ({
      initial: { opacity: 0, y: 16 },
      animate: { opacity: 1, y: 0 },
      transition: prefersReducedMotion ? { duration: 0 } : { duration: 0.5, ease: easeOutCubic },
    }),
    [prefersReducedMotion],
  );

  return (
    <section aria-label="How to add James Square to your home screen" className="relative">
      <div className="hidden lg:flex items-center justify-end gap-3 pb-4">
        <button
          type="button"
          onClick={() => handleArrowClick('prev')}
          className="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 shadow-sm transition hover:-translate-y-0.5 hover:bg-slate-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-800"
          aria-label="Scroll to previous step"
        >
          Back
        </button>
        <button
          type="button"
          onClick={() => handleArrowClick('next')}
          className="rounded-full border border-slate-200 bg-slate-900 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:-translate-y-0.5 hover:bg-slate-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-800"
          aria-label="Scroll to next step"
        >
          Next
        </button>
      </div>

      <motion.div
        {...motionProps}
        ref={containerRef}
        tabIndex={0}
        onKeyDown={handleKeyDown}
        className="flex gap-6 overflow-x-auto scroll-smooth px-2 pb-6 pt-1 outline-none snap-x snap-mandatory lg:gap-8 lg:px-1"
      >
        {HOW_TO_STEPS.map((step, index) => (
          <div
            key={step.id}
            ref={(node) => {
              cardRefs.current[index] = node;
            }}
            className="flex"
          >
            <HowToStepCard step={step} isActive={index === activeIndex} />
          </div>
        ))}
      </motion.div>

      <div className="mt-2 flex items-center justify-center gap-2 text-xs text-slate-500 lg:justify-start">
        {HOW_TO_STEPS.map((step, index) => (
          <button
            key={step.id}
            type="button"
            onClick={() => scrollToStep(index)}
            aria-label={`Scroll to step ${step.id}`}
            className={`h-2 w-2 rounded-full transition ${index === activeIndex ? 'bg-slate-900' : 'bg-slate-300'}`}
          />
        ))}
      </div>
    </section>
  );
};

export default HowToCarousel;
