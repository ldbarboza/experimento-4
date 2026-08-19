import React from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { productStore } from '@/lib/store';
import { Button } from '@/components/ui/Button';

export const dynamic = 'force-dynamic';

interface ProductDetailPageProps {
  params: { id: string };
}

export default function ProductDetailPage({ params }: ProductDetailPageProps) {
  const product = productStore.getById(params.id);

  if (!product) {
    notFound();
  }

  const fields = [
    { label: 'Nome', value: product.name },
    { label: 'Tipo', value: product.type },
    {
      label: 'Descrição',
      value: product.description ?? <span className="text-gray-400 italic">Não informado</span>,
    },
    {
      label: 'Taxa de Juros',
      value:
        product.interestRate !== undefined
          ? `${product.interestRate.toFixed(2)}%`
          : <span className="text-gray-400 italic">Não informado</span>,
    },
    { label: 'Status', value: product.status },
    {
      label: 'Criado em',
      value: new Date(product.createdAt).toLocaleString('pt-BR'),
    },
    { label: 'ID', value: <span className="font-mono text-xs text-gray-500">{product.id}</span> },
  ];

  return (
    <div className="max-w-2xl">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-sm text-gray-500 mb-6">
        <Link href="/" className="hover:text-blue-600 transition-colors">
          Produtos
        </Link>
        <span>/</span>
        <span className="text-gray-900 font-medium truncate max-w-[200px]">
          {product.name}
        </span>
      </nav>

      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 sm:p-8">
        <div className="flex items-start justify-between mb-6">
          <h1 className="text-xl font-bold text-gray-900">{product.name}</h1>
          <span
            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
              product.status === 'Ativo'
                ? 'bg-green-100 text-green-800'
                : 'bg-gray-100 text-gray-600'
            }`}
          >
            {product.status}
          </span>
        </div>

        <dl className="divide-y divide-gray-100">
          {fields.map(({ label, value }) => (
            <div key={label} className="py-3 sm:grid sm:grid-cols-3 sm:gap-4">
              <dt className="text-sm font-medium text-gray-500">{label}</dt>
              <dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">{value}</dd>
            </div>
          ))}
        </dl>

        <div className="mt-8 flex items-center gap-3">
          <Link href={`/products/${product.id}/edit`}>
            <Button variant="primary">Editar Produto</Button>
          </Link>
          <Link href="/">
            <Button variant="secondary">Voltar para a Lista</Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
