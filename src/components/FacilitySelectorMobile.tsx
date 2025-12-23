'use client';

import Image from 'next/image';
import { motion } from 'framer-motion';

import type { FacilityKey } from '@/app/book/BookClient';

type Option = {
  key: FacilityKey;
  label: string;
  iconSrc: string;
};

type FacilitySelectorMobileProps = {
  options: Option[];
  selected: FacilityKey;
  onSelect: (key: FacilityKey) => void;
};

const cx = (...classes: Array<string | false | null | undefined>) => classes.filter(Boolean).join(' ');

export default function FacilitySelectorMobile({ options, selected, onSelect }: FacilitySelectorMobileProps) {
  return (
    <div className="grid grid-cols-3 gap-3">
      {options.map((option) => {
        const isSelected = selected === option.key;

        return (
          <motion.button
            key={option.key}
            type="button"
            onClick={() => onSelect(option.key)}
            whileTap={{ scale: 0.96 }}
            transition={{ duration: 0.18, ease: 'easeOut' }}
            className={cx(
              'relative flex min-h-[52px] items-center justify-center gap-2 rounded-xl border text-sm font-semibold uppercase tracking-wide',
              'bg-white/70 text-slate-700 shadow-sm backdrop-blur transition-colors duration-200 ease-out',
              'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-300/80 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:focus-visible:ring-sky-400/70 dark:focus-visible:ring-offset-slate-900',
              'dark:bg-white/5 dark:text-slate-100 dark:shadow-[0_12px_30px_rgba(0,0,0,0.28)]',
              isSelected
                ? 'border-slate-900/15 shadow-[0_12px_30px_rgba(15,23,42,0.14)] ring-1 ring-slate-900/10 dark:border-white/20 dark:ring-white/14'
                : 'border-black/5 dark:border-white/10'
            )}
            aria-pressed={isSelected}
          >
            <motion.span
              className="relative z-10 flex items-center gap-2"
              animate={isSelected ? { opacity: 1, scale: 1 } : { opacity: 0.9, scale: 0.98 }}
              transition={{ duration: 0.16, ease: 'easeOut' }}
            >
              <Image
                src={option.iconSrc}
                alt=""
                width={24}
                height={24}
                className={cx('h-5 w-5 object-contain', isSelected ? 'opacity-100' : 'opacity-90')}
              />
              <span className={cx('text-xs font-semibold uppercase tracking-[0.04em]', isSelected && 'text-slate-900 dark:text-white')}>
                {option.label}
              </span>
            </motion.span>

            {isSelected && (
              <motion.span
                layoutId="facility-selector-indicator"
                className="absolute inset-px rounded-[12px] bg-slate-900/6 ring-1 ring-slate-900/12 dark:bg-white/5 dark:ring-white/20"
                style={{ pointerEvents: 'none' }}
                transition={{ duration: 0.18, ease: 'easeOut' }}
                aria-hidden
              />
            )}
          </motion.button>
        );
      })}
    </div>
  );
}
