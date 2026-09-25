import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ApiError } from "@/lib/api";
import { authApi } from "@/lib/authApi";
import Perfil from "@/pages/app/Perfil";
import { violacoesCriticas } from "@/test/axe";
import { RECRUTADORA, logarComo, renderizar } from "@/test/renderizar";

vi.mock("@/lib/authApi", () => ({ authApi: { trocarSenha: vi.fn() } }));
vi.mock("sonner", () => ({ toast: { success: vi.fn(), error: vi.fn() } }));

async function preencher(atual: string, nova: string, confirmacao: string) {
  const user = userEvent.setup();
  await user.type(screen.getByLabelText("Senha atual"), atual);
  await user.type(screen.getByLabelText("Nova senha"), nova);
  await user.type(screen.getByLabelText("Confirme a nova senha"), confirmacao);
  await user.click(screen.getByRole("button", { name: "Trocar senha" }));
}

describe("B12 — Perfil", () => {
  beforeEach(() => {
    logarComo(RECRUTADORA);
    vi.mocked(authApi.trocarSenha).mockReset();
  });

  it("mostra nome, e-mail e papéis", () => {
    renderizar(<Perfil />);
    expect(screen.getByText("rita@ninho.local")).toBeInTheDocument();
    expect(screen.getByText("RH — Recrutador")).toBeInTheDocument();
  });

  it("confirmação diferente bloqueia o envio", async () => {
    renderizar(<Perfil />);
    await preencher("senha-atual", "nova-senha-forte", "outra-coisa");

    expect(await screen.findByText("A confirmação não confere com a nova senha.")).toBeInTheDocument();
    expect(authApi.trocarSenha).not.toHaveBeenCalled();
  });

  it("senha atual incorreta aparece no campo certo", async () => {
    vi.mocked(authApi.trocarSenha).mockRejectedValue(new ApiError("Senha atual incorreta", 400, { message: "Senha atual incorreta" }));
    renderizar(<Perfil />);
    await preencher("errada", "nova-senha-forte", "nova-senha-forte");

    expect(await screen.findByText("Senha atual incorreta")).toBeInTheDocument();
    expect(screen.getByLabelText("Senha atual")).toHaveAttribute("aria-invalid", "true");
  });

  it("sucesso limpa o formulário", async () => {
    vi.mocked(authApi.trocarSenha).mockResolvedValue(undefined);
    renderizar(<Perfil />);
    await preencher("senha-atual", "nova-senha-forte", "nova-senha-forte");

    await waitFor(() => expect(screen.getByLabelText("Nova senha")).toHaveValue(""));
    expect(authApi.trocarSenha).toHaveBeenCalledWith({ senhaAtual: "senha-atual", novaSenha: "nova-senha-forte" });
  });

  it("não tem violação crítica de acessibilidade", async () => {
    const { container } = renderizar(<Perfil />);
    expect(await violacoesCriticas(container)).toEqual([]);
  });
});
