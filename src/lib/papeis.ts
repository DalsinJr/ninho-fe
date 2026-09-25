import type { Papel } from "@/store/useSessao";

/** Rótulo e escopo de cada papel, com o texto da SPEC §7.2 (rótulo de UI, não regra). */
export const PAPEIS: { papel: Papel; rotulo: string; descricao: string }[] = [
  { papel: "RH_ADMIN", rotulo: "RH — Administrador", descricao: "Tudo, incluindo usuários, estrutura e configuração de IA." },
  { papel: "RH_RECRUTADOR", rotulo: "RH — Recrutador", descricao: "Vagas, banco de talentos, pipeline, candidaturas e decisões." },
  { papel: "GESTOR", rotulo: "Gestor", descricao: "Requisições próprias; nas vagas que gere, só as etapas liberadas ao gestor." },
  { papel: "DIRETOR", rotulo: "Diretor", descricao: "Aprovação de requisições e relatórios." },
  { papel: "DPO", rotulo: "Encarregado (DPO)", descricao: "LGPD: pedidos de titulares, exportação, anonimização, retenção e auditoria." },
];

export function rotuloDoPapel(papel: Papel) {
  return PAPEIS.find((p) => p.papel === papel)?.rotulo ?? papel;
}
