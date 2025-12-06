## Frontend (Next.js 13 App Router)

This package contains the marketing site, blog, admin console, contact form, and
experimental playground pages for the full-stack developer portfolio.

### Scripts

```bash
npm run dev      # Start Next.js dev server on http://localhost:3000
npm run build    # Create production build (.next)
npm run start    # Serve the production build
npm run lint     # next lint (uses eslint.config.mjs)
```

### Directory highlights

```
src/
├── app/
│   ├── page.tsx            # Landing page
│   ├── blog/               # Blog listing + detail views
│   ├── contact/            # Contact form page
│   ├── projects/           # Project highlights
│   ├── admin/              # Admin dashboard routes
│   └── playground/claude-code/page.tsx  # Claude Code styled showcase
├── components/             # UI building blocks grouped by domain
├── hooks/                  # React Query + form helpers
├── lib/                    # API clients/fetch helpers
└── types/                  # Shared TS interfaces mirroring backend models
```

Styling is handled through Tailwind CSS v4 with custom inline themes defined in
`src/app/globals.css`. Iconography comes from `lucide-react`.

### Environment variables

Create `.env.local` from `.env.example` and configure at least:

| Key | Description |
|-----|-------------|
| `NEXT_PUBLIC_API_URL` | Points to the Express API (default `http://localhost:5000/api`). |

### API connectivity

All API calls should go through the helpers in `src/lib`. They automatically use
`NEXT_PUBLIC_API_URL`, attach JSON headers, and centralize error handling so the
admin dashboard and marketing components behave consistently.

For more background on the overall architecture and deployment paths, check
[`docs/architecture.md`](../docs/architecture.md) and
[`docs/deployment/aws.md`](../docs/deployment/aws.md).
