import { useEffect, type ReactNode } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { authApi } from "@/lib/authApi";
import { useSessao } from "@/store/useSessao";

/**
 * Proteção de rota no front; a autorização efetiva é sempre do backend (SPEC §10.1).
 * Ao abrir o backoffice (inclusive depois de um F5), confere a sessão em `/auth/me` antes de decidir.
 */
export function RequireAuth({ children }: { children: ReactNode }) {
  const status = useSessao((s) => s.status);
  const entrar = useSessao((s) => s.entrar);
  const sair = useSessao((s) => s.sair);
  const location = useLocation();

  useEffect(() => {
    if (status !== "carregando") return;
    let ativo = true;
    authApi
      .me()
      .then((usuario) => ativo && entrar(usuario))
      .catch(() => ativo && sair());
    return () => {
      ativo = false;
    };
  }, [status, entrar, sair]);

  if (status === "carregando") {
    return (
      <div role="status" aria-live="polite" className="flex min-h-screen items-center justify-center text-muted-foreground">
        Carregando…
      </div>
    );
  }
  if (status === "anonimo") return <Navigate to="/app/entrar" replace state={{ de: location.pathname }} />;
  return <>{children}</>;
}
