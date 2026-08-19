'use client';

import { useEffect, useRef } from 'react';
import { Button } from '@/components/ui/Button';

interface DeleteConfirmDialogProps {
  isOpen: boolean;
  productName: string;
  onConfirm: () => void;
  onCancel: () => void;
  isDeleting?: boolean;
}

export function DeleteConfirmDialog({
  isOpen,
  productName,
  onConfirm,
  onCancel,
  isDeleting = false,
}: DeleteConfirmDialogProps) {
  const cancelRef = useRef<HTMLButtonElement>(null);

  // Focus the cancel button when dialog opens
  useEffect(() => {
    if (isOpen) {
      cancelRef.current?.focus();
    }
  }, [isOpen]);

  // Close on Escape key
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape' && isOpen) onCancel();
    }
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onCancel]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      role="dialog"
      aria-modal="true"
      aria-labelledby="dialog-title"
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50"
        onClick={onCancel}
        aria-hidden="true"
      />

      {/* Dialog panel */}
      <div className="relative z-10 w-full max-w-md mx-4 bg-white rounded-xl shadow-2xl p-6">
        <div className="flex items-start gap-4">
          {/* Warning icon */}
          <div className="flex-shrink-0 flex items-center justify-center w-10 h-10 rounded-full bg-red-100">
            <svg
              className="w-5 h-5 text-red-600"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z"
              />
            </svg>
          </div>

          <div className="flex-1">
            <h3
              id="dialog-title"
              className="text-base font-semibold text-gray-900"
            >
              Excluir produto
            </h3>
            <p className="mt-1 text-sm text-gray-600">
              Tem certeza que deseja excluir o produto{' '}
              <span className="font-medium text-gray-900">“{productName}”</span>?
              Esta ação não pode ser desfeita.
            </p>
          </div>
        </div>

        <div className="mt-6 flex justify-end gap-3">
          <Button
            ref={cancelRef}
            variant="secondary"
            onClick={onCancel}
            disabled={isDeleting}
          >
            Cancelar
          </Button>
          <Button
            variant="danger"
            onClick={onConfirm}
            isLoading={isDeleting}
          >
            {isDeleting ? 'Excluindo...' : 'Excluir'}
          </Button>
        </div>
      </div>
    </div>
  );
}
