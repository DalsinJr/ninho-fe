import { create } from "zustand";

export type Papel = "RH_ADMIN" | "RH_RECRUTADOR" | "GESTOR" | "DIRETOR" | "DPO";

export interface UsuarioLogado {
  id: string;
  nome: string;
  email: string;
  papeis: Papel[];
}

interface SessaoState {
  usuario: UsuarioLogado | null;
  entrar: (usuario: UsuarioLogado) => void;
  sair: () => void;
}

/** Zustand só para sessão e UI; estado de servidor fica no TanStack Query (SPEC §3.3). */
export const useSessao = create<SessaoState>((set) => ({
  usuario: null,
  entrar: (usuario) => set({ usuario }),
  sair: () => set({ usuario: null }),
}));
