# Architecture Overview

The portfolio is a small full-stack system composed of a public-facing Next.js
site and an Express API backed by MongoDB. The monorepo structure lets us track
shared decisions (naming conventions, deployment workflows, and environment
contracts) in one place.

## High-level view

```
Client (Next.js App Router)  <--->  REST API (Express + TypeScript)  <--->  MongoDB Atlas
```

- **Frontend** (`frontend/`): Next.js 13+ App Router with React Server
  Components, Tailwind CSS, and client components for interactive sections
  (admin dashboard, blog, contact form, etc.).
- **Backend** (`backend/`): Express application with strongly typed controllers,
  Zod schemas for request validation, and Mongoose models for persistence.
- **Infrastructure**: The backend is packaged for Elastic Beanstalk through
  `backend/scripts/create-eb-bundle.ps1`, while the frontend is deployed via AWS
  Amplify. GitHub Actions (`.github/workflows/deploy-backend.yml`) automates the
  backend deployment process.

## Backend layout

```
backend/src
├── controllers/     // Route handlers for auth, posts, projects, contact
├── middleware/      // Error handling, auth guards
├── models/          // Mongoose schemas (User, Project, Post, ContactMessage)
├── routes/          // API route declarations mounted under /api/*
├── schemas/         // Zod definitions to validate incoming payloads
└── utils/db.ts      // MongoDB connection + retry + graceful shutdown
```

Key API surfaces:

- `POST /api/auth/login`, `POST /api/auth/register` for credential management.
- `GET/POST/PATCH/DELETE /api/projects` for portfolio projects.
- `GET/POST /api/posts` for blog posts/notes.
- `POST /api/contact` for contact form submissions.
- `GET /api/health` for liveness checks (used by EB and CloudWatch alarms).

## Frontend layout

```
frontend/src
├── app/             // Route segments (home, blog, contact, admin, playground)
├── components/      // Domain-specific UI blocks (home, projects, blog, layout)
├── hooks/           // React Query + form helpers
├── lib/             // Fetchers and API clients
└── types/           // Shared TypeScript definitions mirroring backend models
```

- Pages leverage the App Router so each route can mix server components (for
  SEO-friendly marketing content) and client components (admin CRUD forms).
- Styling is powered by Tailwind CSS v4 with custom inline themes defined in
  `src/app/globals.css`.
- API requests flow through dedicated fetch helpers in `src/lib/api.ts` to keep
  data fetching consistent and testable.

## Data & control flow

1. The Next.js app renders marketing pages statically and hydrates interactive
   components (e.g. contact form) on the client.
2. Client components call the Express API using the `NEXT_PUBLIC_API_URL`
   environment variable (dev defaults to `http://localhost:5000/api`).
3. Express controllers validate payloads via Zod schemas, then interact with
  Mongoose models and return normalized JSON responses.
4. MongoDB Atlas stores users, posts, projects, and contact messages. Connection
  logic in `backend/src/utils/db.ts` handles DNS issues, retries, and graceful
  shutdowns.

Whenever you add new surface area, update this architecture document so future
contributors can reason about how the moving pieces relate to each other.
