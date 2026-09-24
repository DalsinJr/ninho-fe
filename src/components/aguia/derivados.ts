/** Derivados gerados por `npm run assets` em public/brand (SPEC §9.4). */
export const BRAND = "/brand";

/** Escolhe o menor derivado que cobre o tamanho pedido (ou o maior disponível). */
export function derivadoMaisProximo(disponiveis: readonly number[], alvo: number): number {
  return disponiveis.find((d) => d >= alvo) ?? disponiveis[disponiveis.length - 1];
}

export function fontes(nome: string) {
  return {
    webp: `${BRAND}/${nome}.webp 1x, ${BRAND}/${nome}@2x.webp 2x`,
    png: `${BRAND}/${nome}.png`,
    png2x: `${BRAND}/${nome}.png 1x, ${BRAND}/${nome}@2x.png 2x`,
  };
}
