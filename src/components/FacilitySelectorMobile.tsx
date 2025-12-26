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
              'relative block min-h-[110px] rounded-xl border border-black/5 bg-white/85 px-4 py-5 text-center text-sm font-semibold text-slate-900 shadow-sm ring-1 ring-black/5 backdrop-blur transition-colors duration-150 ease-out',
              'hover:border-black/10 hover:ring-black/8 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-300/80 focus-visible:ring-offset-2 focus-visible:ring-offset-white',
              'dark:border-white/12 dark:bg-white/10 dark:text-slate-100 dark:ring-white/12 dark:hover:border-white/16 dark:hover:ring-white/20 dark:focus-visible:ring-sky-400/70 dark:focus-visible:ring-offset-slate-900',
            )}
          >
            <span className="flex h-full flex-col items-center justify-center gap-3">
              <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white shadow-inner shadow-black/5 ring-1 ring-black/5 dark:bg-white/10 dark:shadow-none dark:ring-white/10">
                <Image src={option.iconSrc} alt="" width={48} height={48} className="h-10 w-10 object-contain" />
              </span>
              <span className="whitespace-nowrap text-sm font-semibold tracking-tight">{option.label}</span>
            </span>
          </Link>
        </motion.div>
      ))}
    </div>
  );
}
