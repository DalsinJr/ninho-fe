import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { Marca } from "./Marca";
import { Mascote } from "./Mascote";
import Landing from "@/pages/portal/Landing";

// SPEC §12.4 — distorção de marca é o defeito que passa em revisão humana.
describe("marca e mascote", () => {
  it("R1: <Marca> não aceita altura e largura ao mesmo tempo", () => {
    // @ts-expect-error — a API de tipos impede as duas dimensões
    render(<Marca altura={40} largura={120} />);
  });

  it("R1/R3: marca renderizada preserva a proporção e respeita o mínimo", () => {
    render(<Marca altura={24} />);
    const img = screen.getByRole("img", { name: "Escola América" });
    expect(img).toHaveStyle({ height: "24px", width: "auto" });
    expect(img.style.objectFit).not.toBe("cover");
  });

  it("R3: altura abaixo do mínimo sobe para o mínimo", () => {
    render(<Marca altura={10} />);
    expect(screen.getByRole("img", { name: "Escola América" })).toHaveStyle({ height: "24px" });
  });

  it("R8: mascote é decorativo", () => {
    const { container } = render(<Mascote pose="de-pe" tamanho={200} />);
    const img = container.querySelector("img[data-mascote]")!;
    expect(img).toHaveAttribute("alt", "");
    expect(img).toHaveAttribute("aria-hidden", "true");
  });

  it("R5: no máximo um mascote por tela", () => {
    for (const Tela of [Landing]) {
      const { container, unmount } = render(
        <MemoryRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
          <Tela />
        </MemoryRouter>,
      );
      expect(container.querySelectorAll("img[data-mascote]").length).toBeLessThanOrEqual(1);
      unmount();
    }
  });
});
