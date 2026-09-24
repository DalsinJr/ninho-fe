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

Fase F0 em andamento: esqueleto com Portal (landing), login ligado a `POST /api/v1/auth/login` e backoffice protegido
por `RequireAuth`. Os logos oficiais ainda não chegaram: a marca usa o mascote `de-pe` + nome em texto
(`MARCA_PROVISORIA` em `components/aguia/Marca.tsx`).
