/**
 * Gera public/brand/ a partir de brand-src/ (SPEC §9.4). `npm run assets`.
 *
 * - Largura sempre derivada da proporção: resize({ fit: "inside", withoutEnlargement: true }).
 * - WebP + PNG de fallback, em 1x e 2x.
 * - Falha se um derivado de mascote sair opaco (min(alfa) = 255).
 * - Sem os logos em brand-src/logos_sft_eav/, os derivados de marca e selo usam o mascote `de-pe`.
 */
import fs from "node:fs";
import path from "node:path";
import sharp from "sharp";
import { alfaMinimo, recortarMascote } from "./recortar-mascote";

const RAIZ = path.resolve(import.meta.dirname, "..");
const LOGOS = path.join(RAIZ, "brand-src/logos_sft_eav");
const MASCOTES = path.join(RAIZ, "brand-src/mascote_stf_eav");
const SAIDA = path.join(RAIZ, "public/brand");

const POSES = {
  "de-pe": { arquivo: "MASCOTE 3.png", alturas: [200, 240, 320] },
  oculos: { arquivo: "mascote 4.jpeg", alturas: [56, 96] },
  pensativo: { arquivo: "WhatsApp Image 2026-04-02 at 16.42.18.jpeg", alturas: [120, 180] },
  dinamico: { arquivo: "Gemini_Generated_Image_5wnsmd5wnsmd5wns.png", larguras: [400, 800] },
} as const;

type Dimensao = { height: number } | { width: number };

async function salvar(imagem: sharp.Sharp, nome: string, dim: Dimensao) {
  for (const [sufixo, escala] of [["", 1], ["@2x", 2]] as const) {
    const alvo = "height" in dim ? { height: dim.height * escala } : { width: dim.width * escala };
    const redimensionada = imagem.clone().resize({ ...alvo, fit: "inside", withoutEnlargement: true });
    await redimensionada.clone().webp({ quality: 88, alphaQuality: 100 }).toFile(path.join(SAIDA, `${nome}${sufixo}.webp`));
    await redimensionada.clone().png({ compressionLevel: 9 }).toFile(path.join(SAIDA, `${nome}${sufixo}.png`));
  }
}

function localizarLogo(trecho: string): string | undefined {
  if (!fs.existsSync(LOGOS)) return undefined;
  const arquivo = fs.readdirSync(LOGOS).find((f) => f.toLowerCase().includes(trecho) && f.toLowerCase().endsWith(".png"));
  return arquivo && path.join(LOGOS, arquivo);
}

async function main() {
  fs.rmSync(SAIDA, { recursive: true, force: true });
  fs.mkdirSync(SAIDA, { recursive: true });

  const recortes: Record<string, sharp.Sharp> = {};
  for (const [pose, def] of Object.entries(POSES)) {
    const recorte = await recortarMascote(path.join(MASCOTES, def.arquivo));
    const minimo = await alfaMinimo(recorte);
    if (minimo === 255) throw new Error(`Mascote "${pose}" continua opaco depois do recorte (min(alfa) = 255).`);
    recortes[pose] = recorte;

    if ("alturas" in def) for (const h of def.alturas) await salvar(recorte, `mascote-${pose}-${h}h`, { height: h });
    else for (const w of def.larguras) await salvar(recorte, `mascote-${pose}-${w}w`, { width: w });
    console.log(`mascote ${pose}: ok (min alfa ${minimo})`);
  }

  const horizontal = localizarLogo("horizontal");
  const vertical = localizarLogo("vertical");
  const selo = localizarLogo("estrela");
  const provisorio = recortes["de-pe"];
  if (!horizontal || !vertical || !selo) console.warn("Logos ausentes em brand-src/logos_sft_eav — usando o mascote de-pe como marca provisória.");

  const marcaH = horizontal ? sharp(horizontal) : provisorio;
  for (const h of [24, 32, 40, 56, 80]) await salvar(marcaH, `marca-horizontal-${h}h`, { height: h });
  const marcaV = vertical ? sharp(vertical) : provisorio;
  for (const h of [40, 64, 96]) await salvar(marcaV, `marca-vertical-${h}h`, { height: h });

  const seloBase = selo ? sharp(selo) : provisorio;
  for (const lado of [16, 32, 180, 192, 512]) {
    await seloBase
      .clone()
      .resize({ width: lado, height: lado, fit: "contain", background: { r: 255, g: 255, b: 255, alpha: 0 } })
      .png()
      .toFile(path.join(SAIDA, `selo-estrela-${lado}.png`));
  }
  console.log(`derivados gravados em ${path.relative(RAIZ, SAIDA)}/`);
}

main().catch((erro) => {
  console.error(erro);
  process.exit(1);
});
