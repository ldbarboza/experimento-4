import { PRODUCT_TYPES, PRODUCT_STATUSES, ProductType, ProductStatus } from '@/types/product';

export interface ValidationResult {
  valid: boolean;
  errors: Record<string, string>;
}

export interface ProductInput {
  name?: unknown;
  type?: unknown;
  description?: unknown;
  interestRate?: unknown;
  status?: unknown;
}

export function validateProduct(data: ProductInput): ValidationResult {
  const errors: Record<string, string> = {};

  // name — required, 3–100 chars
  if (!data.name || typeof data.name !== 'string' || data.name.trim().length === 0) {
    errors.name = 'O nome é obrigatório.';
  } else if (data.name.trim().length < 3) {
    errors.name = 'O nome deve ter no mínimo 3 caracteres.';
  } else if (data.name.trim().length > 100) {
    errors.name = 'O nome deve ter no máximo 100 caracteres.';
  }

  // type — required, must be one of the allowed values
  if (!data.type || typeof data.type !== 'string') {
    errors.type = 'O tipo é obrigatório.';
  } else if (!PRODUCT_TYPES.includes(data.type as ProductType)) {
    errors.type = 'Tipo de produto inválido.';
  }

  // description — optional, max 500 chars
  if (data.description !== undefined && data.description !== null && data.description !== '') {
    if (typeof data.description !== 'string') {
      errors.description = 'A descrição deve ser um texto.';
    } else if (data.description.length > 500) {
      errors.description = 'A descrição deve ter no máximo 500 caracteres.';
    }
  }

  // interestRate — optional, 0–100
  if (data.interestRate !== undefined && data.interestRate !== null && data.interestRate !== '') {
    const rate = Number(data.interestRate);
    if (isNaN(rate)) {
      errors.interestRate = 'A taxa de juros deve ser um número.';
    } else if (rate < 0 || rate > 100) {
      errors.interestRate = 'A taxa de juros deve estar entre 0 e 100.';
    }
  }

  // status — required, must be one of the allowed values
  if (!data.status || typeof data.status !== 'string') {
    errors.status = 'O status é obrigatório.';
  } else if (!PRODUCT_STATUSES.includes(data.status as ProductStatus)) {
    errors.status = 'Status inválido.';
  }

  return { valid: Object.keys(errors).length === 0, errors };
}
