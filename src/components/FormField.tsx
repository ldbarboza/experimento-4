import React from 'react'
import styles from '../styles/ContactForm.module.css'

interface FormFieldProps {
  label: string
  name: string
  type?: string
  value: string
  error?: string
  touched: boolean
  placeholder?: string
  disabled?: boolean
  required?: boolean
  multiline?: boolean
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void
  onBlur: (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => void
}

export function FormField({
  label,
  name,
  type = 'text',
  value,
  error,
  touched,
  placeholder,
  disabled = false,
  required = false,
  multiline = false,
  onChange,
  onBlur,
}: FormFieldProps) {
  const hasError = touched && !!error
  const inputClass = multiline ? styles.textarea : styles.input
  const inputClassWithError = hasError ? `${inputClass} ${styles.inputError}` : inputClass
  const errorId = `${name}-error`

  return (
    <div className={styles.formGroup}>
      <label htmlFor={name} className={styles.label}>
        {label}
        {required && <span className={styles.required}>*</span>}
      </label>
      {multiline ? (
        <textarea
          id={name}
          name={name}
          value={value}
          onChange={onChange}
          onBlur={onBlur}
          placeholder={placeholder}
          disabled={disabled}
          className={inputClassWithError}
          aria-required={required}
          aria-describedby={hasError ? errorId : undefined}
        />
      ) : (
        <input
          id={name}
          name={name}
          type={type}
          value={value}
          onChange={onChange}
          onBlur={onBlur}
          placeholder={placeholder}
          disabled={disabled}
          className={inputClassWithError}
          aria-required={required}
          aria-describedby={hasError ? errorId : undefined}
        />
      )}
      {hasError && (
        <span id={errorId} className={styles.errorMessage} role="alert">
          {error}
        </span>
      )}
    </div>
  )
}
