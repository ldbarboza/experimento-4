'use client';

import React, { useEffect, useState } from 'react';
import { useSearchParams, useRouter, usePathname } from 'next/navigation';

const MESSAGES: Record<string, string> = {
  created: 'Produto cadastrado com sucesso!',
  updated: 'Produto atualizado com sucesso!',
};

export function Notification() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const [visible, setVisible] = useState(false);
  const [message, setMessage] = useState('');

  const successParam = searchParams.get('success');

  useEffect(() => {
    if (successParam && MESSAGES[successParam]) {
      setMessage(MESSAGES[successParam]);
      setVisible(true);

      // Auto-dismiss after 4 seconds
      const timer = setTimeout(() => {
        setVisible(false);
        // Remove the query param from the URL without re-rendering
        router.replace(pathname, { scroll: false });
      }, 4000);

      return () => clearTimeout(timer);
    }
  }, [successParam, router, pathname]);

  function handleDismiss() {
    setVisible(false);
    router.replace(pathname, { scroll: false });
  }

  if (!visible) return null;

  return (
    <div
      role="status"
      aria-live="polite"
      className="fixed top-4 right-4 z-50 flex items-center gap-3 rounded-lg bg-green-600 px-4 py-3 text-white shadow-lg max-w-sm animate-in"
    >
      {/* Check icon */}
      <svg
        className="w-5 h-5 flex-shrink-0"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={2.5}
      >
        <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
      </svg>

      <span className="text-sm font-medium flex-1">{message}</span>

      <button
        onClick={handleDismiss}
        className="flex-shrink-0 rounded p-0.5 hover:bg-green-700 transition-colors"
        aria-label="Fechar notificação"
      >
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </div>
  );
}
