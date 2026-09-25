import { useQuery } from "@tanstack/react-query";
import { format, parseISO } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Plus } from "lucide-react";
import { useState } from "react";
import { AvisoTruncado } from "@/components/aguia/AvisoTruncado";
import { EstadoVazio } from "@/components/aguia/EstadoVazio";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { DefinirSenhaDialog } from "@/components/usuarios/DefinirSenhaDialog";
import { UsuarioFormDialog } from "@/components/usuarios/UsuarioFormDialog";
import { useValorAtrasado } from "@/hooks/useValorAtrasado";
import { PAPEIS, rotuloDoPapel } from "@/lib/papeis";
import { usuariosApi, type FiltroUsuarios, type UsuarioResumo } from "@/lib/usuariosApi";

const SELECT = "h-10 rounded-md border border-input bg-background px-3 text-sm";

/** B8 — Usuários (SPEC §10.3). Busca e filtros vão ao servidor: a lista tem teto (§5.4). */
export default function Usuarios() {
  const [busca, setBusca] = useState("");
  const [papel, setPapel] = useState<FiltroUsuarios["papel"]>("");
  const [ativo, setAtivo] = useState<FiltroUsuarios["ativo"]>("");
  const q = useValorAtrasado(busca);
  const [formulario, setFormulario] = useState<{ aberto: boolean; usuario?: UsuarioResumo }>({ aberto: false });
  const [senhaDe, setSenhaDe] = useState<UsuarioResumo | null>(null);

  const lista = useQuery({
    queryKey: ["usuarios", { q, papel, ativo }],
    queryFn: () => usuariosApi.listar({ q, papel, ativo }),
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h1 className="text-2xl font-bold">Usuários</h1>
        <Button onClick={() => setFormulario({ aberto: true })}>
          <Plus aria-hidden="true" />
          Novo usuário
        </Button>
      </div>

      <div className="flex flex-wrap items-end gap-4">
        <div className="min-w-56 flex-1 space-y-1">
          <Label htmlFor="busca">Buscar por nome ou e-mail</Label>
          <Input id="busca" type="search" value={busca} onChange={(e) => setBusca(e.target.value)} />
        </div>
        <div className="space-y-1">
          <Label htmlFor="filtro-papel">Papel</Label>
          <select id="filtro-papel" className={SELECT} value={papel} onChange={(e) => setPapel(e.target.value as FiltroUsuarios["papel"])}>
            <option value="">Todos</option>
            {PAPEIS.map((p) => (
              <option key={p.papel} value={p.papel}>
                {p.rotulo}
              </option>
            ))}
          </select>
        </div>
        <div className="space-y-1">
          <Label htmlFor="filtro-ativo">Situação</Label>
          <select id="filtro-ativo" className={SELECT} value={ativo} onChange={(e) => setAtivo(e.target.value as FiltroUsuarios["ativo"])}>
            <option value="">Todos</option>
            <option value="true">Ativos</option>
            <option value="false">Inativos</option>
          </select>
        </div>
      </div>

      {lista.isError ? (
        <Alert variant="destructive" role="alert">
          <AlertDescription>Não foi possível carregar os usuários. Tente de novo.</AlertDescription>
        </Alert>
      ) : lista.isPending ? (
        <p role="status" className="text-muted-foreground">
          Carregando usuários…
        </p>
      ) : lista.data.itens.length === 0 ? (
        <EstadoVazio titulo="Nenhum usuário encontrado" descricao="Ajuste a busca ou os filtros." comMascote={false} />
      ) : (
        <>
          <AvisoTruncado truncado={lista.data.truncado} />
          <div className="overflow-x-auto rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nome</TableHead>
                  <TableHead>E-mail</TableHead>
                  <TableHead>Papéis</TableHead>
                  <TableHead>Situação</TableHead>
                  <TableHead>Último acesso</TableHead>
                  <TableHead aria-label="Ações" />
                </TableRow>
              </TableHeader>
              <TableBody>
                {lista.data.itens.map((u) => (
                  <TableRow key={u.id}>
                    <TableCell className="font-medium">{u.nome}</TableCell>
                    <TableCell>{u.email}</TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-1">
                        {u.papeis.map((p) => (
                          <Badge key={p} variant="secondary">
                            {rotuloDoPapel(p)}
                          </Badge>
                        ))}
                      </div>
                    </TableCell>
                    <TableCell>{u.ativo ? "Ativo" : "Inativo"}</TableCell>
                    <TableCell>{u.ultimoAcesso ? format(parseISO(u.ultimoAcesso), "dd/MM/yyyy HH:mm", { locale: ptBR }) : "—"}</TableCell>
                    <TableCell>
                      <div className="flex justify-end gap-2">
                        <Button variant="outline" size="sm" aria-label={`Editar — ${u.nome}`} onClick={() => setFormulario({ aberto: true, usuario: u })}>
                          Editar
                        </Button>
                        <Button variant="ghost" size="sm" aria-label={`Definir nova senha — ${u.nome}`} onClick={() => setSenhaDe(u)}>
                          Nova senha
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </>
      )}

      <UsuarioFormDialog aberto={formulario.aberto} usuario={formulario.usuario} aoFechar={() => setFormulario({ aberto: false })} />
      <DefinirSenhaDialog usuario={senhaDe} aoFechar={() => setSenhaDe(null)} />
    </div>
  );
}
