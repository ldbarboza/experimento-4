import React from 'react';
import Link from 'next/link';
import { ProductForm } from '@/components/ProductForm';

export const metadata = {
  title: 'Novo Produto | Produtos Bancários',
};

export default function NewProductPage() {
  return (
    <div className="mx-auto max-w-2xl">
      <div className="mb-6">
        <Link
          href="/"
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
          Voltar para a lista
        </Link>
        <h1 className="mt-2 text-2xl font-bold text-gray-900">Novo Produto</h1>
        <p className="mt-1 text-sm text-gray-500">Preencha os dados para cadastrar um novo produto bancário.</p>
      </div>

      <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
        <ProductForm />
      </div>
    </div>
  );
}
