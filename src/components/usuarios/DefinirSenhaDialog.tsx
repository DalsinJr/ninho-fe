import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { aplicarErroDaApi } from "@/lib/errosFormulario";
import { usuariosApi, type UsuarioResumo } from "@/lib/usuariosApi";

const esquema = z.object({
  novaSenha: z.string().min(8, "A senha precisa ter ao menos 8 caracteres."),
});

type Formulario = z.infer<typeof esquema>;

/** "Definir nova senha" para outro usuário: não há recuperação por e-mail (SPEC D12). */
export function DefinirSenhaDialog({ usuario, aoFechar }: { usuario: UsuarioResumo | null; aoFechar: () => void }) {
  const [erroGeral, setErroGeral] = useState<string | null>(null);
  const {
    register,
    handleSubmit,
    reset,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<Formulario>({ resolver: zodResolver(esquema), defaultValues: { novaSenha: "" } });

  useEffect(() => {
    if (usuario) {
      reset({ novaSenha: "" });
      setErroGeral(null);
    }
  }, [usuario, reset]);

  const definir = useMutation({
    mutationFn: (f: Formulario) => usuariosApi.definirSenha(usuario!.id, f.novaSenha),
    onSuccess: () => {
      toast.success("Nova senha definida");
      aoFechar();
    },
    onError: (erro) => setErroGeral(aplicarErroDaApi(erro, setError, ["novaSenha"])),
  });

  return (
    <Dialog open={!!usuario} onOpenChange={(abrir) => !abrir && aoFechar()}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Definir nova senha</DialogTitle>
          <DialogDescription>Para {usuario?.nome}. Combine a entrega da senha com a pessoa.</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit((f) => definir.mutateAsync(f).catch(() => undefined))} noValidate className="space-y-4">
          {erroGeral && (
            <Alert variant="destructive" role="alert">
              <AlertDescription>{erroGeral}</AlertDescription>
            </Alert>
          )}
          <div className="space-y-1">
            <Label htmlFor="novaSenha">Nova senha</Label>
            <Input
              id="novaSenha"
              type="password"
              autoComplete="new-password"
              aria-invalid={!!errors.novaSenha}
              aria-describedby={errors.novaSenha ? "novaSenha-erro" : undefined}
              {...register("novaSenha")}
            />
            {errors.novaSenha && (
              <p id="novaSenha-erro" className="text-sm text-destructive">
                {errors.novaSenha.message}
              </p>
            )}
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={aoFechar}>
              Cancelar
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              Definir senha
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
