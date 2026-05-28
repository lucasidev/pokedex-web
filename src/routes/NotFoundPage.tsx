import { Link } from 'react-router-dom';

export function NotFoundPage() {
  return (
    <div className="container mx-auto flex grow flex-col items-center justify-center gap-4">
      <h1 className="font-bold text-4xl text-cyan-950">404</h1>
      <p className="text-zinc-600">La pagina que buscas no existe.</p>
      <Link to="/" className="text-cyan-950 underline underline-offset-4">
        Volver al inicio
      </Link>
    </div>
  );
}
