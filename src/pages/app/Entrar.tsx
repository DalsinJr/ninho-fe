import { useState, type FormEvent } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Marca } from "@/components/aguia/Marca";
import { Button } from "@/components/ui/button";
import { authApi } from "@/lib/authApi";
import { useSessao } from "@/store/useSessao";

const ERRO_UNICO = "E-mail ou senha inválidos"; // §7.1: mesma mensagem para qualquer falha

export default function Entrar() {
  const entrar = useSessao((s) => s.entrar);
  const navigate = useNavigate();
  const location = useLocation();
  const [erro, setErro] = useState<string | null>(null);
  const [enviando, setEnviando] = useState(false);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const dados = new FormData(event.currentTarget);
    setEnviando(true);
    setErro(null);
    try {
      const usuario = await authApi.entrar(String(dados.get("email")), String(dados.get("senha")));
      entrar(usuario);
      navigate((location.state as { de?: string } | null)?.de ?? "/app", { replace: true });
    } catch {
      setErro(ERRO_UNICO);
    } finally {
      setEnviando(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      <form onSubmit={onSubmit} className="w-full max-w-sm space-y-6 rounded-lg border bg-card p-8 shadow-sm" noValidate>
        <div className="flex justify-center">
          <Marca variante="vertical" altura={96} />
        </div>
        <div className="space-y-4">
          <div className="space-y-1">
            <label htmlFor="email" className="text-sm font-medium">E-mail</label>
            <input id="email" name="email" type="email" autoComplete="username" required
              aria-describedby={erro ? "erro-login" : undefined}
              className="h-10 w-full rounded-md border border-input bg-background px-3" />
          </div>
          <div className="space-y-1">
            <label htmlFor="senha" className="text-sm font-medium">Senha</label>
            <input id="senha" name="senha" type="password" autoComplete="current-password" required
              aria-describedby={erro ? "erro-login" : undefined}
              className="h-10 w-full rounded-md border border-input bg-background px-3" />
          </div>
          {erro && (
            <p id="erro-login" role="alert" className="text-sm text-destructive">{erro}</p>
          )}
        </div>
        <Button type="submit" className="w-full" disabled={enviando}>
          Entrar
        </Button>
      </form>
    </div>
  );
}
