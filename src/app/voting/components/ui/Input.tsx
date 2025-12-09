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
        <label htmlFor={inputId} className="block text-sm font-medium text-slate-300 mb-1.5 ml-1">
          {label}
        </label>
      )}
      <input
        id={inputId}
        className={`
          w-full rounded-2xl 
          bg-white/5 
          border border-white/10 
          px-4 py-3
          text-sm text-slate-50
          placeholder:text-slate-500
          focus:outline-none 
          focus:ring-2 focus:ring-cyan-400/70 
          focus:border-transparent
          backdrop-blur-md
          shadow-inner shadow-black/20
          transition-all
          ${error ? 'border-red-500/50 focus:ring-red-500/50' : ''} 
          ${className}
        `}
        {...props}
      />
      {error && <p className="mt-1.5 ml-1 text-sm text-red-400">{error}</p>}
    </div>
  );
};