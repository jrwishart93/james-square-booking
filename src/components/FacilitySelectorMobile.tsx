'use client';

import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';

import type { FacilityKey } from '@/app/book/BookClient';

type Option = {
  key: FacilityKey;
  label: string;
  iconSrc: string;
  href: string;
};

type FacilitySelectorMobileProps = {
  options: Option[];
};

const cx = (...classes: Array<string | false | null | undefined>) => classes.filter(Boolean).join(' ');

export default function FacilitySelectorMobile({ options }: FacilitySelectorMobileProps) {
  return (
    <div className="grid grid-cols-3 gap-3">
      {options.map((option) => (
        <motion.div key={option.key} whileTap={{ scale: 0.96 }} transition={{ duration: 0.18, ease: 'easeOut' }}>
          <Link
            href={option.href}
            className={cx(
              'relative block min-h-[52px] rounded-xl border border-black/5 bg-white/80 px-3 py-2 text-center text-xs font-semibold uppercase tracking-[0.04em] text-slate-800 shadow-sm ring-1 ring-black/5 backdrop-blur transition-colors duration-150 ease-out',
              'hover:border-black/10 hover:ring-black/8 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-300/80 focus-visible:ring-offset-2 focus-visible:ring-offset-white',
              'dark:border-white/10 dark:bg-white/10 dark:text-slate-100 dark:ring-white/10 dark:hover:border-white/16 dark:hover:ring-white/16 dark:focus-visible:ring-sky-400/70 dark:focus-visible:ring-offset-slate-900',
            )}
          >
            <span className="flex h-full items-center justify-center gap-2">
              <Image src={option.iconSrc} alt="" width={24} height={24} className="h-5 w-5 object-contain" />
              <span className="whitespace-nowrap">{option.label}</span>
            </span>
          </Link>
        </motion.div>
      ))}
    </div>
  );
}
