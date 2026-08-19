'use client';

import { SelectHTMLAttributes, forwardRef } from 'react';

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label: string;
  error?: string;
  hint?: string;
  options: { value: string; label: string }[];
  placeholder?: string;
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  function Select(
    { label, error, hint, options, placeholder, id, className = '', ...props },
    ref,
  ) {
    const selectId = id ?? label.toLowerCase().replace(/\s+/g, '-');
    return (
      <div className="flex flex-col gap-1">
        <label
          htmlFor={selectId}
          className="text-sm font-medium text-gray-700"
        >
          {label}
          {props.required && <span className="text-red-500 ml-1">*</span>}
        </label>
        <select
          ref={ref}
          id={selectId}
          {...props}
          className={[
            'block w-full rounded-md border px-3 py-2 text-sm shadow-sm',
            'focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500',
            'transition-colors duration-150 bg-white',
            error
              ? 'border-red-400 bg-red-50 focus:ring-red-400 focus:border-red-400'
              : 'border-gray-300',
            className,
          ].join(' ')}
        >
          {placeholder && (
            <option value="" disabled>
              {placeholder}
            </option>
          )}
          {options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
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
