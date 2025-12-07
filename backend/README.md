# Backend (Express + TypeScript)

This service exposes REST endpoints for authentication, projects, posts, and
contact messages. It is designed to run on AWS Elastic Beanstalk with MongoDB
Atlas as the datastore.

## Scripts

```bash
npm run dev     # ts-node-dev with auto reload on http://localhost:5000
npm run build   # Compile TypeScript to dist/
npm run start   # Run the compiled server (used in production)
npm run lint    # Type-check using tsc --noEmit
```

## Environment variables

Copy `.env.example` to `.env` and provide:

| Key | Description |
|-----|-------------|
| `PORT` | Optional port override (defaults to 5000). |
| `MONGODB_URI` | MongoDB connection string (MongoDB Atlas recommended). |
| `MONGODB_SEEDLIST` | Optional comma-separated host list (IP or host:port) to bypass DNS. |
| `MONGODB_REPLICA_SET` | Optional replica set name override (defaults to Atlas shard name). |
| `JWT_SECRET` | Secret used to sign auth tokens. |
| `JWT_EXPIRES_IN` | Token lifetime (e.g. `7d`). |
| `CORS_ORIGIN` | Allowed frontend origin (local dev uses `http://localhost:3000`). |

For production deployments there is a `.env.production.example`.

## Source layout

```
src/
├── controllers/        # Business logic per resource (auth, posts, projects, contact)
├── middleware/         # Error handler, auth guard, etc.
├── models/             # Mongoose models
├── routes/             # Express routers mounted under /api/*
├── schemas/            # Zod schemas validating incoming payloads
├── utils/db.ts         # MongoDB connection with retries and DNS diagnostics
└── index.ts            # App bootstrap + health endpoint
```

## Deployment

- Use `scripts/create-eb-bundle.ps1` to zip `dist/`, `package.json`, `Procfile`,
  `.ebextensions`, and `.platform` for Elastic Beanstalk.
- GitHub Actions workflow `.github/workflows/deploy-backend.yml` automates the
  same packaging pipeline and uploads directly when pushing to `main`.

### Elastic Beanstalk hardening
- `.platform/hooks/prebuild/00-install-node.sh` pins Node.js 20.x / npm 10.x before build.
- `.platform/hooks/postdeploy/00-healthcheck.sh` curls `/api/health` (5 tries) and aborts deploy on failure.
- `.platform/nginx/conf.d/custom.conf` fixes Nginx `types_hash` warnings, standardizes log format, and blocks common PHP/probe paths.

Further deployment instructions are documented in
[`docs/deployment/aws.md`](../docs/deployment/aws.md).
