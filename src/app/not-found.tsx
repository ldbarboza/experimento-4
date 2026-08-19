import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Página não encontrada',
};

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
      <div className="text-8xl font-bold text-gray-200 mb-4">404</div>
      <h1 className="text-2xl font-bold text-gray-800 mb-2">
        Página não encontrada
      </h1>
      <p className="text-gray-500 mb-8 max-w-md">
        O produto ou página que você está procurando não existe ou foi removido.
      </p>
      <Link
        href="/"
        className="inline-flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-md font-medium hover:bg-blue-700 transition-colors"
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
            d="M10 19l-7-7m0 0l7-7m-7 7h18"
          />
        </svg>
        Voltar para a lista
      </Link>
    </div>
  );
}
