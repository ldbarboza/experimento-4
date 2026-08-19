import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { productStore } from '@/lib/store';

export const dynamic = 'force-dynamic';

type Props = { params: { id: string } };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const product = productStore.getById(params.id);
  return {
    title: product ? product.name : 'Produto não encontrado',
  };
}

const TYPE_ICONS: Record<string, string> = {
  'Conta Corrente': '🏦',
  'Conta Poupança': '💰',
  'Cartão de Crédito': '💳',
  'Empréstimo Pessoal': '💸',
  'Fundo de Investimento': '📈',
};

export default function ProductDetailPage({ params }: Props) {
  const product = productStore.getById(params.id);

  if (!product) {
    notFound();
  }

  const fields = [
    { label: 'ID', value: product.id },
    { label: 'Nome', value: product.name },
    {
      label: 'Tipo',
      value: (
        <span className="flex items-center gap-1.5">
          <span>{TYPE_ICONS[product.type] ?? '💱'}</span>
          {product.type}
        </span>
      ),
    },
    {
      label: 'Descrição',
      value: product.description || (
        <span className="text-gray-400 italic">Sem descrição</span>
      ),
    },
    {
      label: 'Taxa de Juros',
      value:
        product.interestRate !== undefined
          ? `${product.interestRate.toFixed(2)}%`
          : <span className="text-gray-400">—</span>,
    },
    {
      label: 'Status',
      value: (
        <span
          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
            product.status === 'Ativo'
              ? 'bg-green-100 text-green-800'
              : 'bg-gray-100 text-gray-600'
          }`}
        >
          {product.status}
        </span>
      ),
    },
    {
      label: 'Cadastrado em',
      value: new Date(product.createdAt).toLocaleString('pt-BR'),
    },
  ];

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
        <span className="text-gray-900 font-medium">{product.name}</span>
      </nav>

      {/* Card */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        {/* Card header */}
        <div className="px-8 py-6 border-b border-gray-100 flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold text-gray-900">{product.name}</h1>
            <p className="mt-0.5 text-sm text-gray-500">{product.type}</p>
          </div>
          <Link
            href={`/products/${product.id}/edit`}
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
                d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
              />
            </svg>
            Editar
          </Link>
        </div>

        {/* Fields */}
        <dl className="divide-y divide-gray-100">
          {fields.map((field) => (
            <div
              key={field.label}
              className="px-8 py-4 flex flex-col sm:flex-row sm:gap-8"
            >
              <dt className="text-sm font-medium text-gray-500 sm:w-40 flex-shrink-0">
                {field.label}
              </dt>
              <dd className="mt-1 sm:mt-0 text-sm text-gray-900 break-all">
                {field.value}
              </dd>
            </div>
          ))}
        </dl>

        {/* Footer actions */}
        <div className="px-8 py-4 bg-gray-50 border-t border-gray-100 flex justify-end">
          <Link
            href="/"
            className="text-sm text-gray-500 hover:text-gray-700 transition-colors"
          >
            ← Voltar para a lista
          </Link>
        </div>
      </div>
    </div>
  );
}
