# Tech Stack

## Frontend

- **Framework**: Next.js 16 (App Router) with React 19
- **Language**: TypeScript (strict mode)
- **Styling**: Tailwind CSS 4
- **State Management**: TanStack Query (React Query)
- **Forms**: React Hook Form + Zod validation
- **Animation**: Framer Motion
- **Icons**: Lucide React

## Backend

- **Runtime**: Node.js with Express 5
- **Language**: TypeScript (strict mode, ES2020 target)
- **Database**: MongoDB with Mongoose ODM
- **Validation**: Zod schemas
- **Authentication**: JWT (jsonwebtoken) + bcryptjs
- **Environment**: dotenv for config

## Common Commands

### Frontend
```bash
npm run dev          # Start dev server (port 3000)
npm run build        # Production build
npm start            # Start production server
npm run lint         # Run ESLint
```

### Backend
```bash
npm run dev          # Start dev server with hot reload (port 5000)
npm run build        # Compile TypeScript to dist/
npm start            # Run compiled production server
```

## Path Aliases

Both frontend and backend use `@/*` for `src/*` imports.
