import { Product, ProductType, ProductStatus } from '@/types/product';

// ---------------------------------------------------------------------------
// Module-level singleton — one Map per server instance (ephemeral, per FR-07)
// ---------------------------------------------------------------------------
const store = new Map<string, Product>();

// ---------------------------------------------------------------------------
// Seed data — 3 sample banking products (FR-07)
// ---------------------------------------------------------------------------
function seed(): void {
  const products: Product[] = [
    {
      id: crypto.randomUUID(),
      name: 'Conta Corrente Digital',
      type: 'Conta Corrente' as ProductType,
      description:
        'Conta corrente sem tarifas mensais para movimentações digitais.',
      interestRate: 0,
      status: 'Ativo' as ProductStatus,
      createdAt: new Date('2024-01-15T10:00:00Z').toISOString(),
    },
    {
      id: crypto.randomUUID(),
      name: 'Poupança Rendimento Plus',
      type: 'Conta Poupança' as ProductType,
      description:
        'Conta poupança com rendimento acima da poupança tradicional.',
      interestRate: 6.17,
      status: 'Ativo' as ProductStatus,
      createdAt: new Date('2024-02-20T14:30:00Z').toISOString(),
    },
    {
      id: crypto.randomUUID(),
      name: 'Cartão Platinum Cashback',
      type: 'Cartão de Crédito' as ProductType,
      description:
        'Cartão de crédito com programa de cashback de até 2% em todas as compras.',
      interestRate: 12.99,
      status: 'Ativo' as ProductStatus,
      createdAt: new Date('2024-03-10T09:15:00Z').toISOString(),
    },
    {
      id: crypto.randomUUID(),
      name: 'Empréstimo Pessoal Flex',
      type: 'Empréstimo Pessoal' as ProductType,
      description: 'Empréstimo pessoal com parcelas flexíveis de 12 a 60 meses.',
      interestRate: 2.49,
      status: 'Inativo' as ProductStatus,
      createdAt: new Date('2024-04-05T11:00:00Z').toISOString(),
    },
  ];

  for (const product of products) {
    store.set(product.id, product);
  }
}

// Seed once on module load
seed();

// ---------------------------------------------------------------------------
// Store API
// ---------------------------------------------------------------------------
export const productStore = {
  getAll(): Product[] {
    return Array.from(store.values()).sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    );
  },

  getById(id: string): Product | undefined {
    return store.get(id);
  },

  add(product: Omit<Product, 'id' | 'createdAt'>): Product {
    const newProduct: Product = {
      ...product,
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
    };
    store.set(newProduct.id, newProduct);
    return newProduct;
  },

  update(id: string, data: Partial<Omit<Product, 'id' | 'createdAt'>>): Product | null {
    const existing = store.get(id);
    if (!existing) return null;
    const updated: Product = { ...existing, ...data };
    store.set(id, updated);
    return updated;
  },

  remove(id: string): boolean {
    return store.delete(id);
  },
};
