'use client';

import Image from 'next/image';

import { GlassCard } from '@/components/GlassCard';
import GradientBG from '@/components/GradientBG';

type FactorInfoPageProps = {
  title: string;
  subtitle: string;
  intro: string;
  logoSrc: string;
  logoAlt: string;
  managementTitle: string;
  managementPoints: string[];
  caretakerTitle: string;
  caretakerIntro: string;
  caretakerPoints: string[];
  communicationPoints: string[];
  costs: string[];
  documentationHref: string;
  documentationLabel: string;
};

const FactorInfoPage = ({
  title,
  subtitle,
  intro,
  logoSrc,
  logoAlt,
  managementTitle,
  managementPoints,
  caretakerTitle,
  caretakerIntro,
  caretakerPoints,
  communicationPoints,
  costs,
  documentationHref,
  documentationLabel,
}: FactorInfoPageProps) => {
  return (
    <GradientBG className="relative isolate min-h-screen w-screen -ml-[calc((100vw-100%)/2)] -mr-[calc((100vw-100%)/2)] px-4 md:px-8 py-12">
      <div className="relative mx-auto max-w-5xl px-2 sm:px-4 md:px-0 space-y-8">
        <header className="pt-5 md:pt-6 space-y-4 md:space-y-5 text-center md:text-left">
          <div className="flex flex-col items-center gap-4 md:flex-row md:items-center md:gap-6">
            <Image
              src={logoSrc}
              alt={logoAlt}
              width={220}
              height={80}
              className="h-20 w-auto object-contain"
              priority
            />
            <div className="space-y-1">
              <h1 className="text-3xl md:text-4xl font-semibold text-neutral-900 dark:text-white">{title}</h1>
              <p className="text-sm md:text-base text-slate-600 dark:text-slate-300">{subtitle}</p>
            </div>
          </div>
          <p className="max-w-3xl text-sm md:text-base text-slate-600 dark:text-slate-300">{intro}</p>
        </header>

        <div className="space-y-6">
          <GlassCard title={managementTitle} titleClassName="text-2xl font-semibold text-slate-900 dark:text-slate-100">
            <ul className="list-disc space-y-2 pl-5 text-sm md:text-base text-slate-700 dark:text-slate-200">
              {managementPoints.map((point) => (
                <li key={point}>{point}</li>
              ))}
            </ul>
          </GlassCard>

          <GlassCard title={caretakerTitle} titleClassName="text-2xl font-semibold text-slate-900 dark:text-slate-100">
            <p className="text-sm md:text-base text-slate-700 dark:text-slate-200">{caretakerIntro}</p>
            <ul className="list-disc space-y-2 pl-5 text-sm md:text-base text-slate-700 dark:text-slate-200">
              {caretakerPoints.map((point) => (
                <li key={point}>{point}</li>
              ))}
            </ul>
          </GlassCard>

          <GlassCard title="Communication & maintenance" titleClassName="text-2xl font-semibold text-slate-900 dark:text-slate-100">
            <ul className="list-disc space-y-2 pl-5 text-sm md:text-base text-slate-700 dark:text-slate-200">
              {communicationPoints.map((point) => (
                <li key={point}>{point}</li>
              ))}
            </ul>
          </GlassCard>

          <GlassCard title="Costs summary" titleClassName="text-2xl font-semibold text-slate-900 dark:text-slate-100">
            <ul className="list-disc space-y-2 pl-5 text-sm md:text-base text-slate-700 dark:text-slate-200">
              {costs.map((cost) => (
                <li key={cost}>{cost}</li>
              ))}
            </ul>
          </GlassCard>

          <GlassCard title="Documentation" titleClassName="text-2xl font-semibold text-slate-900 dark:text-slate-100">
            <a
              href={documentationHref}
              className="inline-flex items-center text-sm font-semibold text-cyan-700 hover:text-cyan-600 dark:text-cyan-300 dark:hover:text-cyan-200"
              target="_blank"
              rel="noreferrer noopener"
            >
              {documentationLabel}
            </a>
          </GlassCard>

          <div className="rounded-2xl border border-slate-200/80 bg-slate-50/80 p-6 shadow-sm dark:border-white/10 dark:bg-white/5">
            <h2 className="text-base font-semibold text-slate-900 dark:text-slate-100">Important note</h2>
            <p className="mt-2 text-sm text-slate-700 dark:text-slate-200">
              The documents linked on this page are initial proposals provided for information only. They are subject to
              clarification and change. Updated documents will be uploaded in due course ahead of the general meeting.
            </p>
          </div>
        </div>
      </div>
    </GradientBG>
  );
};

export default FactorInfoPage;
