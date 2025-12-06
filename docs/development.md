# Local Development Guide

This guide documents the workflow for running, testing, and building every part
of the portfolio locally.

## Requirements

- Node.js **18+** (recommended 20.x to match production) and npm **10+**.
- MongoDB Atlas connection string (or a local MongoDB instance) for the backend.
- Two terminal tabs so you can run the backend and frontend simultaneously (or
  use the root-level scripts described below).

## 1. Environment variables

Create environment files from the provided examples before running anything:

| Location        | Copy from                        | Notes |
|----------------|-----------------------------------|-------|
| `backend/.env` | `backend/.env.example`            | Set `MONGODB_URI`, `JWT_SECRET`, `JWT_EXPIRES_IN`, `CORS_ORIGIN`. |
| `frontend/.env.local` | `frontend/.env.example`    | Set `NEXT_PUBLIC_API_URL` (defaults to `http://localhost:5000/api`). |

For production, there is an additional `backend/.env.production.example`.

## 2. Install dependencies

```bash
# Install root helper dependencies (npm-run-all, etc.)
npm install

# Install service dependencies (run once, or whenever package.json changes)
(cd backend && npm install)
(cd frontend && npm install)
```

## 3. Run the apps

Use the aggregated scripts defined in the root `package.json`:

```bash
# Run backend + frontend together
npm run dev

# Run only one side
npm run dev:backend
npm run dev:frontend
```

The backend listens on `http://localhost:5000`, exposes `GET /api/health`,
and serves API routes prefixed with `/api/*`. The frontend listens on
`http://localhost:3000`.

## 4. Build & lint

```bash
# Type-check and produce production bundles
npm run build

# Start production builds (frontend uses `next start`, backend uses compiled dist)
npm run start          # Backend only
npm run start:frontend # Frontend production server

# Static analysis
npm run lint
```

- `npm run lint` executes `tsc --noEmit` for the backend and `next lint` for the
  frontend.
- The backend build output lives in `backend/dist` and is what Elastic Beanstalk
  deploys.

## 5. Useful files

- `backend/scripts/create-eb-bundle.ps1` – Generates the ZIP consumed by Elastic
  Beanstalk when deploying manually.
- `.github/workflows/deploy-backend.yml` – Automates backend packaging and
  upload using GitHub Actions.
- `docs/deployment/aws.md` – Full AWS walkthrough when you are ready to deploy.

Keep this document up to date whenever scripts or environment conventions
change, so the next developer can set things up in minutes instead of hours.
