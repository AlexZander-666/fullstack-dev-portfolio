# Project Structure

## Monorepo Layout

```
/frontend          # Next.js application
/backend           # Express API server
```

## Backend Structure (`/backend/src`)

```
controllers/       # Request handlers (posts, projects, auth, contact)
middleware/        # Auth, validation, error handling
models/            # Mongoose schemas (Post, Project, User, ContactMessage)
routes/            # Express route definitions
schemas/           # Zod validation schemas
utils/             # Database connection, JWT utilities
index.ts           # Express app entry point
```

### Backend Patterns

- **Controllers**: Async functions with `(req, res, next)` signature, use try-catch with `next(error)`
- **Models**: Mongoose schemas with TypeScript interfaces, export both model and interface
- **Validation**: Zod schemas in `/schemas`, applied via middleware
- **Error Handling**: Custom error classes (NotFoundError, ValidationError), centralized error middleware
- **API Response Format**: `{ success: boolean, data: any }` for success, standardized error responses
- **Authentication**: JWT middleware checks `req.user`, role-based access control

## Frontend Structure (`/frontend/src`)

```
app/               # Next.js App Router pages
  layout.tsx       # Root layout
  page.tsx         # Home page
  globals.css      # Global styles
types/             # TypeScript type definitions
```

### Frontend Patterns

- **App Router**: Use Next.js 15+ conventions (Server Components by default)
- **Styling**: Tailwind utility classes, dark mode support
- **Data Fetching**: TanStack Query for API calls
- **Forms**: React Hook Form with Zod resolvers for validation
- **Types**: Shared types in `/types`, match backend interfaces

## Configuration Files

- **TypeScript**: Strict mode enabled, path aliases configured
- **Environment**: `.env.example` in backend, use dotenv
- **CORS**: Backend configured for frontend origin (default: localhost:3000)
