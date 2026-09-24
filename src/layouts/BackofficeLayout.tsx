import { NavLink, Outlet } from "react-router-dom";
import { Marca } from "@/components/aguia/Marca";
import { cn } from "@/lib/utils";
import { useSessao } from "@/store/useSessao";

const NAV = [
  { to: "/app", rotulo: "Início", fim: true },
  { to: "/app/banco-de-talentos", rotulo: "Banco de talentos" },
  { to: "/app/vagas", rotulo: "Vagas" },
  { to: "/app/requisicoes", rotulo: "Requisições" },
  { to: "/app/estrutura", rotulo: "Estrutura" },
  { to: "/app/usuarios", rotulo: "Usuários" },
  { to: "/app/configuracoes/ia", rotulo: "Configuração de IA" },
  { to: "/app/lgpd", rotulo: "LGPD" },
  { to: "/app/relatorios", rotulo: "Relatórios" },
];

export function BackofficeLayout() {
  const usuario = useSessao((s) => s.usuario);
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <header className="flex h-14 items-center justify-between border-b bg-surface px-4">
        <Marca altura={32} />
        <NavLink to="/app/perfil" className="text-sm text-muted-foreground hover:text-foreground">
          {usuario?.nome}
        </NavLink>
      </header>
      <div className="flex flex-1">
        <nav aria-label="Principal" className="hidden w-56 shrink-0 border-r bg-surface p-3 md:block">
          <ul className="space-y-1">
            {NAV.map((item) => (
              <li key={item.to}>
                <NavLink
                  to={item.to}
                  end={item.fim}
                  className={({ isActive }) =>
                    cn(
                      "block rounded-md px-3 py-2 text-sm hover:bg-accent",
                      isActive && "bg-secondary font-medium text-secondary-foreground",
                    )
                  }
                >
                  {item.rotulo}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>
        <main className="min-w-0 flex-1 p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
