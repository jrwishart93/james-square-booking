'use client';

import { animate, motion, useMotionValue } from 'framer-motion';
import { useEffect, useMemo, useRef, useState } from 'react';
import GuidedScreenshot from '@/components/GuidedScreenshot';

// 🔧 EDIT THESE VALUES TO PERFECTLY ALIGN TARGETS
// Increase x to move right, decrease x to move left.
// Increase y to move down, decrease y to move up.
const STEP_POSITIONS = [
  {
    id: 1,
    title: 'Open Safari',
    description: 'Open Safari and go to www.james-square.com, then tap the three dots in the bottom-right corner.',
    image: '/images/brands/step1-removebg-preview.png',
    highlight: { x: 73.5, y: 82, size: 54, label: 'MENU', entryFrom: 'right' as const },
  },
  {
    id: 2,
    title: 'Tap Share',
    description: 'From the menu, tap Share to open the iOS sharing options.',
    image: '/images/brands/step2-removebg-preview.png',
    highlight: { x: 44, y: 49, size: 62, label: 'SHARE', entryFrom: 'left' as const },
  },
  {
    id: 3,
    title: 'Add to Home Screen',
    description: 'Scroll down and tap Add to Home Screen.',
    image: '/images/brands/step3-removebg-preview.png',
    highlight: { x: 40.5, y: 79.5, size: 70, label: 'ADD', entryFrom: 'left' as const },
  },
  {
    id: 4,
    title: 'Confirm details',
    description: 'Check the details and make sure Open as Web App is enabled, then tap Add.',
    image: '/images/brands/step4-removebg-preview.png',
    highlight: { x: 86, y: 10.5, size: 68, label: 'ADD', entryFrom: 'right' as const },
  },
  {
    id: 5,
    title: 'Launch James Square',
    description: 'James Square will now appear on your home screen. Tap it to open like an app.',
    image: '/images/brands/step5-removebg-preview.png',
    highlight: { x: 74, y: 52.5, size: 74, label: 'OPEN', entryFrom: 'right' as const },
  },
];

export default function AddToHomeCarousel() {
  const wrapperRef = useRef<HTMLDivElement | null>(null);
  const x = useMotionValue(0);
  const [activeIndex, setActiveIndex] = useState(0);
  const [slideWidth, setSlideWidth] = useState(0);
  const [isDesktop, setIsDesktop] = useState(false);

  useEffect(() => {
    if (!wrapperRef.current) return undefined;
    const updateWidth = () => {
      const wrapperWidth = wrapperRef.current?.offsetWidth ?? 0;
      setSlideWidth(wrapperWidth * 0.82 + 40);
    };
    updateWidth();
    const observer = new ResizeObserver(updateWidth);
    observer.observe(wrapperRef.current);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!slideWidth) return;
    const controls = animate(x, -activeIndex * slideWidth, { duration: 0.6, ease: 'easeInOut' });
    return () => controls.stop();
  }, [activeIndex, slideWidth, x]);

  useEffect(() => {
    if (typeof window === 'undefined') return undefined;
    const media = window.matchMedia('(min-width: 1024px)');
    const handleChange = () => setIsDesktop(media.matches);
    handleChange();
    if (media.addEventListener) {
      media.addEventListener('change', handleChange);
      return () => media.removeEventListener('change', handleChange);
    }
    media.addListener(handleChange);
    return () => media.removeListener(handleChange);
  }, []);

  useEffect(() => {
    if (!isDesktop || slideWidth === 0) return undefined;
    const timer = window.setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % STEP_POSITIONS.length);
    }, 5200);
    return () => window.clearInterval(timer);
  }, [isDesktop, slideWidth]);

  const maxDrag = useMemo(() => -(STEP_POSITIONS.length - 1) * slideWidth, [slideWidth]);
  const goPrev = () => setActiveIndex((prev) => (prev - 1 + STEP_POSITIONS.length) % STEP_POSITIONS.length);
  const goNext = () => setActiveIndex((prev) => (prev + 1) % STEP_POSITIONS.length);

  return (
    <div ref={wrapperRef} className="add-to-home-carousel">
      <div className="add-to-home-controls">
        <button type="button" className="add-to-home-arrow" onClick={goPrev} aria-label="Previous step">
          <span aria-hidden="true">←</span>
        </button>
        <button type="button" className="add-to-home-arrow" onClick={goNext} aria-label="Next step">
          <span aria-hidden="true">→</span>
        </button>
      </div>
      <motion.div
        className="add-to-home-track"
        drag="x"
        style={{ x }}
        dragConstraints={{ left: maxDrag, right: 0 }}
        dragElastic={0.08}
        onDragEnd={() => {
          if (!slideWidth) return;
          const nextIndex = Math.round(Math.abs(x.get()) / slideWidth);
          setActiveIndex(Math.max(0, Math.min(STEP_POSITIONS.length - 1, nextIndex)));
        }}
      >
        {STEP_POSITIONS.map((step, index) => (
          <div key={step.id} className="add-to-home-slide">
            <div className="add-to-home-phone">
              <GuidedScreenshot
                src={step.image}
                alt={`Step ${step.id} - ${step.title}`}
                highlight={step.highlight}
                isActive={index === activeIndex}
                stepId={step.id}
              />
            </div>
            <div className="add-to-home-text">
              <p className="add-to-home-step">Step {step.id}</p>
              <h3>{step.title}</h3>
              <p className="add-to-home-description">{step.description}</p>
            </div>
          </div>
        ))}
      </motion.div>
    </div>
  );
}
