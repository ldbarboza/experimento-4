import React, { Suspense } from 'react';
import Link from 'next/link';
import { productStore } from '@/lib/store';
import { ProductList } from '@/components/ProductList';
import { Notification } from '@/components/Notification';
import { Button } from '@/components/ui/Button';

// Force dynamic rendering so the in-memory store is always read fresh
export const dynamic = 'force-dynamic';

export default function HomePage() {
  const products = productStore.getAll();

  return (
    <>
      <Suspense fallback={null}>
        <Notification />
      </Suspense>

      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Produtos Bancários</h1>
          <p className="mt-1 text-sm text-gray-500">
            {products.length} produto{products.length !== 1 ? 's' : ''} cadastrado
            {products.length !== 1 ? 's' : ''}.
          </p>
        </div>
        <Link href="/products/new">
          <Button>
            <svg
              className="h-4 w-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
            </svg>
            Novo Produto
          </Button>
        </Link>
      </div>

      <ProductList products={products} />
    </>
  );
}
