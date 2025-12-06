# Frontend Component Guidelines

## Directory Structure

```
src/components/
├── home/           # Homepage-specific components
│   ├── Hero.tsx
│   ├── FeatureCard.tsx
│   └── TypewriterTerminal.tsx
├── layout/         # Shared layout components
│   ├── Navbar.tsx
│   └── Footer.tsx
├── projects/       # Project-related components
│   └── ProjectCard.tsx
├── blog/           # Blog-related components
├── ui/             # Reusable UI primitives
└── admin/          # Admin dashboard components
```

## Component Patterns

### File Structure
```tsx
"use client"; // Only if using hooks/interactivity

import { ExternalLib } from "external-lib";
import type { TypeImport } from "@/types";

interface ComponentProps {
  prop: string;
}

export default function Component({ prop }: ComponentProps) {
  return <div>{prop}</div>;
}
```

### Props Interface
- Define above component
- Use descriptive names
- Import shared types from `@/types`

### Server vs Client Components
- Default to Server Components
- Add `"use client"` only for:
  - `useState`, `useEffect`, hooks
  - Event handlers (`onClick`, `onChange`)
  - Browser APIs

## Styling Conventions

### Design Tokens
- Primary accent: `[#d97757]` (coral/orange)
- Dark text/buttons: `[#1a1a1a]`
- Background: `[#f4f3ef]` (warm off-white)
- Text hierarchy: `stone-900` → `stone-600` → `stone-500`

### Common Patterns
```tsx
// Card container
className="bg-white border border-stone-200 rounded-2xl shadow-sm hover:shadow-lg transition-all"

// Primary button
className="bg-[#1a1a1a] text-white px-4 py-2 rounded-lg hover:bg-stone-800 transition-colors"

// Accent link
className="text-stone-600 hover:text-[#d97757] transition-colors"

// Badge/tag
className="text-xs bg-[#f0eee6] text-stone-700 px-2 py-1 rounded-md"
```

### Responsive Design
- Mobile-first approach
- Breakpoints: `sm:`, `md:`, `lg:`, `xl:`
- Common pattern: `text-lg md:text-xl lg:text-2xl`

## Icons

- Use Lucide React exclusively
- Import individual icons: `import { ArrowRight, Menu } from "lucide-react"`
- Standard size: `size={16}` for inline, `size={24}` for buttons

## Animation

- Use Framer Motion for complex animations
- Tailwind transitions for simple hover/focus states
- Common: `transition-colors`, `transition-all duration-300`

## Accessibility

- Always include `aria-label` for icon-only buttons
- Use semantic HTML (`nav`, `main`, `section`, `article`)
- Ensure sufficient color contrast
- Support keyboard navigation
