import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ApiError } from "@/lib/api";
import { authApi } from "@/lib/authApi";
import { aplicarErroDaApi } from "@/lib/errosFormulario";
import { rotuloDoPapel } from "@/lib/papeis";
import { useSessao } from "@/store/useSessao";

const esquema = z
  .object({
    senhaAtual: z.string().min(1, "Informe a senha atual."),
    novaSenha: z.string().min(8, "A nova senha precisa ter ao menos 8 caracteres."),
    confirmacao: z.string(),
  })
  .refine((f) => f.confirmacao === f.novaSenha, { path: ["confirmacao"], message: "A confirmação não confere com a nova senha." });

type Formulario = z.infer<typeof esquema>;

const VAZIO: Formulario = { senhaAtual: "", novaSenha: "", confirmacao: "" };

/** B12 — Perfil e troca de senha (SPEC §10.3). */
export default function Perfil() {
  const usuario = useSessao((s) => s.usuario);
  const [erroGeral, setErroGeral] = useState<string | null>(null);
  const {
    register,
    handleSubmit,
    reset,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<Formulario>({ resolver: zodResolver(esquema), defaultValues: VAZIO });

  const trocar = useMutation({
    mutationFn: (f: Formulario) => authApi.trocarSenha({ senhaAtual: f.senhaAtual, novaSenha: f.novaSenha }),
    onSuccess: () => {
      toast.success("Senha alterada");
      reset(VAZIO);
    },
    onError: (erro) => {
      // "Senha atual incorreta" é regra do backend (400 sem fields): vai para o campo da senha atual.
      if (erro instanceof ApiError && erro.status === 400 && erro.fields.length === 0) {
        setError("senhaAtual", { message: erro.message });
        return;
      }
      setErroGeral(aplicarErroDaApi(erro, setError, ["senhaAtual", "novaSenha"]));
    },
  });

  if (!usuario) return null;

  return (
    <div className="max-w-xl space-y-8">
      <section className="space-y-3">
        <h1 className="text-2xl font-bold">Perfil</h1>
        <dl className="grid grid-cols-[auto_1fr] gap-x-6 gap-y-2 text-sm">
          <dt className="text-muted-foreground">Nome</dt>
          <dd>{usuario.nome}</dd>
          <dt className="text-muted-foreground">E-mail</dt>
          <dd>{usuario.email}</dd>
          <dt className="text-muted-foreground">Papéis</dt>
          <dd className="flex flex-wrap gap-1">
            {usuario.papeis.map((p) => (
              <Badge key={p} variant="secondary">
                {rotuloDoPapel(p)}
              </Badge>
            ))}
          </dd>
        </dl>
      </section>

      <section className="space-y-4">
        <h2 className="text-xl font-bold">Trocar senha</h2>
        <form
          noValidate
          className="space-y-4"
          onSubmit={handleSubmit((f) => {
            setErroGeral(null);
            return trocar.mutateAsync(f).catch(() => undefined);
          })}
        >
          {erroGeral && (
            <Alert variant="destructive" role="alert">
              <AlertDescription>{erroGeral}</AlertDescription>
            </Alert>
          )}
          <CampoSenha id="senhaAtual" rotulo="Senha atual" autoComplete="current-password" erro={errors.senhaAtual?.message} registro={register("senhaAtual")} />
          <CampoSenha id="novaSenha" rotulo="Nova senha" autoComplete="new-password" erro={errors.novaSenha?.message} registro={register("novaSenha")} />
          <CampoSenha id="confirmacao" rotulo="Confirme a nova senha" autoComplete="new-password" erro={errors.confirmacao?.message} registro={register("confirmacao")} />
          <Button type="submit" disabled={isSubmitting}>
            Trocar senha
          </Button>
        </form>
      </section>
    </div>
  );
}

function CampoSenha({
  id,
  rotulo,
  autoComplete,
  erro,
  registro,
}: {
  id: string;
  rotulo: string;
  autoComplete: string;
  erro?: string;
  registro: ReturnType<ReturnType<typeof useForm<Formulario>>["register"]>;
}) {
  return (
    <div className="space-y-1">
      <Label htmlFor={id}>{rotulo}</Label>
      <Input id={id} type="password" autoComplete={autoComplete} aria-invalid={!!erro} aria-describedby={erro ? `${id}-erro` : undefined} {...registro} />
      {erro && (
        <p id={`${id}-erro`} className="text-sm text-destructive">
          {erro}
        </p>
      )}
    </div>
  );
}
