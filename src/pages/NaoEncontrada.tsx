import { Link } from "react-router-dom";

// R5: erro não leva mascote.
export default function NaoEncontrada() {
  return (
    <div className="container space-y-3 py-16 text-center">
      <h1 className="text-2xl font-bold">Página não encontrada</h1>
      <p className="text-muted-foreground">Confira o endereço ou volte ao início.</p>
      <Link to="/" className="text-primary underline-offset-4 hover:underline">
        Ir para o início
      </Link>
    </div>
  );
}
