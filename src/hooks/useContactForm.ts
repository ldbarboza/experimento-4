import { useState, useCallback } from 'react'
import { submitContact } from '../api/contact'
import { validateForm, isFormValid } from '../utils/validation'
import { FEEDBACK_MESSAGES } from '../constants/messages'
import type { ContactFormData, FormState, ValidationErrors } from '../types/contact'

const initialFormData: ContactFormData = {
  name: '',
  email: '',
  message: '',
}

export function useContactForm() {
  const [formState, setFormState] = useState<FormState>({
    values: initialFormData,
    errors: {},
    touched: {},
    isSubmitting: false,
    isSuccess: false,
  })

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      const { name, value } = e.target
      setFormState(prev => ({
        ...prev,
        values: {
          ...prev.values,
          [name]: value,
        },
      }))
    },
    []
  )

  const handleBlur = useCallback(
    (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      const { name } = e.target
      setFormState(prev => {
        const errors = validateForm(prev.values)
        return {
          ...prev,
          touched: {
            ...prev.touched,
            [name]: true,
          },
          errors,
        }
      })
    },
    []
  )

  const handleSubmit = useCallback(
    async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault()

      const errors = validateForm(formState.values)
      if (!isFormValid(errors)) {
        setFormState(prev => ({
          ...prev,
          errors,
          touched: { name: true, email: true, message: true },
        }))
        return
      }

      setFormState(prev => ({
        ...prev,
        isSubmitting: true,
        serverError: undefined,
      }))

      try {
        const response = await submitContact(formState.values)
        if (response.success) {
          setFormState(prev => ({
            ...prev,
            isSubmitting: false,
            isSuccess: true,
            values: initialFormData,
            errors: {},
            touched: {},
          }))
        }
      } catch (error) {
        const errorMsg =
          error instanceof Error && error.message === 'server_error'
            ? FEEDBACK_MESSAGES.ERROR_SERVER
            : FEEDBACK_MESSAGES.ERROR_NETWORK

        setFormState(prev => ({
          ...prev,
          isSubmitting: false,
          serverError: errorMsg,
        }))
      }
    },
    [formState.values]
  )

  const handleReset = useCallback(() => {
    setFormState({
      values: initialFormData,
      errors: {},
      touched: {},
      isSubmitting: false,
      isSuccess: false,
    })
  }, [])

  const handleRetry = useCallback(async () => {
    setFormState(prev => ({
      ...prev,
      isSubmitting: true,
      serverError: undefined,
    }))

    try {
      const response = await submitContact(formState.values)
      if (response.success) {
        setFormState(prev => ({
          ...prev,
          isSubmitting: false,
          isSuccess: true,
          values: initialFormData,
          errors: {},
          touched: {},
        }))
      }
    } catch (error) {
      const errorMsg =
        error instanceof Error && error.message === 'server_error'
          ? FEEDBACK_MESSAGES.ERROR_SERVER
          : FEEDBACK_MESSAGES.ERROR_NETWORK

      setFormState(prev => ({
        ...prev,
        isSubmitting: false,
        serverError: errorMsg,
      }))
    }
  }, [formState.values])

  const dismissSuccess = useCallback(() => {
    setFormState(prev => ({
      ...prev,
      isSuccess: false,
    }))
  }, [])

  return {
    ...formState,
    handleChange,
    handleBlur,
    handleSubmit,
    handleReset,
    handleRetry,
    dismissSuccess,
  }
}
