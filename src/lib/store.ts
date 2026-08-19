import { Product, ProductType, ProductStatus } from '@/types/product';

// Module-level singleton — shared across all API route calls within the same
// server instance. Data resets on cold start (accepted per ADR-02 / OQ-01).
const store = new Map<string, Product>();

// ---------------------------------------------------------------------------
// Seed data — pre-populate with 3 sample banking products (FR-07)
// ---------------------------------------------------------------------------
function seed(): void {
  const seedProducts: Product[] = [
    {
      id: 'seed-001',
      name: 'Conta Corrente Premium',
      type: 'Conta Corrente' as ProductType,
      description:
        'Conta corrente com isenção de tarifas para clientes premium e limite de crédito especial.',
      interestRate: 2.5,
      status: 'Ativo' as ProductStatus,
      createdAt: new Date('2024-01-15T10:00:00.000Z').toISOString(),
    },
    {
      id: 'seed-002',
      name: 'Poupança Rendimento Plus',
      type: 'Conta Poupança' as ProductType,
      description:
        'Conta poupança com rendimento acima da poupança tradicional, sem taxa de manutenção.',
      interestRate: 6.17,
      status: 'Ativo' as ProductStatus,
      createdAt: new Date('2024-02-20T14:30:00.000Z').toISOString(),
    },
    {
      id: 'seed-003',
      name: 'Cartão de Crédito Gold',
      type: 'Cartão de Crédito' as ProductType,
      description:
        'Cartão de crédito com programa de pontos, seguro viagem e acesso a salas VIP em aeroportos.',
      interestRate: 12.99,
      status: 'Ativo' as ProductStatus,
      createdAt: new Date('2024-03-10T09:15:00.000Z').toISOString(),
    },
    {
      id: 'seed-004',
      name: 'Empréstimo Pessoal Flex',
      type: 'Empréstimo Pessoal' as ProductType,
      description:
        'Empréstimo pessoal com parcelas flexíveis e carência de até 90 dias para início do pagamento.',
      interestRate: 18.5,
      status: 'Inativo' as ProductStatus,
      createdAt: new Date('2024-04-05T11:45:00.000Z').toISOString(),
    },
  ];

  for (const product of seedProducts) {
    store.set(product.id, product);
  }
}

if (store.size === 0) {
  seed();
}

// ---------------------------------------------------------------------------
// Store operations
// ---------------------------------------------------------------------------

export function getAll(): Product[] {
  return Array.from(store.values()).sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );
}

export function getById(id: string): Product | undefined {
  return store.get(id);
}

export function add(product: Omit<Product, 'id' | 'createdAt'>): Product {
  const newProduct: Product = {
    ...product,
    id: crypto.randomUUID(),
    createdAt: new Date().toISOString(),
  };
  store.set(newProduct.id, newProduct);
  return newProduct;
}

export function update(
  id: string,
  data: Partial<Omit<Product, 'id' | 'createdAt'>>
): Product | undefined {
  const existing = store.get(id);
  if (!existing) return undefined;

  const updated: Product = { ...existing, ...data };
  store.set(id, updated);
  return updated;
}

export function remove(id: string): boolean {
  return store.delete(id);
}

export const productStore = { getAll, getById, add, update, remove };
