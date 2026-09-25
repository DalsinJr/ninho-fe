import { toast } from "sonner";
import { ApiError, definirAoNaoAutenticado, requestJson } from "@/lib/api";

vi.mock("sonner", () => ({ toast: { error: vi.fn(), success: vi.fn() } }));

function responder(status: number, corpo: unknown) {
  vi.stubGlobal("fetch", vi.fn().mockResolvedValue(new Response(corpo === null ? null : JSON.stringify(corpo), { status })));
}

describe("requestJson", () => {
  const aoNaoAutenticado = vi.fn();

  beforeEach(() => {
    definirAoNaoAutenticado(aoNaoAutenticado);
    aoNaoAutenticado.mockReset();
    vi.mocked(toast.error).mockReset();
  });

  afterEach(() => {
    definirAoNaoAutenticado(null);
    vi.unstubAllGlobals();
  });

  it("401 numa rota do backoffice avisa a sessão expirada", async () => {
    responder(401, null);
    await expect(requestJson("/api/v1/usuarios")).rejects.toBeInstanceOf(ApiError);
    expect(aoNaoAutenticado).toHaveBeenCalledOnce();
  });

  it("401 no login e no /auth/me não redireciona", async () => {
    responder(401, { message: "E-mail ou senha inválidos" });
    await expect(requestJson("/api/v1/auth/login", { method: "POST", body: {} })).rejects.toThrow("E-mail ou senha inválidos");
    responder(401, null);
    await expect(requestJson("/api/v1/auth/me")).rejects.toBeInstanceOf(ApiError);
    expect(aoNaoAutenticado).not.toHaveBeenCalled();
  });

  it("403 mostra o toast Sem permissão", async () => {
    responder(403, { message: "Sem permissão" });
    await expect(requestJson("/api/v1/usuarios")).rejects.toMatchObject({ status: 403 });
    expect(toast.error).toHaveBeenCalledWith("Sem permissão");
  });

  it("400 traz os fields da §5.1", async () => {
    responder(400, { message: "Informe o nome.", fields: [{ field: "nome", code: "OBRIGATORIO" }] });
    const erro = await requestJson("/api/v1/usuarios", { method: "POST", body: {} }).catch((e: ApiError) => e);
    expect(erro).toBeInstanceOf(ApiError);
    expect((erro as ApiError).fields).toEqual([{ field: "nome", code: "OBRIGATORIO" }]);
    expect((erro as ApiError).message).toBe("Informe o nome.");
  });
});
