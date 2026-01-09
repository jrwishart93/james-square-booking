'use client';

import Image from 'next/image';
import { motion, useReducedMotion } from 'framer-motion';
import FocusHighlight from './FocusHighlight';

export type HowToStep = {
  id: number;
  title: string;
  description: string;
  image: string;
  focus?: {
    x: string;
    y: string;
    size: number;
  };
};

type HowToStepCardProps = {
  step: HowToStep;
  isActive?: boolean;
};

const easeOutCubic: [number, number, number, number] = [0.33, 1, 0.68, 1];

const HowToStepCard = ({ step, isActive }: HowToStepCardProps) => {
  const prefersReducedMotion = useReducedMotion();

  const scaleClass = prefersReducedMotion ? 'md:scale-100' : isActive ? 'md:scale-[1.02]' : 'md:scale-100';

  return (
    <motion.article
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={prefersReducedMotion ? { duration: 0 } : { duration: 0.45, ease: easeOutCubic }}
      className={[
        'snap-center flex w-[86vw] max-w-[360px] shrink-0 flex-col gap-4 rounded-3xl border border-slate-200/70 bg-white/90 p-5 shadow-[0_16px_45px_rgba(15,23,42,0.08)] backdrop-blur md:w-[340px]',
        prefersReducedMotion ? '' : 'transition-transform duration-300 ease-out',
        scaleClass,
      ].join(' ')}
    >
      <div className="flex items-center justify-between">
        <span className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-slate-900 text-sm font-semibold text-white">
          {step.id}
        </span>
        <span className="text-xs uppercase tracking-[0.2em] text-slate-400">Step</span>
      </div>

      <div className="relative overflow-hidden rounded-[2rem] border border-slate-200/70 bg-slate-50 shadow-inner">
        <div className="relative aspect-[9/19] w-full">
          <Image
            src={step.image}
            alt={step.title}
            fill
            sizes="(min-width: 1024px) 320px, 80vw"
            className="object-cover"
            priority={step.id === 1}
          />
        </div>
        {step.focus && (
          <FocusHighlight x={step.focus.x} y={step.focus.y} size={step.focus.size} />
        )}
      </div>

      <div className="space-y-2">
        <h3 className="text-lg font-semibold text-slate-900">{step.title}</h3>
        <p className="text-sm leading-relaxed text-slate-600">{step.description}</p>
      </div>

    </motion.article>
  );
};

export default HowToStepCard;
