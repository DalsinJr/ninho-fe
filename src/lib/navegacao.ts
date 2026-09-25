import type { Papel } from "@/store/useSessao";

const TODOS: readonly Papel[] = ["RH_ADMIN", "RH_RECRUTADOR", "GESTOR", "DIRETOR", "DPO"];

// Acesso por tela conforme a SPEC §10.1. É só conveniência: quem autoriza é o backend.
export const NAV: { to: string; rotulo: string; papeis: readonly Papel[]; fim?: boolean }[] = [
  { to: "/app", rotulo: "Início", papeis: TODOS, fim: true },
  { to: "/app/banco-de-talentos", rotulo: "Banco de talentos", papeis: ["RH_ADMIN", "RH_RECRUTADOR"] },
  { to: "/app/vagas", rotulo: "Vagas", papeis: ["RH_ADMIN", "RH_RECRUTADOR", "GESTOR"] },
  { to: "/app/requisicoes", rotulo: "Requisições", papeis: ["RH_ADMIN", "RH_RECRUTADOR", "GESTOR", "DIRETOR"] },
  { to: "/app/estrutura", rotulo: "Estrutura", papeis: TODOS },
  { to: "/app/usuarios", rotulo: "Usuários", papeis: ["RH_ADMIN"] },
  { to: "/app/configuracoes/ia", rotulo: "Configuração de IA", papeis: ["RH_ADMIN"] },
  { to: "/app/lgpd", rotulo: "LGPD", papeis: ["RH_ADMIN", "DPO"] },
  { to: "/app/relatorios", rotulo: "Relatórios", papeis: ["RH_ADMIN", "RH_RECRUTADOR", "DIRETOR"] },
];
