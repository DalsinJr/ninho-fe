import { Info } from "lucide-react";

/** Aviso de lista cortada no teto (SPEC §5.4, §9.7): uma lista que corta em silêncio mente por omissão. */
export function AvisoTruncado({ truncado, teto = 50 }: { truncado: boolean; teto?: number }) {
  if (!truncado) return null;
  return (
    <p role="status" className="flex items-center gap-2 rounded-md border bg-muted/50 px-3 py-2 text-sm text-muted-foreground">
      <Info aria-hidden="true" className="h-4 w-4 shrink-0" />
      Mostrando {teto} de mais resultados — refine a busca.
    </p>
  );
}
