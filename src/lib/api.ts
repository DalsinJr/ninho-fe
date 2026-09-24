const DEFAULT_API_BASE_URL = "http://localhost:18090";

export class ApiError extends Error {
  status: number;
  details: unknown;

  constructor(message: string, status: number, details: unknown = null) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.details = details;
  }
}

export function getApiBaseUrl() {
  return (import.meta.env.VITE_API_BASE_URL ?? DEFAULT_API_BASE_URL).replace(/\/+$/, "");
}

function parseErrorMessage(details: unknown, fallback: string) {
  if (details && typeof details === "object" && "message" in details && typeof details.message === "string" && details.message.trim()) {
    return details.message;
  }
  return fallback;
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
