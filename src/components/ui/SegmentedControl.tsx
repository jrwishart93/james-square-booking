import React from 'react';

const cx = (...classes: Array<string | false | null | undefined>) => classes.filter(Boolean).join(' ');

export interface SegmentedOption {
  label: string;
  value: string;
}

interface SegmentedControlProps {
  options: SegmentedOption[];
  value: string;
  onChange: (value: string) => void;
  className?: string;
  ariaLabel?: string;
}

export default function SegmentedControl({ options, value, onChange, className, ariaLabel }: SegmentedControlProps) {
  return (
    <div
      className={cx('segmented-control', className)}
      role="group"
      aria-label={ariaLabel || 'Segmented control'}
    >
      {options.map((option) => (
        <button
          key={option.value}
          type="button"
          className={cx('segmented-control__option text-sm sm:text-base', value === option.value && 'is-active')}
          aria-pressed={value === option.value}
          onClick={() => onChange(option.value)}
        >
          {option.label}
        </button>
      ))}
    </div>
  );
}
