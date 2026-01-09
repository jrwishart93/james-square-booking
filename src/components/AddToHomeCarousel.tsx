'use client';

import { useEffect, useRef, useState } from 'react';
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
  const railRef = useRef<HTMLDivElement | null>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [slideWidth, setSlideWidth] = useState(0);

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
    const rail = railRef.current;
    if (!rail || !slideWidth) return undefined;
    const onScroll = () => {
      const nextIndex = Math.round(rail.scrollLeft / slideWidth);
      setActiveIndex(Math.max(0, Math.min(STEP_POSITIONS.length - 1, nextIndex)));
    };
    rail.addEventListener('scroll', onScroll, { passive: true });
    return () => rail.removeEventListener('scroll', onScroll);
  }, [slideWidth]);

  const scrollByStep = (direction: 'left' | 'right') => {
    if (!railRef.current || !slideWidth) return;
    railRef.current.scrollBy({
      left: direction === 'right' ? slideWidth : -slideWidth,
      behavior: 'smooth',
    });
  };

  return (
    <div ref={wrapperRef} className="add-to-home-carousel">
      <div className="add-to-home-controls">
        <button
          type="button"
          className="add-to-home-arrow"
          onClick={() => scrollByStep('left')}
          aria-label="Previous step"
          disabled={activeIndex === 0}
        >
          <span aria-hidden="true">←</span>
        </button>
        <button
          type="button"
          className="add-to-home-arrow"
          onClick={() => scrollByStep('right')}
          aria-label="Next step"
          disabled={activeIndex === STEP_POSITIONS.length - 1}
        >
          <span aria-hidden="true">→</span>
        </button>
      </div>
      <div ref={railRef} className="add-to-home-track">
        {STEP_POSITIONS.map((step, index) => (
          <div key={step.id} className="add-to-home-step">
            <div className="add-to-home-phone">
              <GuidedScreenshot
                src={step.image}
                alt={`Step ${step.id} - ${step.title}`}
                highlight={step.highlight}
                isActive={index === activeIndex}
                stepId={step.id}
              />
            </div>
            <div className="add-to-home-copy">
              <p className="add-to-home-label">Step {step.id}</p>
              <h3>{step.title}</h3>
              <p>{step.description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
