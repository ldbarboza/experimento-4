'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Product } from '@/types/product';
import { Button } from '@/components/ui/Button';
import { DeleteConfirmDialog } from '@/components/DeleteConfirmDialog';

interface ProductListProps {
  products: Product[];
}

const statusColors: Record<string, string> = {
  Ativo: 'bg-green-100 text-green-800',
  Inativo: 'bg-gray-100 text-gray-600',
};

export function ProductList({ products }: ProductListProps) {
  const router = useRouter();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [deleting, setDeleting] = useState(false);

  function openDeleteDialog(product: Product) {
    setSelectedProduct(product);
    setDialogOpen(true);
  }

  function closeDialog() {
    if (deleting) return;
    setDialogOpen(false);
    setSelectedProduct(null);
  }

  async function handleDelete() {
    if (!selectedProduct) return;
    setDeleting(true);
    try {
      const res = await fetch(`/api/products/${selectedProduct.id}`, {
        method: 'DELETE',
      });
      if (res.ok) {
        setDialogOpen(false);
        setSelectedProduct(null);
        router.refresh();
      }
    } finally {
      setDeleting(false);
    }
  }

  if (products.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-xl border-2 border-dashed border-gray-200 py-16 text-center">
        <svg
          className="mb-4 h-12 w-12 text-gray-300"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={1.5}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
          />
        </svg>
        <p className="text-base font-medium text-gray-500">Nenhum produto cadastrado.</p>
        <p className="mt-1 text-sm text-gray-400">
          Clique em &ldquo;Novo Produto&rdquo; para começar.
        </p>
      </div>
    );
  }

  return (
    <>
      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">
                Nome
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">
                Tipo
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">
                Status
              </th>
              <th className="px-6 py-3 text-right text-xs font-semibold uppercase tracking-wider text-gray-500">
                Ações
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 bg-white">
            {products.map((product) => (
              <tr key={product.id} className="transition-colors hover:bg-gray-50">
                <td className="px-6 py-4">
                  <Link
                    href={`/products/${product.id}`}
                    className="font-medium text-blue-600 hover:text-blue-800 hover:underline"
                  >
                    {product.name}
                  </Link>
                </td>
                <td className="px-6 py-4 text-sm text-gray-600">{product.type}</td>
                <td className="px-6 py-4">
                  <span
                    className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ${
                      statusColors[product.status] ?? 'bg-gray-100 text-gray-600'
                    }`}
                  >
                    {product.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-right">
                  <div className="flex justify-end gap-2">
                    <Link href={`/products/${product.id}/edit`}>
                      <Button variant="ghost" size="sm">
                        Editar
                      </Button>
                    </Link>
                    <Button
                      variant="danger"
                      size="sm"
                      onClick={() => openDeleteDialog(product)}
                    >
                      Excluir
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <DeleteConfirmDialog
        open={dialogOpen}
        productName={selectedProduct?.name ?? ''}
        onConfirm={handleDelete}
        onCancel={closeDialog}
        loading={deleting}
      />
    </>
  );
}
