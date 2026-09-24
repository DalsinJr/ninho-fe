import type { ReactNode } from "react";
import { Mascote } from "./Mascote";

interface EstadoVazioProps {
  titulo: string;
  descricao?: string;
  acao?: ReactNode;
  comMascote?: boolean;
}

export function EstadoVazio({ titulo, descricao, acao, comMascote = true }: EstadoVazioProps) {
  return (
    <div className="flex flex-col items-center gap-4 py-12 text-center">
      {comMascote && <Mascote pose="de-pe" tamanho={200} />}
      <div className="space-y-1">
        <h2 className="text-xl font-bold">{titulo}</h2>
        {descricao && <p className="max-w-md text-muted-foreground">{descricao}</p>}
      </div>
      {acao}
    </div>
  );
}
