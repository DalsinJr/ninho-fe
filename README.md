# ninho-fe

Frontend do **Ninho** — Plataforma de Talentos Escola América. Uma SPA com o Portal do Candidato (`/`) e o backoffice (`/app`).

## Subir

Requer Node.js 22 e o `ninho-be` rodando em http://localhost:18090.

```bash
cp .env.example .env
npm install
npm run dev
```

Portal em http://localhost:15180 · Backoffice em http://localhost:15180/app.

Os derivados de marca em `public/brand/` são versionados; só rode `npm run assets` quando algo em `brand-src/` mudar.

Especificação: [docs/spec_software_eav.md](docs/spec_software_eav.md).
