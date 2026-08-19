'use client';

import React, { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';

const messages: Record<string, string> = {
  created: 'Produto cadastrado com sucesso!',
  updated: 'Produto atualizado com sucesso!',
  deleted: 'Produto excluído com sucesso!',
};

export function Notification() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const success = searchParams.get('success');
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (success && messages[success]) {
      setVisible(true);
      const timer = setTimeout(() => {
        setVisible(false);
        router.replace('/');
      }, 3500);
      return () => clearTimeout(timer);
    }
  }, [success, router]);

  if (!visible || !success || !messages[success]) return null;

  return (
    <div
      role="alert"
      className="fixed right-4 top-4 z-50 flex items-center gap-3 rounded-xl border border-green-200 bg-green-50 px-5 py-3 shadow-lg"
    >
      <svg
        className="h-5 w-5 flex-shrink-0 text-green-600"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={2}
      >
        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
      </svg>
      <p className="text-sm font-medium text-green-800">{messages[success]}</p>
      <button
        onClick={() => {
          setVisible(false);
          router.replace('/');
        }}
        className="ml-2 text-green-600 hover:text-green-800"
        aria-label="Fechar notificação"
      >
        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </div>
  );
}
