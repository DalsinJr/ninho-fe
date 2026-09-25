import { useQueryClient } from "@tanstack/react-query";
import { LogOut } from "lucide-react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { Marca } from "@/components/aguia/Marca";
import { Button } from "@/components/ui/button";
import { authApi } from "@/lib/authApi";
import { cn } from "@/lib/utils";
import { NAV } from "@/lib/navegacao";
import { temAlgumPapel, useSessao } from "@/store/useSessao";

export function BackofficeLayout() {
  const usuario = useSessao((s) => s.usuario);
  const sair = useSessao((s) => s.sair);
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const itens = NAV.filter((item) => temAlgumPapel(usuario, item.papeis));

  async function onSair() {
    try {
      await authApi.sair();
    } finally {
      sair();
      queryClient.clear();
      navigate("/app/entrar", { replace: true });
    }
  }

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <header className="flex h-14 items-center justify-between gap-4 border-b bg-surface px-4">
        <Marca altura={32} />
        <div className="flex items-center gap-2">
          <NavLink to="/app/perfil" className="text-sm text-muted-foreground hover:text-foreground">
            {usuario?.nome}
          </NavLink>
          <Button variant="ghost" size="sm" onClick={onSair}>
            <LogOut aria-hidden="true" />
            Sair
          </Button>
        </div>
      </header>
      <div className="flex flex-1">
        <nav aria-label="Principal" className="hidden w-56 shrink-0 border-r bg-surface p-3 md:block">
          <ul className="space-y-1">
            {itens.map((item) => (
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
