# Ninho FE

Este arquivo vale para todo o repositório.

## Fluxo de Git

**Sempre commitar e push direto na `main`.** Não crie branches de feature, não abra PR, não faça merge.

- `git commit` direto em `main`, seguido de `git push origin main`.
- Só crie um branch separado se o usuário pedir **explicitamente** ("crie um branch", "abra um PR", "trabalhe em uma feature branch"). Sem essa instrução clara, o default é `main`.
- Se você se encontrar em um branch que não é `main` sem ter sido instruído, pare e pergunte antes de continuar.

## Documentação obrigatória

Fonte de verdade: `docs/spec_software_eav.md` (SPEC v2.0), cópia da que vive em `ninho-be/docs/`.

Prioridade:

1. regra de negócio desta SPEC
2. contrato e experiência
3. nada mais

## Stack

React 18 · TypeScript · Vite 5 · react-router-dom 6 · TanStack Query · Zustand · react-hook-form + zod · shadcn/ui (Radix) + Tailwind 3 · lucide-react · sonner · Vitest + Testing Library. Versões: SPEC §3.2.

## Regras obrigatórias

- **nenhuma regra de negócio no front** — ele renderiza o estado resolvido pelo backend
- um `src/lib/<dominio>Api.ts` por recurso, todos passando por `src/lib/api.ts`
- TanStack Query para todo estado de servidor; Zustand só para sessão e UI
- `src/components/ui/` é gerado pelo shadcn (`npx shadcn@latest add <componente>`) — não editar à mão
- componentes do domínio em `src/components/aguia/` (SPEC §9.7)
- o Portal nunca revela existência, quantidade ou detalhe de vagas (SPEC D7): linguagem "faça parte do nosso time"
- marca e mascote seguem R1–R8 (SPEC §9.2): nunca distorcer, `object-fit: cover` proibido, no máximo um mascote por tela, mascote nunca em erro/recusa
- o vermelho da marca é a cor destrutiva; o parecer "NÃO ADEQUADO" da IA é cinza (SPEC §9.6)
- `brand-src/` guarda os originais e nunca é editado; derivados só por `npm run assets`
- WCAG 2.1 AA (SPEC §9.8); Portal mobile-first a partir de 360 px, sem rolagem horizontal
