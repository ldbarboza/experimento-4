'use client';

import { useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Product } from '@/types/product';
import { DeleteConfirmDialog } from '@/components/DeleteConfirmDialog';
import { Button } from '@/components/ui/Button';

interface ProductListProps {
  products: Product[];
}

const STATUS_STYLES: Record<string, string> = {
  Ativo: 'bg-green-100 text-green-800',
  Inativo: 'bg-gray-100 text-gray-600',
};

const TYPE_ICONS: Record<string, string> = {
  'Conta Corrente': '🏦',
  'Conta Poupança': '💰',
  'Cartão de Crédito': '💳',
  'Empréstimo Pessoal': '💸',
  'Fundo de Investimento': '📈',
};

export function ProductList({ products }: ProductListProps) {
  const router = useRouter();
  const [dialogState, setDialogState] = useState<{
    open: boolean;
    productId: string;
    productName: string;
  }>({
    open: false,
    productId: '',
    productName: '',
  });
  const [isDeleting, setIsDeleting] = useState(false);

  const openDialog = useCallback((id: string, name: string) => {
    setDialogState({ open: true, productId: id, productName: name });
  }, []);

  const closeDialog = useCallback(() => {
    setDialogState({ open: false, productId: '', productName: '' });
  }, []);

  const handleDelete = useCallback(async () => {
    setIsDeleting(true);
    try {
      const res = await fetch(`/api/products/${dialogState.productId}`, {
        method: 'DELETE',
      });
      if (res.ok) {
        closeDialog();
        router.refresh();
      } else {
        const data = await res.json();
        alert(data.error ?? 'Erro ao excluir produto.');
      }
    } catch {
      alert('Erro de conexão. Tente novamente.');
    } finally {
      setIsDeleting(false);
    }
  }, [dialogState.productId, closeDialog, router]);

  if (products.length === 0) {
    return (
      <div className="text-center py-20">
        <div className="text-6xl mb-4">🏦</div>
        <h3 className="text-lg font-semibold text-gray-700 mb-2">
          Nenhum produto cadastrado.
        </h3>
        <p className="text-sm text-gray-500 mb-6">
          Comece cadastrando seu primeiro produto bancário.
        </p>
        <Link href="/products/new">
          <Button>Cadastrar produto</Button>
        </Link>
      </div>
    );
  }

  return (
    <>
      <div className="overflow-x-auto rounded-xl border border-gray-200 shadow-sm">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                Produto
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
                Cadastrado em
              </th>
              <th className="px-6 py-3 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">
                Ações
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-100">
            {products.map((product) => (
              <tr
                key={product.id}
                className="hover:bg-gray-50 transition-colors duration-100"
              >
                <td className="px-6 py-4">
                  <Link
                    href={`/products/${product.id}`}
                    className="font-medium text-blue-600 hover:text-blue-800 hover:underline"
                  >
                    {product.name}
                  </Link>
                </td>
                <td className="px-6 py-4 text-sm text-gray-600">
                  <span className="flex items-center gap-1.5">
                    <span>{TYPE_ICONS[product.type] ?? '💱'}</span>
                    {product.type}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm text-gray-600">
                  {product.interestRate !== undefined
                    ? `${product.interestRate.toFixed(2)}%`
                    : <span className="text-gray-400">—</span>}
                </td>
                <td className="px-6 py-4">
                  <span
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      STATUS_STYLES[product.status] ?? 'bg-gray-100 text-gray-600'
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
                      onClick={() => openDialog(product.id, product.name)}
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
        isOpen={dialogState.open}
        productName={dialogState.productName}
        onConfirm={handleDelete}
        onCancel={closeDialog}
        isDeleting={isDeleting}
      />
    </>
  );
}
