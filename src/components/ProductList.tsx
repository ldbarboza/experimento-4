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

const STATUS_BADGE: Record<string, string> = {
  Ativo: 'bg-green-100 text-green-800',
  Inativo: 'bg-gray-100 text-gray-600',
};

const TYPE_BADGE: Record<string, string> = {
  'Conta Corrente': 'bg-blue-100 text-blue-800',
  'Conta Poupança': 'bg-cyan-100 text-cyan-800',
  'Cartão de Crédito': 'bg-purple-100 text-purple-800',
  'Empréstimo Pessoal': 'bg-orange-100 text-orange-800',
  'Fundo de Investimento': 'bg-emerald-100 text-emerald-800',
};

export function ProductList({ products }: ProductListProps) {
  const router = useRouter();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  function openDeleteDialog(product: Product) {
    setSelectedProduct(product);
    setDialogOpen(true);
  }

  function closeDeleteDialog() {
    setDialogOpen(false);
    setSelectedProduct(null);
  }

  async function handleConfirmDelete() {
    if (!selectedProduct) return;
    setIsDeleting(true);

    try {
      const res = await fetch(`/api/products/${selectedProduct.id}`, {
        method: 'DELETE',
      });

      if (!res.ok) {
        console.error('Falha ao excluir produto');
      }
    } catch (err) {
      console.error('Erro de conexão ao excluir produto:', err);
    } finally {
      setIsDeleting(false);
      closeDeleteDialog();
      router.refresh();
    }
  }

  if (products.length === 0) {
    return (
      <div className="text-center py-16 px-4">
        <div className="mx-auto w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mb-4">
          <svg
            className="w-8 h-8 text-gray-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={1.5}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M20.25 7.5l-.625 10.632a2.25 2.25 0 01-2.247 2.118H6.622a2.25 2.25 0 01-2.247-2.118L3.75 7.5M10 11.25h4M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z"
            />
          </svg>
        </div>
        <p className="text-gray-500 text-lg font-medium">Nenhum produto cadastrado.</p>
        <p className="text-gray-400 text-sm mt-1">
          Clique em &ldquo;Novo Produto&rdquo; para começar.
        </p>
      </div>
    );
  }

  return (
    <>
      <div className="overflow-hidden rounded-xl border border-gray-200 shadow-sm">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                Nome
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                Tipo
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                Taxa de Juros
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                Criado em
              </th>
              <th className="px-6 py-3 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">
                Ações
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-100">
            {products.map((product) => (
              <tr key={product.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4">
                  <Link
                    href={`/products/${product.id}`}
                    className="font-medium text-gray-900 hover:text-blue-600 transition-colors"
                  >
                    {product.name}
                  </Link>
                  {product.description && (
                    <p className="text-xs text-gray-400 mt-0.5 line-clamp-1">
                      {product.description}
                    </p>
                  )}
                </td>
                <td className="px-6 py-4">
                  <span
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      TYPE_BADGE[product.type] ?? 'bg-gray-100 text-gray-700'
                    }`}
                  >
                    {product.type}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm text-gray-600">
                  {product.interestRate !== undefined
                    ? `${product.interestRate.toFixed(2)}%`
                    : '—'}
                </td>
                <td className="px-6 py-4">
                  <span
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      STATUS_BADGE[product.status] ?? 'bg-gray-100 text-gray-600'
                    }`}
                  >
                    {product.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm text-gray-500">
                  {new Date(product.createdAt).toLocaleDateString('pt-BR')}
                </td>
                <td className="px-6 py-4 text-right">
                  <div className="flex items-center justify-end gap-2">
                    <Link href={`/products/${product.id}`}>
                      <Button variant="ghost" size="sm">
                        Ver
                      </Button>
                    </Link>
                    <Link href={`/products/${product.id}/edit`}>
                      <Button variant="secondary" size="sm">
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
        isOpen={dialogOpen}
        productName={selectedProduct?.name ?? ''}
        isDeleting={isDeleting}
        onConfirm={handleConfirmDelete}
        onCancel={closeDeleteDialog}
      />
    </>
  );
}
