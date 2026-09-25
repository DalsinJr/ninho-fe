import { screen } from "@testing-library/react";
import { RequireAuth } from "@/components/RequireAuth";
import { authApi } from "@/lib/authApi";
import { useSessao } from "@/store/useSessao";
import { ADMIN, renderizar } from "@/test/renderizar";

vi.mock("@/lib/authApi", () => ({ authApi: { me: vi.fn() } }));

describe("RequireAuth", () => {
  beforeEach(() => useSessao.setState({ usuario: null, status: "carregando" }));

  it("depois de um F5 com sessão válida continua logado", async () => {
    vi.mocked(authApi.me).mockResolvedValue(ADMIN);
    renderizar(<RequireAuth><p>Backoffice</p></RequireAuth>);

    expect(screen.getByRole("status")).toHaveTextContent("Carregando");
    expect(await screen.findByText("Backoffice")).toBeInTheDocument();
    expect(useSessao.getState().usuario).toEqual(ADMIN);
  });

  it("sem sessão vai para o login", async () => {
    vi.mocked(authApi.me).mockRejectedValue(new Error("401"));
    renderizar(<RequireAuth><p>Backoffice</p></RequireAuth>);

    expect(await screen.findByText("Tela de login")).toBeInTheDocument();
    expect(screen.queryByText("Backoffice")).not.toBeInTheDocument();
  });
});
