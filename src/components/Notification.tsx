'use client';

import { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';

const MESSAGES: Record<string, string> = {
  created: 'Produto cadastrado com sucesso!',
  updated: 'Produto atualizado com sucesso!',
};

export function Notification() {
  const searchParams = useSearchParams();
  const router = useRouter();
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
        // Remove the query param from the URL
        router.replace('/');
      }, 4000);

      return () => clearTimeout(timer);
    }
  }, [successParam, router]);

  if (!visible) return null;

  return (
    <div
      role="status"
      aria-live="polite"
      className="fixed top-4 right-4 z-50 flex items-center gap-3 bg-green-600 text-white px-5 py-3 rounded-lg shadow-lg animate-in slide-in-from-top-2"
    >
      <svg
        className="w-5 h-5 flex-shrink-0"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={2}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
        />
      </svg>
      <span className="text-sm font-medium">{message}</span>
      <button
        onClick={() => {
          setVisible(false);
          router.replace('/');
        }}
        className="ml-2 text-white/80 hover:text-white transition-colors"
        aria-label="Fechar notificação"
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
            d="M6 18L18 6M6 6l12 12"
          />
        </svg>
      </button>
    </div>
  );
}
