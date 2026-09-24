import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster } from "sonner";
import { RequireAuth } from "@/components/RequireAuth";
import { BackofficeLayout } from "@/layouts/BackofficeLayout";
import { PortalLayout } from "@/layouts/PortalLayout";
import EmConstrucao from "@/pages/EmConstrucao";
import NaoEncontrada from "@/pages/NaoEncontrada";
import Dashboard from "@/pages/app/Dashboard";
import Entrar from "@/pages/app/Entrar";
import Landing from "@/pages/portal/Landing";

const queryClient = new QueryClient();

// Rotas da SPEC §10.1.
export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Toaster position="top-center" />
      <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
        <Routes>
          <Route element={<PortalLayout />}>
            <Route index element={<Landing />} />
            <Route path="cadastrar" element={<EmConstrucao titulo="Cadastro" fase="F3" />} />
            <Route path="cadastrar/confirmacao" element={<EmConstrucao titulo="Confirmação" fase="F3" />} />
            <Route path="meu-processo" element={<EmConstrucao titulo="Meu processo" fase="F3" />} />
            <Route path="privacidade" element={<EmConstrucao titulo="Privacidade" fase="F3" />} />
            <Route path="reconfirmar/:token" element={<EmConstrucao titulo="Reconfirmação" fase="F6" />} />
            <Route path="*" element={<NaoEncontrada />} />
          </Route>

          <Route path="app/entrar" element={<Entrar />} />
          <Route
            path="app"
            element={
              <RequireAuth>
                <BackofficeLayout />
              </RequireAuth>
            }
          >
            <Route index element={<Dashboard />} />
            <Route path="banco-de-talentos" element={<EmConstrucao titulo="Banco de talentos" fase="F3" />} />
            <Route path="vagas" element={<EmConstrucao titulo="Vagas" fase="F2" />} />
            <Route path="vagas/:id" element={<EmConstrucao titulo="Vaga" fase="F2" />} />
            <Route path="vagas/:id/pipeline" element={<EmConstrucao titulo="Pipeline" fase="F4" />} />
            <Route path="candidaturas/:id" element={<EmConstrucao titulo="Ficha do candidato" fase="F4" />} />
            <Route path="requisicoes" element={<EmConstrucao titulo="Requisições" fase="F2" />} />
            <Route path="estrutura" element={<EmConstrucao titulo="Estrutura organizacional" fase="F1" />} />
            <Route path="usuarios" element={<EmConstrucao titulo="Usuários" fase="F0" />} />
            <Route path="configuracoes/ia" element={<EmConstrucao titulo="Configuração de IA" fase="F5" />} />
            <Route path="lgpd" element={<EmConstrucao titulo="LGPD" fase="F6" />} />
            <Route path="relatorios" element={<EmConstrucao titulo="Relatórios" fase="F6" />} />
            <Route path="perfil" element={<EmConstrucao titulo="Perfil" fase="F0" />} />
            <Route path="*" element={<NaoEncontrada />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </QueryClientProvider>
  );
}
