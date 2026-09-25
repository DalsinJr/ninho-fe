import { screen } from "@testing-library/react";
import { RequirePapel } from "@/components/RequirePapel";
import { ADMIN, RECRUTADORA, logarComo, renderizar } from "@/test/renderizar";

describe("RequirePapel", () => {
  it("mostra a tela a quem tem o papel", () => {
    logarComo(ADMIN);
    renderizar(<RequirePapel papeis={["RH_ADMIN"]}><p>Usuários</p></RequirePapel>);
    expect(screen.getByText("Usuários")).toBeInTheDocument();
  });

  it("mostra Sem permissão a quem não tem", () => {
    logarComo(RECRUTADORA);
    renderizar(<RequirePapel papeis={["RH_ADMIN"]}><p>Usuários</p></RequirePapel>);
    expect(screen.getByRole("heading", { name: "Sem permissão" })).toBeInTheDocument();
    expect(screen.queryByText("Usuários")).not.toBeInTheDocument();
  });
});
