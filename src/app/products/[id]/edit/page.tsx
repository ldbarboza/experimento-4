import React from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { productStore } from '@/lib/store';
import { ProductForm } from '@/components/ProductForm';

export const dynamic = 'force-dynamic';

interface EditProductPageProps {
  params: { id: string };
}

export async function generateMetadata({ params }: EditProductPageProps) {
  const product = productStore.getById(params.id);
  return {
    title: product ? `Editar: ${product.name} | Produtos Bancários` : 'Editar Produto',
  };
}

export default function EditProductPage({ params }: EditProductPageProps) {
  const product = productStore.getById(params.id);

  if (!product) {
    notFound();
  }

  return (
    <div className="mx-auto max-w-2xl">
      <div className="mb-6">
        <Link
          href={`/products/${product.id}`}
          className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700"
        >
          <svg
            className="h-4 w-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
          Voltar para detalhes
        </Link>
        <h1 className="mt-2 text-2xl font-bold text-gray-900">Editar Produto</h1>
        <p className="mt-1 text-sm text-gray-500">
          Atualize os dados do produto{' '}
          <span className="font-medium text-gray-700">{product.name}</span>.
        </p>
      </div>

      <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
        <ProductForm initialData={product} />
      </div>
    </div>
  );
}
