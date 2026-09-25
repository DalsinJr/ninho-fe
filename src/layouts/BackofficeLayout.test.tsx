import { screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { BackofficeLayout } from "@/layouts/BackofficeLayout";
import { authApi } from "@/lib/authApi";
import { useSessao } from "@/store/useSessao";
import { violacoesCriticas } from "@/test/axe";
import { ADMIN, RECRUTADORA, logarComo, renderizar } from "@/test/renderizar";

vi.mock("@/lib/authApi", () => ({ authApi: { sair: vi.fn().mockResolvedValue(null) } }));

function menu() {
  return within(screen.getByRole("navigation", { name: "Principal" }));
}

describe("BackofficeLayout", () => {
  it("RH_RECRUTADOR não vê Usuários nem Configuração de IA", () => {
    logarComo(RECRUTADORA);
    renderizar(<BackofficeLayout />);
    expect(menu().queryByRole("link", { name: "Usuários" })).not.toBeInTheDocument();
    expect(menu().queryByRole("link", { name: "Configuração de IA" })).not.toBeInTheDocument();
    expect(menu().getByRole("link", { name: "Vagas" })).toBeInTheDocument();
  });

  it("RH_ADMIN vê Usuários", () => {
    logarComo(ADMIN);
    renderizar(<BackofficeLayout />);
    expect(menu().getByRole("link", { name: "Usuários" })).toBeInTheDocument();
    expect(menu().getByRole("link", { name: "LGPD" })).toBeInTheDocument();
  });

  it("Sair encerra a sessão e volta ao login", async () => {
    logarComo(ADMIN);
    renderizar(<BackofficeLayout />);
    await userEvent.click(screen.getByRole("button", { name: "Sair" }));
    expect(authApi.sair).toHaveBeenCalled();
    expect(await screen.findByText("Tela de login")).toBeInTheDocument();
    expect(useSessao.getState().status).toBe("anonimo");
  });

  it("não tem violação crítica de acessibilidade", async () => {
    logarComo(ADMIN);
    const { container } = renderizar(<BackofficeLayout />);
    expect(await violacoesCriticas(container)).toEqual([]);
  });
});
