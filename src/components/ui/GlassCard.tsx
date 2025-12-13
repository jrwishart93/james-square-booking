import React, { ElementType, ReactNode } from 'react';

const cx = (...classes: Array<string | false | null | undefined>) => classes.filter(Boolean).join(' ');

interface GlassCardProps {
  title?: ReactNode;
  subtitle?: ReactNode;
  action?: ReactNode;
  children: ReactNode;
  className?: string;
  contentClassName?: string;
  as?: ElementType;
}

export default function GlassCard({
  title,
  subtitle,
  action,
  children,
  className,
  contentClassName,
  as: Component = 'section',
}: GlassCardProps) {
  return (
    <Component
      className={cx(
        'glass-surface glass-outline relative overflow-hidden border border-transparent',
        'shadow-[0_18px_38px_rgba(15,23,42,0.12)] dark:shadow-[0_24px_50px_rgba(0,0,0,0.55)]',
        'p-5 sm:p-6 lg:p-7 text-[color:var(--text-primary)]',
        className,
      )}
    >
      <div className="relative z-10 space-y-4">
        {(title || subtitle || action) && (
          <header className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
            <div className="space-y-1">
              {title && <h2 className="text-xl font-semibold leading-tight">{title}</h2>}
              {subtitle && (
                <p className="text-sm leading-relaxed text-[color:var(--text-secondary)]">{subtitle}</p>
              )}
            </div>
            {action && <div className="shrink-0">{action}</div>}
          </header>
        )}

        <div className={cx('space-y-4 leading-relaxed', contentClassName)}>{children}</div>
      </div>
    </Component>
  );
}
