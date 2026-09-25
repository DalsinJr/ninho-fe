import type { FieldValues, Path, UseFormSetError } from "react-hook-form";
import { ApiError } from "@/lib/api";

const MENSAGEM_POR_CODIGO: Record<string, string> = {
  OBRIGATORIO: "Campo obrigatório.",
  TAMANHO: "Tamanho fora do permitido.",
  FORMATO: "Formato inválido.",
  INVALIDO: "Valor inválido.",
};

/**
 * Leva o erro do backend para o formulário: `fields` vão para os campos; o resto volta como mensagem
 * geral (ex.: "Este é o último administrador ativo"). A regra é sempre do backend.
 */
export function aplicarErroDaApi<T extends FieldValues>(
  erro: unknown,
  setError: UseFormSetError<T>,
  campos: readonly Path<T>[],
  campoDoConflito?: Path<T>,
): string | null {
  if (!(erro instanceof ApiError)) return "Não foi possível concluir. Tente de novo.";
  const conhecidos = erro.fields.filter((f) => campos.includes(f.field as Path<T>));
  conhecidos.forEach((f, i) =>
    setError(f.field as Path<T>, { message: i === 0 ? erro.message : MENSAGEM_POR_CODIGO[f.code] ?? erro.message }),
  );
  if (conhecidos.length > 0) return null;
  if (erro.status === 409 && campoDoConflito) {
    setError(campoDoConflito, { message: erro.message });
    return null;
  }
  return erro.message;
}
