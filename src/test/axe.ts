import { configureAxe } from "vitest-axe";

// O jsdom não renderiza nem tem canvas: contraste de cor não é mensurável aqui. Ele fica garantido
// pelos tokens da SPEC §9.5; as demais regras do axe rodam normalmente.
const axe = configureAxe({ rules: { "color-contrast": { enabled: false } } });

/** Violações críticas do axe (meta da SPEC §11.1 e DoD §15.4: zero). */
export async function violacoesCriticas(container: Element) {
  const resultado = await axe(container);
  return resultado.violations.filter((v) => v.impact === "critical").map((v) => `${v.id}: ${v.help}`);
}
