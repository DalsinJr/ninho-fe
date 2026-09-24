import { Link, Outlet } from "react-router-dom";
import { Marca } from "@/components/aguia/Marca";
import { Button } from "@/components/ui/button";

/** Portal do Candidato: público, mobile-first, só tema claro no MVP (SPEC §10.2). */
export function PortalLayout() {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <header className="border-b bg-surface">
        <div className="container flex h-16 items-center justify-between gap-4">
          <Link to="/" className="rounded-md">
            <Marca altura={32} className="md:hidden" />
            <Marca altura={40} className="hidden md:inline-flex" />
          </Link>
          <Button asChild variant="outline" size="sm" className="min-h-11">
            <Link to="/meu-processo">Meu processo</Link>
          </Button>
        </div>
      </header>
      <main className="flex-1">
        <Outlet />
      </main>
      <footer className="border-t bg-surface">
        <div className="container flex flex-col gap-2 py-6 text-sm text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
          <span>© Escola América</span>
          <Link to="/privacidade" className="underline-offset-4 hover:underline">
            Privacidade e seus dados
          </Link>
        </div>
      </footer>
    </div>
  );
}
