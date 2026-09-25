import { useEffect, useState } from "react";

/** Devolve o valor só depois de `atraso` ms sem mudança (busca ao digitar). */
export function useValorAtrasado<T>(valor: T, atraso = 300) {
  const [atrasado, setAtrasado] = useState(valor);
  useEffect(() => {
    const id = setTimeout(() => setAtrasado(valor), atraso);
    return () => clearTimeout(id);
  }, [valor, atraso]);
  return atrasado;
}
