import { cn } from "@/lib/utils";
import { derivadoMaisProximo, fontes } from "./derivados";

/**
 * Enquanto os logos oficiais não chegam (brand-src/logos_sft_eav), a marca é o mascote `de-pe`
 * acompanhado do nome em texto. Quando chegarem, `npm run assets` troca a imagem e isto vira `false`.
 */
export const MARCA_PROVISORIA = true;

const ALTURAS = { horizontal: [24, 32, 40, 56, 80], vertical: [40, 64, 96] } as const;
const MINIMO = { horizontal: 24, vertical: 40 } as const; // R3

type Variante = keyof typeof ALTURAS;

// R1: aceita altura OU largura — os tipos impedem as duas ao mesmo tempo.
type Dimensao = { altura: number; largura?: never } | { largura: number; altura?: never };

export type MarcaProps = Dimensao & {
  variante?: Variante;
  /** Repetida no rodapé, a marca é decorativa (R8). */
  decorativa?: boolean;
  className?: string;
};

export function Marca({ variante = "horizontal", decorativa = false, className, ...dim }: MarcaProps) {
  const alturaAlvo = Math.max(dim.altura ?? MINIMO[variante], MINIMO[variante]);
  const derivado = derivadoMaisProximo(ALTURAS[variante], alturaAlvo);
  const src = fontes(`marca-${variante}-${derivado}h`);
  const estilo = dim.largura !== undefined ? { width: `${dim.largura}px`, height: "auto" } : { height: `${alturaAlvo}px`, width: "auto" };

  return (
    <span className={cn("inline-flex items-center gap-2", variante === "vertical" && "flex-col", className)}>
      <picture className="contents">
        <source type="image/webp" srcSet={src.webp} />
        <img
          src={src.png}
          srcSet={src.png2x}
          alt={decorativa ? "" : "Escola América"}
          aria-hidden={decorativa || undefined}
          style={{ ...estilo, objectFit: "contain" }}
        />
      </picture>
      {MARCA_PROVISORIA && (
        <span aria-hidden="true" className="font-display font-extrabold leading-none text-azul">
          Escola <span className="text-vermelho">América</span>
        </span>
      )}
    </span>
  );
}
