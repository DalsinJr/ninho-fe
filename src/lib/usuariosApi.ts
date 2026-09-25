import { requestJson } from "@/lib/api";
import type { Papel } from "@/store/useSessao";

/** Lista com teto (SPEC §5.4). */
export interface ListaLimitada<T> {
  itens: T[];
  truncado: boolean;
}

export interface UsuarioResumo {
  id: string;
  nome: string;
  email: string;
  papeis: Papel[];
  ativo: boolean;
  ultimoAcesso: string | null;
}

export interface FiltroUsuarios {
  q?: string;
  papel?: Papel | "";
  ativo?: "" | "true" | "false";
}

export interface NovoUsuario {
  nome: string;
  email: string;
  papeis: Papel[];
  senhaInicial: string;
}

export interface EdicaoUsuario {
  nome: string;
  email: string;
  papeis: Papel[];
  ativo: boolean;
}

export const usuariosApi = {
  listar: (filtro: FiltroUsuarios) => {
    const params = new URLSearchParams();
    if (filtro.q?.trim()) params.set("q", filtro.q.trim());
    if (filtro.papel) params.set("papel", filtro.papel);
    if (filtro.ativo) params.set("ativo", filtro.ativo);
    const query = params.toString();
    return requestJson<ListaLimitada<UsuarioResumo>>(`/api/v1/usuarios${query ? `?${query}` : ""}`);
  },
  criar: (dados: NovoUsuario) => requestJson<UsuarioResumo>("/api/v1/usuarios", { method: "POST", body: dados }),
  atualizar: (id: string, dados: EdicaoUsuario) =>
    requestJson<UsuarioResumo>(`/api/v1/usuarios/${id}`, { method: "PUT", body: dados }),
  definirSenha: (id: string, novaSenha: string) =>
    requestJson<void>(`/api/v1/usuarios/${id}/senha`, { method: "PUT", body: { novaSenha } }),
};
