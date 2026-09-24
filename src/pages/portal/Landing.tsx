import { Link } from "react-router-dom";
import { Mascote } from "@/components/aguia/Mascote";
import { Button } from "@/components/ui/button";

// Pela D7, a linguagem é "faça parte do nosso time" — nunca "vagas abertas".
const PASSOS = [
  "Você se cadastra e escolhe as posições que deseja",
  "Seu cadastro fica no nosso banco de talentos",
  "Quando surgir uma oportunidade compatível, a gente entra em contato",
];

export default function Landing() {
  return (
    <>
      <section className="bg-surface">
        <div className="container flex items-center justify-between gap-8 py-12 md:py-16">
          <div className="max-w-xl animate-entrar space-y-4">
            <h1 className="text-3xl font-extrabold text-azul md:text-4xl">Faça parte da Escola América</h1>
            <p className="text-lg text-muted-foreground">Educação que transforma — e um time que faz isso todo dia.</p>
            <Button asChild size="lg" className="min-h-11">
              <Link to="/cadastrar">Quero me cadastrar</Link>
            </Button>
          </div>
          <div className="hidden md:block">
            <Mascote pose="dinamico" tamanho={400} />
          </div>
        </div>
      </section>
      <section className="container py-12">
        <h2 className="mb-6 text-2xl font-bold">Como funciona</h2>
        <ol className="grid gap-4 md:grid-cols-3">
          {PASSOS.map((passo, i) => (
            <li key={passo} className="flex gap-3 rounded-lg border bg-card p-4">
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-secondary font-mono font-semibold text-secondary-foreground">
                {i + 1}
              </span>
              <span>{passo}</span>
            </li>
          ))}
        </ol>
      </section>
    </>
  );
}
