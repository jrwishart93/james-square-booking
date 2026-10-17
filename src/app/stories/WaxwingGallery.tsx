'use client';

import { useState } from 'react';
import Image from 'next/image';
import { AnimatePresence, motion } from 'framer-motion';
import WaxwingCarousel, { type LightboxItem } from './WaxwingCarousel';

/** The waxwing gallery plus its full-screen lightbox. */
export default function WaxwingGallery() {
  const [lightbox, setLightbox] = useState<LightboxItem>(null);

  return (
    <>
      <WaxwingCarousel onOpenLightbox={setLightbox} />
      <AnimatePresence>
        {lightbox && (
          <motion.button
            aria-label="Close image"
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-6"
            onClick={() => setLightbox(null)}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div className="w-full max-w-4xl" initial={{ scale: 0.96 }} animate={{ scale: 1 }} exit={{ scale: 0.98 }}>
              <Image
                src={lightbox.src}
                alt={lightbox.alt}
                width={1600}
                height={1200}
                className="h-auto w-full rounded-2xl"
                priority
              />
              <div className="mt-2 text-center text-sm text-white/80">{lightbox.alt}</div>
            </motion.div>
          </motion.button>
        )}
      </AnimatePresence>
    </>
  );
}
