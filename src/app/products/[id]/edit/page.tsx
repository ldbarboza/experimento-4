import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { productStore } from '@/lib/store';
import { ProductForm } from '@/components/ProductForm';

export const dynamic = 'force-dynamic';

type Props = { params: { id: string } };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const product = productStore.getById(params.id);
  return {
    title: product ? `Editar: ${product.name}` : 'Produto não encontrado',
  };
}

export default function EditProductPage({ params }: Props) {
  const product = productStore.getById(params.id);

  if (!product) {
    notFound();
  }

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
        <Link
          href={`/products/${product.id}`}
          className="hover:text-blue-600 transition-colors"
        >
          {product.name}
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
        <span className="text-gray-900 font-medium">Editar</span>
      </nav>

      {/* Card */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-8">
        <div className="mb-6">
          <h1 className="text-xl font-bold text-gray-900">
            Editar produto
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            Atualize os campos abaixo e salve as alterações.
          </p>
        </div>

        <ProductForm initialData={product} />
      </div>
    </div>
  );
}
