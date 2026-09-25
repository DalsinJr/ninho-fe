# ninho-fe — mapa

Regras e fluxo de git: `AGENTS.md`. Fonte de verdade: `docs/spec_software_eav.md`.

## Onde fica cada coisa

| Caminho                     | Conteúdo                                                                 |
| --------------------------- | ------------------------------------------------------------------------ |
| `src/App.tsx`               | rotas dos dois layouts (SPEC §10.1)                                      |
| `src/layouts/`              | `PortalLayout` (público, `/`) e `BackofficeLayout` (`/app`, logado)       |
| `src/pages/portal/`, `src/pages/app/` | telas; as ainda não feitas usam `pages/EmConstrucao.tsx`       |
| `src/components/aguia/`     | Design System: `Marca`, `Mascote`, `EstadoVazio`…                        |
| `src/components/ui/`        | shadcn (gerado)                                                          |
| `src/lib/api.ts`            | cliente base (`credentials: "include"`, `ApiError`)                      |
| `src/store/useSessao.ts`    | usuário logado                                                           |
| `src/index.css`, `tailwind.config.ts` | tokens "Águia" (SPEC §9.5)                                     |
| `brand-src/`                | originais de marca e mascote — nunca editados                            |
| `scripts/`                  | `recortar-mascote.ts`, `gerar-assets.ts` → `public/brand/`               |

## Comandos

```bash
npm run dev      # http://localhost:15180
npm run assets   # regenera public/brand a partir de brand-src
npm test
npm run lint
npm run build
```

## Estado

Fatia S1 (fundação e acesso) implementada: sessão restaurada por `/auth/me` no `RequireAuth` (F5 mantém o login), 401 leva a
`/app/entrar` (`TratadorSessaoExpirada`), 403 mostra "Sem permissão", `RequirePapel`, menu por papel (`lib/navegacao.ts`),
B8 Usuários e B12 Perfil. Os logos oficiais ainda não chegaram: a marca usa o mascote `de-pe` + nome em texto
(`MARCA_PROVISORIA` em `components/aguia/Marca.tsx`).

Testes: `src/test/renderizar.tsx` (`renderizar`, `logarComo`) e `src/test/axe.ts` (`violacoesCriticas`; contraste desligado no jsdom).
Planos das fatias: `../../docs/spec/ninho/mvp/` (workspace). Próxima fatia: S2 (estrutura organizacional).
