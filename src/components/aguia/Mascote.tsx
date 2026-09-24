import { cn } from "@/lib/utils";
import { derivadoMaisProximo, fontes } from "./derivados";

const POSES = {
  "de-pe": { eixo: "h", tamanhos: [200, 240, 320] },
  oculos: { eixo: "h", tamanhos: [56, 96] },
  pensativo: { eixo: "h", tamanhos: [120, 180] },
  dinamico: { eixo: "w", tamanhos: [400, 800] },
} as const;

export type PoseMascote = keyof typeof POSES;

export interface MascoteProps {
  pose: PoseMascote;
  /** Altura em px (ou largura, para `dinamico`). A outra dimensão segue a proporção (R1). */
  tamanho: number;
  pulsar?: boolean;
  className?: string;
}

/**
 * Mascote decorativo (R8): `alt=""` e `aria-hidden`; o significado fica no texto ao lado.
 * Uso limitado a acolhimento, orientação e celebração — nunca em erro, recusa ou luto (R5).
 */
export function Mascote({ pose, tamanho, pulsar = false, className }: MascoteProps) {
  const { eixo, tamanhos } = POSES[pose];
  const derivado = derivadoMaisProximo(tamanhos, tamanho);
  const src = fontes(`mascote-${pose}-${derivado}${eixo}`);
  const estilo = eixo === "h" ? { height: `${tamanho}px`, width: "auto" } : { width: `${tamanho}px`, height: "auto" };

  return (
    <picture className="contents">
      <source type="image/webp" srcSet={src.webp} />
      <img
        data-mascote={pose}
        src={src.png}
        srcSet={src.png2x}
        alt=""
        aria-hidden="true"
        className={cn("max-w-full", pulsar && "animate-pulsar", className)}
        style={{ ...estilo, objectFit: "contain" }}
      />
    </picture>
  );
}
