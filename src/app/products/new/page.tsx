import type { Metadata } from 'next';
import Link from 'next/link';
import { ProductForm } from '@/components/ProductForm';

export const metadata: Metadata = {
  title: 'Novo Produto',
};

export default function NewProductPage() {
  return (
    <div className="max-w-2xl mx-auto">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-sm text-gray-500 mb-6">
        <Link href="/" className="hover:text-blue-600 transition-colors">
          Produtos
        </Link>
        <svg
          className="w-4 h-4"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
        </svg>
        <span className="text-gray-900 font-medium">Novo produto</span>
      </nav>

      {/* Card */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-8">
        <div className="mb-6">
          <h1 className="text-xl font-bold text-gray-900">
            Cadastrar novo produto
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            Preencha os campos abaixo para cadastrar um novo produto bancário.
          </p>
        </div>

        <ProductForm />
      </div>
    </div>
  );
}
