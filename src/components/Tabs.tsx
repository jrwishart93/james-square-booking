import React from 'react';
import clsx from 'clsx';

type Tab = {
  id: string;
  label: string;
};

type TabsProps = {
  tabs: Tab[];
  activeTab: string;
  onTabChange: (id: string) => void;
  className?: string;
};

export default function Tabs({ tabs, activeTab, onTabChange, className }: TabsProps) {
  return (
    <div className={clsx('flex flex-col sm:flex-row gap-2', className)} role="tablist" aria-label="Useful information tabs">
      {tabs.map((tab) => {
        const isActive = tab.id === activeTab;
        return (
          <button
            key={tab.id}
            role="tab"
            id={`${tab.id}-tab`}
            aria-selected={isActive}
            aria-controls={`${tab.id}-panel`}
            type="button"
            className={clsx(
              'w-full sm:w-auto px-4 py-2 rounded-xl border transition-colors text-sm font-semibold focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black/60 dark:focus-visible:outline-white/80',
              isActive
                ? 'bg-black text-white border-black/80 shadow'
                : 'bg-white/70 dark:bg-white/10 border-black/10 text-[color:var(--text-muted)] hover:border-black/30'
            )}
            onClick={() => onTabChange(tab.id)}
          >
            {tab.label}
          </button>
        );
      })}
    </div>
  );
}
