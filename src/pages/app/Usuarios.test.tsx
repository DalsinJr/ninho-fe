import { screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ApiError } from "@/lib/api";
import { usuariosApi, type UsuarioResumo } from "@/lib/usuariosApi";
import Usuarios from "@/pages/app/Usuarios";
import { violacoesCriticas } from "@/test/axe";
import { ADMIN, logarComo, renderizar } from "@/test/renderizar";

vi.mock("@/lib/usuariosApi", () => ({
  usuariosApi: { listar: vi.fn(), criar: vi.fn(), atualizar: vi.fn(), definirSenha: vi.fn() },
}));
vi.mock("sonner", () => ({ toast: { success: vi.fn(), error: vi.fn() } }));

const adminResumo: UsuarioResumo = {
  id: "00000000-0000-0000-0000-000000000001",
  nome: "Administrador",
  email: "admin@ninho.local",
  papeis: ["RH_ADMIN", "DPO"],
  ativo: true,
  ultimoAcesso: "2026-09-25T02:00:00Z",
};

describe("B8 — Usuários", () => {
  beforeEach(() => {
    logarComo(ADMIN);
    vi.mocked(usuariosApi.listar).mockResolvedValue({ itens: [adminResumo], truncado: false });
  });

  it("lista usuários com papéis e o aviso de truncamento quando cortada", async () => {
    vi.mocked(usuariosApi.listar).mockResolvedValue({ itens: [adminResumo], truncado: true });
    renderizar(<Usuarios />);

    const linha = await screen.findByRole("row", { name: /Administrador/ });
    expect(within(linha).getByText("RH — Administrador")).toBeInTheDocument();
    expect(within(linha).getByText("Encarregado (DPO)")).toBeInTheDocument();
    expect(screen.getByText(/refine a busca/)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Editar — Administrador" })).toBeInTheDocument();
  });

  it("valida no cliente senha curta e nenhum papel", async () => {
    const user = userEvent.setup();
    renderizar(<Usuarios />);
    await user.click(await screen.findByRole("button", { name: /Novo usuário/ }));

    const dialogo = await screen.findByRole("dialog");
    await user.type(within(dialogo).getByLabelText("Nome"), "Rita");
    await user.type(within(dialogo).getByLabelText("E-mail"), "rita@ninho.local");
    await user.type(within(dialogo).getByLabelText("Senha inicial"), "curta");
    await user.click(within(dialogo).getByRole("button", { name: "Criar usuário" }));

    expect(await within(dialogo).findByText("Selecione ao menos um papel.")).toBeInTheDocument();
    expect(within(dialogo).getByText("A senha precisa ter ao menos 8 caracteres.")).toBeInTheDocument();
    expect(usuariosApi.criar).not.toHaveBeenCalled();
  });

  it("mostra a regra do servidor: último administrador ativo", async () => {
    const user = userEvent.setup();
    vi.mocked(usuariosApi.atualizar).mockRejectedValue(
      new ApiError("Este é o último administrador ativo", 400, { message: "Este é o último administrador ativo" }),
    );
    renderizar(<Usuarios />);
    await user.click(await screen.findByRole("button", { name: "Editar — Administrador" }));

    const dialogo = await screen.findByRole("dialog");
    await user.click(within(dialogo).getByRole("checkbox", { name: "RH — Administrador" }));
    await user.click(within(dialogo).getByRole("button", { name: "Salvar" }));

    expect(await within(dialogo).findByRole("alert")).toHaveTextContent("Este é o último administrador ativo");
    expect(usuariosApi.atualizar).toHaveBeenCalledWith(adminResumo.id, expect.objectContaining({ papeis: ["DPO"] }));
  });

  it("leva o 409 de e-mail duplicado ao campo e-mail", async () => {
    const user = userEvent.setup();
    vi.mocked(usuariosApi.criar).mockRejectedValue(
      new ApiError("Já existe um usuário com este e-mail", 409, { message: "Já existe um usuário com este e-mail" }),
    );
    renderizar(<Usuarios />);
    await user.click(await screen.findByRole("button", { name: /Novo usuário/ }));

    const dialogo = await screen.findByRole("dialog");
    await user.type(within(dialogo).getByLabelText("Nome"), "Rita");
    await user.type(within(dialogo).getByLabelText("E-mail"), "admin@ninho.local");
    await user.click(within(dialogo).getByRole("checkbox", { name: "Gestor" }));
    await user.type(within(dialogo).getByLabelText("Senha inicial"), "senha-forte");
    await user.click(within(dialogo).getByRole("button", { name: "Criar usuário" }));

    await waitFor(() => expect(within(dialogo).getByLabelText("E-mail")).toHaveAttribute("aria-invalid", "true"));
    expect(within(dialogo).getByText("Já existe um usuário com este e-mail")).toBeInTheDocument();
  });

  it("busca vai ao servidor", async () => {
    const user = userEvent.setup();
    renderizar(<Usuarios />);
    await user.type(await screen.findByLabelText("Buscar por nome ou e-mail"), "rita");

    await waitFor(() => expect(usuariosApi.listar).toHaveBeenLastCalledWith({ q: "rita", papel: "", ativo: "" }));
  });

  it("página e diálogo sem violação crítica de acessibilidade", async () => {
    const user = userEvent.setup();
    const { container } = renderizar(<Usuarios />);
    await screen.findByRole("row", { name: /Administrador/ });
    expect(await violacoesCriticas(container)).toEqual([]);

    await user.click(screen.getByRole("button", { name: /Novo usuário/ }));
    expect(await violacoesCriticas(await screen.findByRole("dialog"))).toEqual([]);
  });
});
