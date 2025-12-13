import Image from 'next/image';
import Link from 'next/link';
import { ChevronRight } from 'lucide-react';

export type FacilityTitle = 'Pool' | 'Gym' | 'Sauna';

export type FacilityCardProps = {
  title: FacilityTitle;
  href: string;
  imageSrc: string;
  meta?: string;
};

const cx = (...classes: Array<string | false | null | undefined>) => classes.filter(Boolean).join(' ');

export const FacilityCard = ({ title, href, imageSrc, meta }: FacilityCardProps) => {
  return (
    <Link href={href} className="group block focus:outline-none" aria-label={`${title} booking`}>
      <article
        className={cx(
          'glass-surface glass-outline relative flex h-full flex-col overflow-hidden rounded-2xl border border-transparent',
          'shadow-[0_14px_32px_rgba(15,23,42,0.12)] dark:shadow-[0_22px_50px_rgba(0,0,0,0.48)]',
          'transition-transform duration-200 ease-out will-change-transform',
          'group-hover:-translate-y-0.5 group-hover:shadow-[0_20px_46px_rgba(15,23,42,0.16)]',
          'group-active:translate-y-0.5 group-active:shadow-[0_12px_28px_rgba(15,23,42,0.14)]',
          'group-focus-visible:ring-2 group-focus-visible:ring-offset-2 group-focus-visible:ring-sky-300/80',
          'group-focus-visible:ring-offset-transparent sm:group-focus-visible:ring-offset-slate-100/60 dark:group-focus-visible:ring-offset-slate-900/60',
          'p-5 sm:p-6 text-[color:var(--text-primary)]',
        )}
      >
        <div className="relative mb-4 flex items-center justify-center overflow-hidden rounded-xl bg-white/55 px-4 py-5 shadow-inner shadow-white/40 dark:bg-white/5 dark:shadow-none">
          <div className="absolute inset-0 bg-gradient-to-br from-white/50 via-transparent to-white/10 dark:from-white/5 dark:via-transparent" />
          <Image
            src={imageSrc}
            alt={`${title} illustration`}
            width={360}
            height={220}
            className="relative z-10 h-28 w-auto object-contain drop-shadow-[0_12px_30px_rgba(15,23,42,0.18)]"
            priority={false}
          />
        </div>

        <div className="relative z-10 flex items-start justify-between gap-4">
          <div className="space-y-1">
            <h3 className="text-lg font-semibold leading-snug text-slate-900 dark:text-slate-50">{title}</h3>
            {meta && <p className="text-sm text-slate-600 dark:text-slate-300">{meta}</p>}
          </div>

          <div
            className={cx(
              'flex h-10 w-10 items-center justify-center rounded-full border',
              'border-white/60 bg-white/70 text-slate-700 shadow-[0_8px_20px_rgba(15,23,42,0.12)] backdrop-blur-sm',
              'dark:border-white/10 dark:bg-white/10 dark:text-slate-100 dark:shadow-[0_12px_30px_rgba(0,0,0,0.38)]',
              'transition-transform duration-200 ease-out group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-active:translate-x-0 group-active:translate-y-0',
            )}
            aria-hidden
          >
            <ChevronRight className="h-5 w-5" />
          </div>
        </div>
      </article>
    </Link>
  );
};

export default FacilityCard;
