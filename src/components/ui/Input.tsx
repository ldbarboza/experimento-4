'use client';

import { InputHTMLAttributes, forwardRef } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
  hint?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  function Input({ label, error, hint, id, className = '', ...props }, ref) {
    const inputId = id ?? label.toLowerCase().replace(/\s+/g, '-');
    return (
      <div className="flex flex-col gap-1">
        <label
          htmlFor={inputId}
          className="text-sm font-medium text-gray-700"
        >
          {label}
          {props.required && <span className="text-red-500 ml-1">*</span>}
        </label>
        <input
          ref={ref}
          id={inputId}
          {...props}
          className={[
            'block w-full rounded-md border px-3 py-2 text-sm shadow-sm',
            'placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500',
            'transition-colors duration-150',
            error
              ? 'border-red-400 bg-red-50 focus:ring-red-400 focus:border-red-400'
              : 'border-gray-300 bg-white',
            className,
          ].join(' ')}
        />
        {hint && !error && (
          <p className="text-xs text-gray-500">{hint}</p>
        )}
        {error && (
          <p className="text-xs text-red-600" role="alert">
            {error}
          </p>
        )}
      </div>
    );
  },
);
