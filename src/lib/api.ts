import { toast } from "sonner";

const DEFAULT_API_BASE_URL = "http://localhost:18090";

/** Campo recusado numa validação (SPEC §5.1). */
export interface CampoInvalido {
  field: string;
  code: "OBRIGATORIO" | "TAMANHO" | "FORMATO" | "INVALIDO" | string;
}

export class ApiError extends Error {
  status: number;
  details: unknown;
  fields: CampoInvalido[];

  constructor(message: string, status: number, details: unknown = null) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.details = details;
    this.fields = parseFields(details);
  }
}

export function getApiBaseUrl() {
  return (import.meta.env.VITE_API_BASE_URL ?? DEFAULT_API_BASE_URL).replace(/\/+$/, "");
}

/** Rotas cujo 401 é resposta esperada, não sessão expirada. */
const ROTAS_SEM_REDIRECIONAMENTO = ["/api/v1/auth/login", "/api/v1/auth/me"];

let aoNaoAutenticado: (() => void) | null = null;

/** Registra o que fazer quando uma chamada do backoffice volta 401 (SPEC §10.1: ir para /app/entrar). */
export function definirAoNaoAutenticado(callback: (() => void) | null) {
  aoNaoAutenticado = callback;
}

function parseErrorMessage(details: unknown, fallback: string) {
  if (details && typeof details === "object" && "message" in details && typeof details.message === "string" && details.message.trim()) {
    return details.message;
  }
  return fallback;
}

function parseFields(details: unknown): CampoInvalido[] {
  if (details && typeof details === "object" && "fields" in details && Array.isArray(details.fields)) {
    return details.fields.filter(
      (f): f is CampoInvalido => !!f && typeof f === "object" && typeof f.field === "string" && typeof f.code === "string",
    );
  }
  return [];
}

/** Cliente base: todo `lib/<dominio>Api.ts` passa por aqui (SPEC §3.3). Sessão em cookie. */
export async function requestJson<T>(path: string, init: Omit<RequestInit, "body"> & { body?: unknown } = {}): Promise<T> {
  const response = await fetch(new URL(path, `${getApiBaseUrl()}/`).toString(), {
    ...init,
    credentials: "include",
    headers: {
      Accept: "application/json",
      ...(init.body !== undefined ? { "Content-Type": "application/json" } : {}),
      ...(init.headers ?? {}),
    },
    body: init.body === undefined ? undefined : JSON.stringify(init.body),
  });

  const text = await response.text();
  const details: unknown = text ? safeJson(text) : null;
  if (!response.ok) {
    if (response.status === 401 && !ROTAS_SEM_REDIRECIONAMENTO.includes(path)) {
      aoNaoAutenticado?.();
    }
    if (response.status === 403) {
      toast.error("Sem permissão");
    }
    throw new ApiError(parseErrorMessage(details, response.statusText || "Erro na requisição"), response.status, details);
  }
  return details as T;
}

function safeJson(text: string): unknown {
  try {
    return JSON.parse(text);
  } catch {
    return text;
  }
}
