import { validateProduct } from '@/lib/validations';

describe('validateProduct', () => {
  const validInput = {
    name: 'Conta Corrente Premium',
    type: 'Conta Corrente',
    status: 'Ativo',
  };

  // ── name ──────────────────────────────────────────────────────────────────

  it('returns valid for a complete valid input', () => {
    const result = validateProduct(validInput);
    expect(result.valid).toBe(true);
    expect(result.errors).toEqual({});
  });

  it('returns error when name is missing', () => {
    const result = validateProduct({ ...validInput, name: '' });
    expect(result.valid).toBe(false);
    expect(result.errors.name).toBeDefined();
  });

  it('returns error when name is too short (< 3 chars)', () => {
    const result = validateProduct({ ...validInput, name: 'AB' });
    expect(result.valid).toBe(false);
    expect(result.errors.name).toMatch(/3/);
  });

  it('returns error when name is too long (> 100 chars)', () => {
    const result = validateProduct({ ...validInput, name: 'A'.repeat(101) });
    expect(result.valid).toBe(false);
    expect(result.errors.name).toMatch(/100/);
  });

  it('accepts name with exactly 3 chars', () => {
    const result = validateProduct({ ...validInput, name: 'ABC' });
    expect(result.valid).toBe(true);
  });

  it('accepts name with exactly 100 chars', () => {
    const result = validateProduct({ ...validInput, name: 'A'.repeat(100) });
    expect(result.valid).toBe(true);
  });

  // ── type ──────────────────────────────────────────────────────────────────

  it('returns error when type is missing', () => {
    const result = validateProduct({ ...validInput, type: '' });
    expect(result.valid).toBe(false);
    expect(result.errors.type).toBeDefined();
  });

  it('returns error when type is not in the allowed list', () => {
    const result = validateProduct({ ...validInput, type: 'Tipo Inválido' });
    expect(result.valid).toBe(false);
    expect(result.errors.type).toBeDefined();
  });

  it('accepts all valid product types', () => {
    const types = [
      'Conta Corrente',
      'Conta Poupança',
      'Cartão de Crédito',
      'Empréstimo Pessoal',
      'Fundo de Investimento',
    ];
    for (const type of types) {
      const result = validateProduct({ ...validInput, type });
      expect(result.valid).toBe(true);
    }
  });

  // ── description ───────────────────────────────────────────────────────────

  it('accepts missing description', () => {
    const result = validateProduct({ ...validInput, description: undefined });
    expect(result.valid).toBe(true);
  });

  it('accepts empty string description', () => {
    const result = validateProduct({ ...validInput, description: '' });
    expect(result.valid).toBe(true);
  });

  it('returns error when description exceeds 500 chars', () => {
    const result = validateProduct({ ...validInput, description: 'X'.repeat(501) });
    expect(result.valid).toBe(false);
    expect(result.errors.description).toMatch(/500/);
  });

  it('accepts description with exactly 500 chars', () => {
    const result = validateProduct({ ...validInput, description: 'X'.repeat(500) });
    expect(result.valid).toBe(true);
  });

  // ── interestRate ──────────────────────────────────────────────────────────

  it('accepts missing interestRate', () => {
    const result = validateProduct({ ...validInput, interestRate: undefined });
    expect(result.valid).toBe(true);
  });

  it('accepts interestRate of 0', () => {
    const result = validateProduct({ ...validInput, interestRate: 0 });
    expect(result.valid).toBe(true);
  });

  it('accepts interestRate of 100', () => {
    const result = validateProduct({ ...validInput, interestRate: 100 });
    expect(result.valid).toBe(true);
  });

  it('returns error when interestRate is negative', () => {
    const result = validateProduct({ ...validInput, interestRate: -1 });
    expect(result.valid).toBe(false);
    expect(result.errors.interestRate).toBeDefined();
  });

  it('returns error when interestRate exceeds 100', () => {
    const result = validateProduct({ ...validInput, interestRate: 100.01 });
    expect(result.valid).toBe(false);
    expect(result.errors.interestRate).toBeDefined();
  });

  it('returns error when interestRate is not a number', () => {
    const result = validateProduct({ ...validInput, interestRate: 'abc' });
    expect(result.valid).toBe(false);
    expect(result.errors.interestRate).toBeDefined();
  });

  // ── status ────────────────────────────────────────────────────────────────

  it('returns error when status is missing', () => {
    const result = validateProduct({ ...validInput, status: '' });
    expect(result.valid).toBe(false);
    expect(result.errors.status).toBeDefined();
  });

  it('returns error when status is invalid', () => {
    const result = validateProduct({ ...validInput, status: 'Pendente' });
    expect(result.valid).toBe(false);
    expect(result.errors.status).toBeDefined();
  });

  it('accepts Ativo status', () => {
    const result = validateProduct({ ...validInput, status: 'Ativo' });
    expect(result.valid).toBe(true);
  });

  it('accepts Inativo status', () => {
    const result = validateProduct({ ...validInput, status: 'Inativo' });
    expect(result.valid).toBe(true);
  });

  // ── multiple errors ───────────────────────────────────────────────────────

  it('returns multiple errors when multiple fields are invalid', () => {
    const result = validateProduct({ name: '', type: '', status: '' });
    expect(result.valid).toBe(false);
    expect(Object.keys(result.errors).length).toBeGreaterThanOrEqual(3);
  });
});
