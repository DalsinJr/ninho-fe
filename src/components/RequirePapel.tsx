import type { ReactNode } from "react";
import { temAlgumPapel, useSessao, type Papel } from "@/store/useSessao";

/**
 * Esconde a tela de quem não tem o papel. É conveniência de UI: a autorização efetiva é do backend (SPEC §10.1).
 * Sem mascote: é uma recusa (R5).
 */
export function RequirePapel({ papeis, children }: { papeis: readonly Papel[]; children: ReactNode }) {
  const usuario = useSessao((s) => s.usuario);
  if (!temAlgumPapel(usuario, papeis)) {
    return (
      <div className="space-y-2 py-12">
        <h1 className="text-2xl font-bold">Sem permissão</h1>
        <p className="text-muted-foreground">Seu usuário não tem acesso a esta tela. Fale com um administrador se precisar dela.</p>
      </div>
    );
  }
  return <>{children}</>;
}
