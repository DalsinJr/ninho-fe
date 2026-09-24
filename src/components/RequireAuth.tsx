import type { ReactNode } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useSessao } from "@/store/useSessao";

/** Proteção de rota no front; a autorização efetiva é sempre do backend (SPEC §10.1). */
export function RequireAuth({ children }: { children: ReactNode }) {
  const usuario = useSessao((s) => s.usuario);
  const location = useLocation();
  if (!usuario) return <Navigate to="/app/entrar" replace state={{ de: location.pathname }} />;
  return <>{children}</>;
}
