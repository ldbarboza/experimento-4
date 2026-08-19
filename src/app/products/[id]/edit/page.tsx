import React from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { productStore } from '@/lib/store';
import { ProductForm } from '@/components/ProductForm';

export const dynamic = 'force-dynamic';

interface EditProductPageProps {
  params: { id: string };
}

export default function EditProductPage({ params }: EditProductPageProps) {
  const product = productStore.getById(params.id);

  if (!product) {
    notFound();
  }

  return (
    <div className="max-w-2xl">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-sm text-gray-500 mb-6">
        <Link href="/" className="hover:text-blue-600 transition-colors">
          Produtos
        </Link>
        <span>/</span>
        <Link
          href={`/products/${product.id}`}
          className="hover:text-blue-600 transition-colors truncate max-w-[150px]"
        >
          {product.name}
        </Link>
        <span>/</span>
        <span className="text-gray-900 font-medium">Editar</span>
      </nav>

      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 sm:p-8">
        <h1 className="text-xl font-bold text-gray-900 mb-6">Editar Produto</h1>
        <ProductForm initialData={product} />
      </div>
    </div>
  );
}
