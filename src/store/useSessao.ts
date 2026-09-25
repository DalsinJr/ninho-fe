import { create } from "zustand";

export type Papel = "RH_ADMIN" | "RH_RECRUTADOR" | "GESTOR" | "DIRETOR" | "DPO";

export interface UsuarioLogado {
  id: string;
  nome: string;
  email: string;
  papeis: Papel[];
}

/** `carregando` até o `/auth/me` responder: o cookie de sessão é a fonte de verdade (SPEC D12). */
export type StatusSessao = "carregando" | "anonimo" | "autenticado";

interface SessaoState {
  status: StatusSessao;
  usuario: UsuarioLogado | null;
  entrar: (usuario: UsuarioLogado) => void;
  sair: () => void;
}

/** Zustand só para sessão e UI; estado de servidor fica no TanStack Query (SPEC §3.3). */
export const useSessao = create<SessaoState>((set) => ({
  status: "carregando",
  usuario: null,
  entrar: (usuario) => set({ usuario, status: "autenticado" }),
  sair: () => set({ usuario: null, status: "anonimo" }),
}));

export function temAlgumPapel(usuario: UsuarioLogado | null, papeis: readonly Papel[]) {
  return !!usuario && usuario.papeis.some((p) => papeis.includes(p));
}
