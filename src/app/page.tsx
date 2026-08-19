import { Suspense } from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { productStore } from '@/lib/store';
import { ProductList } from '@/components/ProductList';
import { Notification } from '@/components/Notification';

export const metadata: Metadata = {
  title: 'Lista de Produtos',
};

// Disable caching so the list always reflects the current in-memory state
export const dynamic = 'force-dynamic';

export default function HomePage() {
  const products = productStore.getAll();

  return (
    <div>
      {/* Page header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Produtos Bancários
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            {products.length === 0
              ? 'Nenhum produto cadastrado.'
              : `${products.length} produto${products.length !== 1 ? 's' : ''} cadastrado${products.length !== 1 ? 's' : ''}.`}
          </p>
        </div>
        <Link
          href="/products/new"
          className="inline-flex items-center gap-1.5 bg-blue-600 text-white text-sm font-medium px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
        >
          <svg
            className="w-4 h-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 4v16m8-8H4"
            />
          </svg>
          Novo produto
        </Link>
      </div>

      {/* Product list */}
      <ProductList products={products} />

      {/* Success notification (requires Suspense for useSearchParams) */}
      <Suspense fallback={null}>
        <Notification />
      </Suspense>
    </div>
  );
}
