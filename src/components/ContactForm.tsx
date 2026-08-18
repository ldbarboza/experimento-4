import React, { useEffect } from 'react'
import { useContactForm } from '../hooks/useContactForm'
import { FEEDBACK_MESSAGES } from '../constants/messages'
import { FormField } from './FormField'
import styles from '../styles/ContactForm.module.css'

export function ContactForm() {
  const {
    values,
    errors,
    touched,
    isSubmitting,
    isSuccess,
    serverError,
    handleChange,
    handleBlur,
    handleSubmit,
    handleReset,
    handleRetry,
    dismissSuccess,
  } = useContactForm()

  useEffect(() => {
    if (isSuccess) {
      const timer = setTimeout(dismissSuccess, 5000)
      return () => clearTimeout(timer)
    }
  }, [isSuccess, dismissSuccess])

  return (
    <form className={styles.form} onSubmit={handleSubmit} noValidate>
      <h1>Contact Us</h1>

      {isSuccess && (
        <div className={`${styles.alert} ${styles.alertSuccess}`} role="alert">
          <span>{FEEDBACK_MESSAGES.SUCCESS}</span>
          <button
            type="button"
            className={styles.closeButton}
            onClick={dismissSuccess}
            aria-label="Dismiss success message"
          >
            ×
          </button>
        </div>
      )}

      {serverError && (
        <div className={`${styles.alert} ${styles.alertError}`} role="alert">
          <span>{serverError}</span>
          <button
            type="button"
            className={styles.retryButton}
            onClick={handleRetry}
            disabled={isSubmitting}
          >
            {FEEDBACK_MESSAGES.RETRY}
          </button>
        </div>
      )}

      <FormField
        label="Name"
        name="name"
        value={values.name}
        error={errors.name}
        touched={touched.name || false}
        placeholder="Enter your full name"
        disabled={isSubmitting}
        required
        onChange={handleChange}
        onBlur={handleBlur}
      />

      <FormField
        label="Email"
        name="email"
        type="email"
        value={values.email}
        error={errors.email}
        touched={touched.email || false}
        placeholder="Enter your email address"
        disabled={isSubmitting}
        required
        onChange={handleChange}
        onBlur={handleBlur}
      />

      <FormField
        label="Message"
        name="message"
        value={values.message}
        error={errors.message}
        touched={touched.message || false}
        placeholder="Enter your message (minimum 10 characters)"
        disabled={isSubmitting}
        required
        multiline
        onChange={handleChange}
        onBlur={handleBlur}
      />

      <div className={styles.buttonGroup}>
        <button
          type="submit"
          className={styles.submitButton}
          disabled={isSubmitting}
        >
          {isSubmitting ? FEEDBACK_MESSAGES.SENDING : FEEDBACK_MESSAGES.SUBMIT_BUTTON}
        </button>
        <button
          type="button"
          className={styles.resetButton}
          onClick={handleReset}
          disabled={isSubmitting}
        >
          {FEEDBACK_MESSAGES.RESET_BUTTON}
        </button>
      </div>
    </form>
  )
}
