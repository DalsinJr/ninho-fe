/**
 * Remove o fundo branco opaco das poses do mascote (SPEC §9.1).
 *
 * Só o branco conectado à moldura é removido (preenchimento por inundação a partir das bordas);
 * o branco interno do personagem fica protegido pelo contorno escuro. Entre as luminâncias
 * LUMA_MIN e LUMA_MAX o alfa é proporcional, preservando o antisserrilhado. Cor, proporção e
 * traço não mudam (R6).
 */
import sharp from "sharp";

const LUMA_MIN = 216;
const LUMA_MAX = 246;

export async function recortarMascote(origem: string): Promise<sharp.Sharp> {
  const { data, info } = await sharp(origem).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
  const { width, height } = info;
  const luma = (i: number) => 0.2126 * data[i] + 0.7152 * data[i + 1] + 0.0722 * data[i + 2];

  const visitado = new Uint8Array(width * height);
  const fila = new Int32Array(width * height);
  let inicio = 0;
  let fim = 0;
  const semear = (x: number, y: number) => {
    const p = y * width + x;
    if (!visitado[p] && luma(p * 4) >= LUMA_MIN) {
      visitado[p] = 1;
      fila[fim++] = p;
    }
  };
  for (let x = 0; x < width; x++) {
    semear(x, 0);
    semear(x, height - 1);
  }
  for (let y = 0; y < height; y++) {
    semear(0, y);
    semear(width - 1, y);
  }

  while (inicio < fim) {
    const p = fila[inicio++];
    const i = p * 4;
    const l = luma(i);
    const fator = l >= LUMA_MAX ? 0 : (LUMA_MAX - l) / (LUMA_MAX - LUMA_MIN);
    data[i + 3] = Math.round(data[i + 3] * fator);

    const x = p % width;
    const y = (p - x) / width;
    if (x > 0) semear(x - 1, y);
    if (x < width - 1) semear(x + 1, y);
    if (y > 0) semear(x, y - 1);
    if (y < height - 1) semear(x, y + 1);
  }

  return sharp(data, { raw: { width, height, channels: 4 } }).png();
}

/** Mínimo do canal alfa. 255 significa opaco — checar só a existência do canal dá falso negativo. */
export async function alfaMinimo(imagem: sharp.Sharp): Promise<number> {
  const stats = await imagem.clone().ensureAlpha().stats();
  return stats.channels[3].min;
}
