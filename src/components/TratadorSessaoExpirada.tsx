import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { definirAoNaoAutenticado } from "@/lib/api";
import { useSessao } from "@/store/useSessao";

/** Um 401 no backoffice leva a /app/entrar, guardando a rota de origem (SPEC §10.1). */
export function TratadorSessaoExpirada() {
  const navigate = useNavigate();
  const location = useLocation();
  const sair = useSessao((s) => s.sair);

  useEffect(() => {
    definirAoNaoAutenticado(() => {
      sair();
      if (location.pathname.startsWith("/app") && location.pathname !== "/app/entrar") {
        navigate("/app/entrar", { replace: true, state: { de: location.pathname } });
      }
    });
    return () => definirAoNaoAutenticado(null);
  }, [navigate, location.pathname, sair]);

  return null;
}
