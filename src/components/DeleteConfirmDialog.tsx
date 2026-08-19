'use client';

import React, { useEffect } from 'react';
import { Button } from '@/components/ui/Button';

interface DeleteConfirmDialogProps {
  open: boolean;
  productName: string;
  onConfirm: () => void;
  onCancel: () => void;
  loading?: boolean;
}

export function DeleteConfirmDialog({
  open,
  productName,
  onConfirm,
  onCancel,
  loading = false,
}: DeleteConfirmDialogProps) {
  // Close on Escape key
  useEffect(() => {
    if (!open) return;
    function handleKey(e: KeyboardEvent) {
      if (e.key === 'Escape') onCancel();
    }
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [open, onCancel]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="dialog-title"
    >
      <div className="w-full max-w-md rounded-xl bg-white p-6 shadow-xl">
        <div className="mb-4 flex items-start gap-3">
          <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-red-100">
            <svg
              className="h-5 w-5 text-red-600"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 9v2m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"
              />
            </svg>
          </div>
          <div>
            <h2 id="dialog-title" className="text-base font-semibold text-gray-900">
              Excluir produto
            </h2>
            <p className="mt-1 text-sm text-gray-600">
              Tem certeza que deseja excluir o produto{' '}
              <span className="font-medium text-gray-900">&ldquo;{productName}&rdquo;</span>? Esta
              ação não pode ser desfeita.
            </p>
          </div>
        </div>

        <div className="flex justify-end gap-3">
          <Button variant="secondary" onClick={onCancel} disabled={loading}>
            Cancelar
          </Button>
          <Button variant="danger" onClick={onConfirm} loading={loading} disabled={loading}>
            Excluir
          </Button>
        </div>
      </div>
    </div>
  );
}
