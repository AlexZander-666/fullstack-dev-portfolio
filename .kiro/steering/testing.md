# Testing Strategy

## Overview

Testing is not mandatory for all features but recommended for critical paths.

## Recommended Tools

### Frontend
- **Unit/Component**: Vitest + React Testing Library
- **E2E**: Playwright (optional)

### Backend
- **Unit/Integration**: Vitest or Jest
- **API Testing**: Supertest

## What to Test

### High Priority
- Authentication flow (login, token validation)
- API endpoint responses and error handling
- Form validation logic
- Data transformation utilities

### Medium Priority
- Component rendering with different props
- User interactions (clicks, form submissions)
- API client functions

### Lower Priority
- Static UI components
- Styling/layout

## Test File Conventions

```
src/
├── controllers/
│   ├── posts.controller.ts
│   └── __tests__/
│       └── posts.controller.test.ts
├── components/
│   ├── ProjectCard.tsx
│   └── ProjectCard.test.tsx
```

## Test Patterns

### Backend Controller Test
```typescript
import { describe, it, expect, vi } from "vitest";
import request from "supertest";
import app from "../index";

describe("GET /api/posts", () => {
  it("returns paginated posts", async () => {
    const res = await request(app).get("/api/posts");
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.items).toBeDefined();
  });
});
```

### Frontend Component Test
```typescript
import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import ProjectCard from "./ProjectCard";

describe("ProjectCard", () => {
  it("renders project name", () => {
    const project = { name: "Test Project", description: "..." };
    render(<ProjectCard project={project} />);
    expect(screen.getByText("Test Project")).toBeInTheDocument();
  });
});
```

## Running Tests

```bash
# Run all tests
npm test

# Run with coverage
npm test -- --coverage

# Run specific file
npm test -- posts.controller.test.ts

# Watch mode (development)
npm test -- --watch
```

## Mocking

- Mock external services (database, APIs) in unit tests
- Use `vi.mock()` for module mocking
- Create test fixtures in `__fixtures__/` directories

## CI Integration

Tests should run on:
- Pull request creation
- Push to main branch
- Pre-deployment checks
