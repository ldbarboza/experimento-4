export interface ContactFormData {
  name: string;
  email: string;
  message: string;
}

export interface ValidationErrors {
  name?: string;
  email?: string;
  message?: string;
}

export interface ApiResponse<T = unknown> {
  success: boolean;
  message?: string;
  submissionId?: string;
  errors?: Record<string, string>;
  data?: T;
}

export interface FormState {
  values: ContactFormData;
  errors: ValidationErrors;
  touched: Record<string, boolean>;
  isSubmitting: boolean;
  isSuccess: boolean;
  serverError?: string;
}
