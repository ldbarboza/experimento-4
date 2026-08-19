import React from 'react';
import Link from 'next/link';
import { ProductForm } from '@/components/ProductForm';

export const metadata = {
  title: 'Novo Produto | Produtos Bancários',
};

export default function NewProductPage() {
  return (
    <div className="max-w-2xl">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-sm text-gray-500 mb-6">
        <Link href="/" className="hover:text-blue-600 transition-colors">
          Produtos
        </Link>
        <span>/</span>
        <span className="text-gray-900 font-medium">Novo Produto</span>
      </nav>

      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 sm:p-8">
        <h1 className="text-xl font-bold text-gray-900 mb-6">Cadastrar Novo Produto</h1>
        <ProductForm />
      </div>
    </div>
  );
}
