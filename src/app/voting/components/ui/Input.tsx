import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export const Input: React.FC<InputProps> = ({ label, error, className = '', id, ...props }) => {
  const inputId = id || props.name;

  return (
    <div className="w-full">
      {label && (
        <label
          htmlFor={inputId}
          className="block text-sm font-semibold text-slate-700 dark:text-slate-200 mb-1.5 ml-1"
        >
          {label}
        </label>
      )}
      <input
        id={inputId}
        className={`
          w-full rounded-2xl
          bg-white
          border border-slate-300
          px-4 py-3
          text-sm text-slate-900
          placeholder:text-slate-500
          dark:bg-slate-950
          dark:border-slate-700
          dark:text-white
          dark:placeholder:text-slate-500
          focus:outline-none
          focus:ring-2 focus:ring-cyan-500
          focus:border-cyan-400
          focus:ring-offset-2 focus:ring-offset-white
          dark:focus:ring-offset-slate-950
          shadow-[0_1px_2px_rgba(0,0,0,0.06)]
          transition-all
          ${
            error
              ? 'border-red-400 focus:ring-red-400 focus:ring-offset-2 focus:ring-offset-white dark:focus:ring-offset-slate-950'
              : ''
          }
          ${className}
        `}
        {...props}
      />
      {error && <p className="mt-1.5 ml-1 text-sm text-red-600">{error}</p>}
    </div>
  );
};