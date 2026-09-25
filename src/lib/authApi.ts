import { requestJson } from "@/lib/api";
import type { UsuarioLogado } from "@/store/useSessao";

export const authApi = {
  entrar: (email: string, senha: string) =>
    requestJson<UsuarioLogado>("/api/v1/auth/login", { method: "POST", body: { email, senha } }),
  sair: () => requestJson<void>("/api/v1/auth/logout", { method: "POST" }),
  me: () => requestJson<UsuarioLogado>("/api/v1/auth/me"),
  trocarSenha: (dados: { senhaAtual: string; novaSenha: string }) =>
    requestJson<void>("/api/v1/auth/me/senha", { method: "PUT", body: dados }),
};
