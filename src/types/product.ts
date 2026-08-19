export type ProductType =
  | 'Conta Corrente'
  | 'Conta Poupança'
  | 'Cartão de Crédito'
  | 'Empréstimo Pessoal'
  | 'Fundo de Investimento';

export type ProductStatus = 'Ativo' | 'Inativo';

export interface Product {
  id: string;
  name: string;
  type: ProductType;
  description?: string;
  interestRate?: number; // 0.00 – 100.00 (%)
  status: ProductStatus;
  createdAt: string; // ISO 8601
}

export const PRODUCT_TYPES: ProductType[] = [
  'Conta Corrente',
  'Conta Poupança',
  'Cartão de Crédito',
  'Empréstimo Pessoal',
  'Fundo de Investimento',
];

export const PRODUCT_STATUSES: ProductStatus[] = ['Ativo', 'Inativo'];
