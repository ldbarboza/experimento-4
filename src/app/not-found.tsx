import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center py-24 text-center">
      <p className="text-7xl font-extrabold text-blue-600">404</p>
      <h1 className="mt-4 text-2xl font-bold text-gray-900">Página não encontrada</h1>
      <p className="mt-2 text-gray-500">
        O recurso que você está procurando não existe ou foi removido.
      </p>
      <Link
        href="/"
        className="mt-6 inline-flex items-center gap-2 rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-blue-700"
      >
        Voltar para a lista
      </Link>
    </div>
  );
}
