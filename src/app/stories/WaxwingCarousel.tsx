'use client';

import React, { useRef, useState } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';

export type LightboxItem = { src: string; alt: string } | null;
const waxwingImages = [
  { src: '/images/buildingimages/Bird-1.JPG', alt: 'Waxwing perched on a branch at James Square' },
  { src: '/images/buildingimages/Bird-2.JPG', alt: 'Waxwing feeding among the berries near the apartments' },
  { src: '/images/buildingimages/Bird-3.JPG', alt: 'Close view of a waxwing showing its crest and colouring' },
  { src: '/images/buildingimages/Bird-4.JPG', alt: 'Waxwing flock resting in a berry tree at James Square' },
  { src: '/images/buildingimages/Bird-5.JPG', alt: 'Waxwing in flight above the trees at James Square' },
];
const carouselVariants = {
  enter: (direction: number) => ({ x: direction > 0 ? 32 : -32, opacity: 0 }),
  center: { x: 0, opacity: 1 },
  exit: (direction: number) => ({ x: direction > 0 ? -32 : 32, opacity: 0 }),
};

export default function WaxwingCarousel({ onOpenLightbox }: { onOpenLightbox?: (item: LightboxItem) => void }) {
  const [index, setIndex] = useState(0);
  const directionRef = useRef(0);
  const touchStart = useRef<{ x: number; y: number } | null>(null);
  const total = waxwingImages.length;

  const goTo = (next: number, direction: number) => {
    directionRef.current = direction;
    setIndex((next + total) % total);
  };

  const prev = () => goTo(index - 1, -1);
  const next = () => goTo(index + 1, 1);

  const handleTouchStart = (e: React.TouchEvent<HTMLDivElement>) => {
    const touch = e.touches[0];
    touchStart.current = { x: touch.clientX, y: touch.clientY };
  };

  const handleTouchEnd = (e: React.TouchEvent<HTMLDivElement>) => {
    if (!touchStart.current) return;
    const touch = e.changedTouches[0];
    const dx = touch.clientX - touchStart.current.x;
    const dy = touch.clientY - touchStart.current.y;

    if (Math.abs(dx) > 40 && Math.abs(dx) > Math.abs(dy)) {
      if (dx < 0) {
        next();
      } else {
        prev();
      }
    }

    touchStart.current = null;
  };

  const currentImage = waxwingImages[index];

  return (
    <div className="mx-auto w-full max-w-5xl space-y-2">
      <div
        className="group relative h-[240px] overflow-hidden rounded-xl sm:h-[340px]"
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        <AnimatePresence initial={false} custom={directionRef.current}>
          <motion.div
            key={currentImage.src}
            custom={directionRef.current}
            variants={carouselVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            className="absolute inset-0"
          >
            <Image
              src={currentImage.src}
              alt={currentImage.alt}
              fill
              sizes="(min-width:1280px) 720px, (min-width:768px) 80vw, 100vw"
              className={`h-full w-full rounded-xl object-contain ${onOpenLightbox ? 'cursor-zoom-in' : ''}`}
              priority={index === 0}
              onClick={() => onOpenLightbox?.(currentImage)}
              role={onOpenLightbox ? 'button' : undefined}
              tabIndex={onOpenLightbox ? 0 : -1}
              onKeyDown={(e) => {
                if (!onOpenLightbox) return;
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  onOpenLightbox(currentImage);
                }
              }}
            />
          </motion.div>
        </AnimatePresence>

        <div className="absolute inset-y-0 left-3 right-3 hidden items-center justify-between md:flex">
          <button
            type="button"
            aria-label="Previous waxwing photo"
            onClick={prev}
            className="inline-flex h-9 w-9 items-center justify-center text-white/80 transition opacity-0 group-hover:opacity-100 hover:text-white focus:outline-none focus-visible:opacity-100"
          >
            ←
          </button>
          <button
            type="button"
            aria-label="Next waxwing photo"
            onClick={next}
            className="inline-flex h-9 w-9 items-center justify-center text-white/80 transition opacity-0 group-hover:opacity-100 hover:text-white focus:outline-none focus-visible:opacity-100"
          >
            →
          </button>
        </div>
      </div>

      <div className="flex items-center justify-center gap-2">
        {waxwingImages.map((img, i) => (
          <button
            key={img.src}
            aria-label={`Go to waxwing photo ${i + 1}`}
            onClick={() => goTo(i, i > index ? 1 : -1)}
            className={`h-2 w-2 rounded-full transition ${
              i === index ? 'bg-neutral-900 dark:bg-white/90' : 'bg-neutral-400/50 dark:bg-white/30'
            }`}
          />
        ))}
      </div>
    </div>
  );
}
