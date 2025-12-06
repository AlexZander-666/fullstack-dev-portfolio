# Coding Standards

## Naming Conventions

### Files & Folders
- **Components**: PascalCase (`ProjectCard.tsx`, `Navbar.tsx`)
- **Utilities/Hooks**: camelCase (`api.ts`, `useAuth.ts`)
- **Routes/Controllers**: kebab-case with suffix (`posts.routes.ts`, `auth.controller.ts`)
- **Schemas**: kebab-case with suffix (`post.schema.ts`)
- **Types**: camelCase or index (`types/index.ts`)

### Variables & Functions
- **Variables**: camelCase (`isOpen`, `navLinks`)
- **Constants**: camelCase for objects/arrays, UPPER_SNAKE_CASE for primitives (`API_BASE_URL`)
- **Functions**: camelCase, verb prefix for actions (`getPosts`, `submitContact`, `handleClick`)
- **React Components**: PascalCase (`Hero`, `ProjectCard`)
- **Interfaces/Types**: PascalCase, no `I` prefix (`Project`, `ApiResponse`)

### CSS Classes
- Use Tailwind utility classes directly
- Custom colors: use project palette (`[#d97757]`, `[#1a1a1a]`, `[#f4f3ef]`)
- Semantic stone colors for text/borders (`stone-600`, `stone-200`)

## TypeScript Guidelines

- Enable strict mode
- Always define return types for functions
- Use `interface` for object shapes, `type` for unions/intersections
- Import types with `import type { ... }`
- Avoid `any`, use `unknown` when type is uncertain
- Use `Record<string, unknown>` for dynamic objects

## Code Style

### Imports Order
1. External libraries (`react`, `next`, `express`)
2. Internal aliases (`@/types`, `@/lib`)
3. Relative imports (`./components`)

### React Components
- Use function declarations with `export default`
- Props interface defined above component
- Destructure props in function signature
- Use `"use client"` directive only when needed

### Backend Controllers
- Async functions with `(req, res, next)` signature
- Wrap logic in try-catch, call `next(error)` on failure
- Use JSDoc comments for route documentation
- Return `{ success: true, data: ... }` format

## Comments

- Use JSDoc for controller functions with `@route`, `@desc`, `@access`
- Inline comments for complex logic only
- Chinese comments acceptable for business logic
- No commented-out code in commits
