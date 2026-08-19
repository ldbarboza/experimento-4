import { Product, ProductType, ProductStatus } from '@/types/product';

// ---------------------------------------------------------------------------
// Module-level singleton — shared across all API route calls within the same
// server instance. Data resets on cold start (acceptable for this experiment).
// ---------------------------------------------------------------------------
const store = new Map<string, Product>();

// ---------------------------------------------------------------------------
// Seed with 3 sample banking products on first module load (FR-07)
// ---------------------------------------------------------------------------
function seed(): void {
  const now = new Date().toISOString();

  const samples: Product[] = [
    {
      id: crypto.randomUUID(),
      name: 'Conta Corrente Digital',
      type: 'Conta Corrente' as ProductType,
      description: 'Conta corrente sem tarifas mensais para movimentação do dia a dia.',
      interestRate: 0,
      status: 'Ativo' as ProductStatus,
      createdAt: now,
    },
    {
      id: crypto.randomUUID(),
      name: 'Poupança Rendimento Plus',
      type: 'Conta Poupança' as ProductType,
      description: 'Conta poupança com rendimento acima da poupança tradicional.',
      interestRate: 6.17,
      status: 'Ativo' as ProductStatus,
      createdAt: now,
    },
    {
      id: crypto.randomUUID(),
      name: 'Cartão Platinum Cashback',
      type: 'Cartão de Crédito' as ProductType,
      description: 'Cartão de crédito com programa de cashback de até 2% em todas as compras.',
      interestRate: 12.99,
      status: 'Ativo' as ProductStatus,
      createdAt: now,
    },
    {
      id: crypto.randomUUID(),
      name: 'Empréstimo Pessoal Flex',
      type: 'Empréstimo Pessoal' as ProductType,
      description: 'Empréstimo pessoal com parcelas flexíveis e aprovação rápida.',
      interestRate: 2.49,
      status: 'Inativo' as ProductStatus,
      createdAt: now,
    },
  ];

  for (const product of samples) {
    store.set(product.id, product);
  }
}

if (store.size === 0) {
  seed();
}

// ---------------------------------------------------------------------------
// Store API
// ---------------------------------------------------------------------------
export const productStore = {
  getAll(): Product[] {
    return Array.from(store.values()).sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
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

  update(id: string, data: Partial<Omit<Product, 'id' | 'createdAt'>>): Product | undefined {
    const existing = store.get(id);
    if (!existing) return undefined;
    const updated: Product = { ...existing, ...data };
    store.set(id, updated);
    return updated;
  },

  remove(id: string): boolean {
    return store.delete(id);
  },

  // Exposed for testing purposes only
  _reset(): void {
    store.clear();
    seed();
  },

  _size(): number {
    return store.size;
  },
};
