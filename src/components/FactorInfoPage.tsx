'use client';

import type { ReactNode } from 'react';
import Image from 'next/image';

import { GlassCard } from '@/components/GlassCard';
import GradientBG from '@/components/GradientBG';

type FactorInfoPageProps = {
  title: string;
  subtitle: string;
  intro: ReactNode;
  logoSrc: string;
  logoAlt: string;
  statusTitle?: string;
  statusContent?: ReactNode;
  managementTitle: string;
  managementText: string;
  communicationText: string;
  costs: Array<{ label: string; value: string }>;
  costsTitle?: string;
  costsContent?: ReactNode;
  documentationLinks: Array<{ href: string; label: string }>;
  additionalContent?: ReactNode;
  postDocumentationContent?: ReactNode;
};

const FactorInfoPage = ({
  title,
  subtitle,
  intro,
  logoSrc,
  logoAlt,
  statusTitle,
  statusContent,
  managementTitle,
  managementText,
  communicationText,
  costs,
  costsTitle = 'Costs summary',
  costsContent,
  documentationLinks,
  additionalContent,
  postDocumentationContent,
}: FactorInfoPageProps) => {
  return (
    <GradientBG className="relative isolate min-h-screen w-screen -ml-[calc((100vw-100%)/2)] -mr-[calc((100vw-100%)/2)] px-4 md:px-8 py-12">
      <div className="relative mx-auto max-w-5xl px-2 sm:px-4 md:px-0 space-y-10">
        <header className="pt-5 md:pt-6 space-y-4 md:space-y-6 text-center md:text-left">
          <div className="flex flex-col items-center gap-4 md:flex-row md:items-center md:gap-6">
            <Image
              src={logoSrc}
              alt={logoAlt}
              width={220}
              height={80}
              className="h-20 w-auto object-contain"
              priority
            />
            <div className="space-y-2">
              <h1 className="text-3xl md:text-4xl font-semibold text-neutral-900 dark:text-white">{title}</h1>
              <p className="text-sm md:text-base text-slate-600 dark:text-slate-300">{subtitle}</p>
            </div>
          </div>
          <div className="max-w-3xl space-y-3 text-sm md:text-base text-slate-600 dark:text-slate-300">{intro}</div>
        </header>

        <div className="space-y-6">
          {statusTitle && statusContent ? (
            <GlassCard title={statusTitle} titleClassName="text-2xl font-semibold text-slate-900 dark:text-slate-100">
              <div className="space-y-3 text-sm md:text-base text-slate-700 dark:text-slate-200">{statusContent}</div>
            </GlassCard>
          ) : null}
          <GlassCard title={managementTitle} titleClassName="text-2xl font-semibold text-slate-900 dark:text-slate-100">
            <p className="text-sm md:text-base text-slate-700 dark:text-slate-200">{managementText}</p>
          </GlassCard>

          <GlassCard title="Communication & maintenance" titleClassName="text-2xl font-semibold text-slate-900 dark:text-slate-100">
            <p className="text-sm md:text-base text-slate-700 dark:text-slate-200">{communicationText}</p>
          </GlassCard>

          <GlassCard title={costsTitle} titleClassName="text-2xl font-semibold text-slate-900 dark:text-slate-100">
            {costsContent ?? (
              <div className="space-y-2 text-sm md:text-base text-slate-700 dark:text-slate-200">
                {costs.map((cost) => (
                  <p key={cost.label}>
                    <span className="font-semibold text-slate-900 dark:text-slate-100">{cost.label}</span> {cost.value}
                  </p>
                ))}
              </div>
            )}
          </GlassCard>

          {additionalContent}

          <GlassCard title="Documentation" titleClassName="text-2xl font-semibold text-slate-900 dark:text-slate-100">
            <div className="flex flex-col gap-2">
              {documentationLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  className="inline-flex items-center text-sm font-semibold text-cyan-700 hover:text-cyan-600 dark:text-cyan-300 dark:hover:text-cyan-200"
                  target="_blank"
                  rel="noreferrer noopener"
                >
                  {link.label}
                </a>
              ))}
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-300">These documents are provided for information only.</p>
          </GlassCard>

          {postDocumentationContent}

          <div className="rounded-2xl border border-slate-200/80 bg-slate-50/80 p-6 shadow-sm dark:border-white/10 dark:bg-white/5">
            <h2 className="text-base font-semibold text-slate-900 dark:text-slate-100">Important note</h2>
            <p className="mt-2 text-sm text-slate-700 dark:text-slate-200">
              The information on this page is provided for transparency and reference. Final arrangements remain subject
              to confirmation as part of the handover process.
            </p>
          </div>
        </div>
      </div>
    </GradientBG>
  );
};

export default FactorInfoPage;
