import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
      <div className="mb-6">
        <span className="text-8xl font-bold text-gray-200">404</span>
      </div>
      <h1 className="text-2xl font-semibold text-gray-800 mb-2">
        Página não encontrada
      </h1>
      <p className="text-gray-500 mb-8 max-w-md">
        O produto ou página que você está procurando não existe ou foi removido.
      </p>
      <Link
        href="/"
        className="inline-flex items-center gap-2 rounded-md bg-blue-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-blue-700 transition-colors"
      >
        <svg
          className="w-4 h-4"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
        </svg>
        Voltar para a lista
      </Link>
    </div>
  );
}
