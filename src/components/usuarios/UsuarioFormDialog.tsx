import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState, type ReactNode } from "react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { aplicarErroDaApi } from "@/lib/errosFormulario";
import { PAPEIS } from "@/lib/papeis";
import { usuariosApi, type UsuarioResumo } from "@/lib/usuariosApi";
import type { Papel } from "@/store/useSessao";

// Só a forma é validada aqui; as regras (último administrador, e-mail único) vêm do backend.
const esquema = z.object({
  nome: z.string().trim().min(1, "Informe o nome."),
  email: z.string().trim().min(1, "Informe o e-mail.").email("Informe um e-mail válido."),
  papeis: z.array(z.enum(["RH_ADMIN", "RH_RECRUTADOR", "GESTOR", "DIRETOR", "DPO"])).min(1, "Selecione ao menos um papel."),
  senhaInicial: z.string(),
  ativo: z.boolean(),
});

type Formulario = z.infer<typeof esquema>;

const CAMPOS = ["nome", "email", "papeis", "senhaInicial", "ativo"] as const;

interface Props {
  aberto: boolean;
  aoFechar: () => void;
  /** Ausente = criação. */
  usuario?: UsuarioResumo;
}

export function UsuarioFormDialog({ aberto, aoFechar, usuario }: Props) {
  const criando = !usuario;
  const queryClient = useQueryClient();
  const [erroGeral, setErroGeral] = useState<string | null>(null);

  const {
    register,
    control,
    handleSubmit,
    reset,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<Formulario>({
    resolver: zodResolver(
      criando
        ? esquema.refine((f) => f.senhaInicial.length >= 8, {
            path: ["senhaInicial"],
            message: "A senha precisa ter ao menos 8 caracteres.",
          })
        : esquema,
    ),
    defaultValues: valoresIniciais(usuario),
  });

  useEffect(() => {
    if (aberto) {
      reset(valoresIniciais(usuario));
      setErroGeral(null);
    }
  }, [aberto, usuario, reset]);

  const salvar = useMutation({
    mutationFn: (f: Formulario) =>
      usuario
        ? usuariosApi.atualizar(usuario.id, { nome: f.nome, email: f.email, papeis: f.papeis as Papel[], ativo: f.ativo })
        : usuariosApi.criar({ nome: f.nome, email: f.email, papeis: f.papeis as Papel[], senhaInicial: f.senhaInicial }),
    onSuccess: () => {
      toast.success(criando ? "Usuário criado" : "Usuário atualizado");
      queryClient.invalidateQueries({ queryKey: ["usuarios"] });
      aoFechar();
    },
    onError: (erro) => setErroGeral(aplicarErroDaApi(erro, setError, CAMPOS, "email")),
  });

  const onSubmit = handleSubmit((f) => {
    setErroGeral(null);
    return salvar.mutateAsync(f).catch(() => undefined);
  });

  return (
    <Dialog open={aberto} onOpenChange={(abrir) => !abrir && aoFechar()}>
      <DialogContent className="max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{criando ? "Novo usuário" : "Editar usuário"}</DialogTitle>
          <DialogDescription>
            {criando ? "O usuário entra com o e-mail e a senha inicial." : "Usuários não são apagados: desative quem não deve mais entrar."}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={onSubmit} noValidate className="space-y-4">
          {erroGeral && (
            <Alert variant="destructive" role="alert">
              <AlertDescription>{erroGeral}</AlertDescription>
            </Alert>
          )}

          <Campo id="nome" rotulo="Nome" erro={errors.nome?.message}>
            <Input id="nome" autoComplete="name" aria-invalid={!!errors.nome} aria-describedby={errors.nome ? "nome-erro" : undefined} {...register("nome")} />
          </Campo>

          <Campo id="email" rotulo="E-mail" erro={errors.email?.message}>
            <Input id="email" type="email" autoComplete="email" aria-invalid={!!errors.email} aria-describedby={errors.email ? "email-erro" : undefined} {...register("email")} />
          </Campo>

          <fieldset className="space-y-2" aria-describedby={errors.papeis ? "papeis-erro" : undefined}>
            <legend className="text-sm font-medium">Papéis</legend>
            <Controller
              control={control}
              name="papeis"
              render={({ field }) => (
                <ul className="space-y-2">
                  {PAPEIS.map(({ papel, rotulo, descricao }) => {
                    const marcado = field.value.includes(papel);
                    return (
                      <li key={papel} className="flex items-start gap-3 rounded-md border p-3">
                        <Checkbox
                          id={`papel-${papel}`}
                          checked={marcado}
                          aria-describedby={`papel-${papel}-descricao`}
                          onCheckedChange={(v) =>
                            field.onChange(v ? [...field.value, papel] : field.value.filter((p) => p !== papel))
                          }
                          className="mt-0.5"
                        />
                        <div className="space-y-0.5">
                          <Label htmlFor={`papel-${papel}`}>{rotulo}</Label>
                          <p id={`papel-${papel}-descricao`} className="text-sm text-muted-foreground">
                            {descricao}
                          </p>
                        </div>
                      </li>
                    );
                  })}
                </ul>
              )}
            />
            {errors.papeis && (
              <p id="papeis-erro" className="text-sm text-destructive">
                {errors.papeis.message}
              </p>
            )}
          </fieldset>

          {criando ? (
            <Campo id="senhaInicial" rotulo="Senha inicial" erro={errors.senhaInicial?.message} dica="Ao menos 8 caracteres.">
              <Input
                id="senhaInicial"
                type="password"
                autoComplete="new-password"
                aria-invalid={!!errors.senhaInicial}
                aria-describedby={errors.senhaInicial ? "senhaInicial-erro" : "senhaInicial-dica"}
                {...register("senhaInicial")}
              />
            </Campo>
          ) : (
            <Controller
              control={control}
              name="ativo"
              render={({ field }) => (
                <div className="flex items-center gap-3">
                  <Checkbox id="ativo" checked={field.value} onCheckedChange={(v) => field.onChange(v === true)} />
                  <Label htmlFor="ativo">Ativo (pode entrar no backoffice)</Label>
                </div>
              )}
            />
          )}

          <DialogFooter>
            <Button type="button" variant="outline" onClick={aoFechar}>
              Cancelar
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {criando ? "Criar usuário" : "Salvar"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

function valoresIniciais(usuario?: UsuarioResumo): Formulario {
  return {
    nome: usuario?.nome ?? "",
    email: usuario?.email ?? "",
    papeis: usuario?.papeis ?? [],
    senhaInicial: "",
    ativo: usuario?.ativo ?? true,
  };
}

function Campo({ id, rotulo, erro, dica, children }: { id: string; rotulo: string; erro?: string; dica?: string; children: ReactNode }) {
  return (
    <div className="space-y-1">
      <Label htmlFor={id}>{rotulo}</Label>
      {children}
      {erro ? (
        <p id={`${id}-erro`} className="text-sm text-destructive">
          {erro}
        </p>
      ) : (
        dica && (
          <p id={`${id}-dica`} className="text-sm text-muted-foreground">
            {dica}
          </p>
        )
      )}
    </div>
  );
}
