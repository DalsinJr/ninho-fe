import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { render } from "@testing-library/react";
import type { ReactElement } from "react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { useSessao, type UsuarioLogado } from "@/store/useSessao";

export const ADMIN: UsuarioLogado = { id: "1", nome: "Administrador", email: "admin@ninho.local", papeis: ["RH_ADMIN", "DPO"] };
export const RECRUTADORA: UsuarioLogado = { id: "2", nome: "Rita", email: "rita@ninho.local", papeis: ["RH_RECRUTADOR"] };

export function logarComo(usuario: UsuarioLogado | null) {
  useSessao.setState(usuario ? { usuario, status: "autenticado" } : { usuario: null, status: "anonimo" });
}

/** Renderiza com QueryClient novo e roteador em memória; `rotas` recebe elementos de `<Route>`. */
export function renderizar(ui: ReactElement, { rota = "/app", caminho = "*" }: { rota?: string; caminho?: string } = {}) {
  const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false }, mutations: { retry: false } } });
  return render(
    <QueryClientProvider client={queryClient}>
      <MemoryRouter initialEntries={[rota]} future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
        <Routes>
          <Route path={caminho} element={ui} />
          <Route path="/app/entrar" element={<p>Tela de login</p>} />
        </Routes>
      </MemoryRouter>
    </QueryClientProvider>,
  );
}
