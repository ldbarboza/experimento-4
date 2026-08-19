import { getAll, getById, add, update, remove } from '@/lib/store';

describe('productStore', () => {
  // ── getAll ────────────────────────────────────────────────────────────────

  describe('getAll', () => {
    it('returns an array', () => {
      const products = getAll();
      expect(Array.isArray(products)).toBe(true);
    });

    it('returns at least 3 seeded products (FR-07)', () => {
      const products = getAll();
      expect(products.length).toBeGreaterThanOrEqual(3);
    });

    it('returns products sorted by createdAt descending', () => {
      const products = getAll();
      for (let i = 1; i < products.length; i++) {
        const prev = new Date(products[i - 1].createdAt).getTime();
        const curr = new Date(products[i].createdAt).getTime();
        expect(prev).toBeGreaterThanOrEqual(curr);
      }
    });
  });

  // ── getById ───────────────────────────────────────────────────────────────

  describe('getById', () => {
    it('returns a product for a valid seeded id', () => {
      const product = getById('seed-001');
      expect(product).toBeDefined();
      expect(product?.id).toBe('seed-001');
    });

    it('returns undefined for a non-existent id', () => {
      const product = getById('does-not-exist');
      expect(product).toBeUndefined();
    });
  });

  // ── add ───────────────────────────────────────────────────────────────────

  describe('add', () => {
    it('adds a new product and returns it with an id and createdAt', () => {
      const before = getAll().length;
      const newProduct = add({
        name: 'Produto Teste',
        type: 'Conta Corrente',
        status: 'Ativo',
      });

      expect(newProduct.id).toBeDefined();
      expect(newProduct.createdAt).toBeDefined();
      expect(newProduct.name).toBe('Produto Teste');

      const after = getAll().length;
      expect(after).toBe(before + 1);
    });

    it('generates a unique id for each product', () => {
      const p1 = add({ name: 'Produto A', type: 'Conta Corrente', status: 'Ativo' });
      const p2 = add({ name: 'Produto B', type: 'Conta Corrente', status: 'Ativo' });
      expect(p1.id).not.toBe(p2.id);
    });

    it('stores optional fields correctly', () => {
      const product = add({
        name: 'Produto Com Extras',
        type: 'Cartão de Crédito',
        description: 'Uma descrição',
        interestRate: 15.5,
        status: 'Inativo',
      });

      const stored = getById(product.id);
      expect(stored?.description).toBe('Uma descrição');
      expect(stored?.interestRate).toBe(15.5);
      expect(stored?.status).toBe('Inativo');
    });
  });

  // ── update ────────────────────────────────────────────────────────────────

  describe('update', () => {
    it('updates an existing product and returns the updated version', () => {
      const created = add({ name: 'Original', type: 'Conta Corrente', status: 'Ativo' });
      const updated = update(created.id, { name: 'Atualizado', status: 'Inativo' });

      expect(updated).toBeDefined();
      expect(updated?.name).toBe('Atualizado');
      expect(updated?.status).toBe('Inativo');
      // id and createdAt must not change
      expect(updated?.id).toBe(created.id);
      expect(updated?.createdAt).toBe(created.createdAt);
    });

    it('returns undefined for a non-existent id', () => {
      const result = update('non-existent', { name: 'X' });
      expect(result).toBeUndefined();
    });

    it('persists the update in the store', () => {
      const created = add({ name: 'Para Atualizar', type: 'Conta Poupança', status: 'Ativo' });
      update(created.id, { name: 'Atualizado Persistido' });

      const fetched = getById(created.id);
      expect(fetched?.name).toBe('Atualizado Persistido');
    });
  });

  // ── remove ────────────────────────────────────────────────────────────────

  describe('remove', () => {
    it('removes an existing product and returns true', () => {
      const created = add({ name: 'Para Remover', type: 'Conta Corrente', status: 'Ativo' });
      const result = remove(created.id);

      expect(result).toBe(true);
      expect(getById(created.id)).toBeUndefined();
    });

    it('returns false for a non-existent id', () => {
      const result = remove('non-existent-id');
      expect(result).toBe(false);
    });

    it('decrements the product count after removal', () => {
      const created = add({ name: 'Contagem', type: 'Conta Corrente', status: 'Ativo' });
      const before = getAll().length;
      remove(created.id);
      const after = getAll().length;
      expect(after).toBe(before - 1);
    });
  });
});
