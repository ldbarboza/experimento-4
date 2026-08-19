import React, { Suspense } from 'react';
import Link from 'next/link';
import { productStore } from '@/lib/store';
import { ProductList } from '@/components/ProductList';
import { Notification } from '@/components/Notification';
import { Button } from '@/components/ui/Button';

// Revalidate on every request so the list reflects the latest in-memory state
export const dynamic = 'force-dynamic';

export default async function HomePage() {
  const products = productStore.getAll();

  return (
    <>
      {/* Success notification — reads ?success= query param */}
      <Suspense fallback={null}>
        <Notification />
      </Suspense>

      {/* Page header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Produtos Bancários</h1>
          <p className="text-sm text-gray-500 mt-1">
            {products.length} produto{products.length !== 1 ? 's' : ''} cadastrado
            {products.length !== 1 ? 's' : ''}
          </p>
        </div>
        <Link href="/products/new">
          <Button variant="primary" size="md">
            <svg
              className="w-4 h-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2.5}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
            </svg>
            Novo Produto
          </Button>
        </Link>
      </div>

      {/* Product list */}
      <ProductList products={products} />
    </>
  );
}
