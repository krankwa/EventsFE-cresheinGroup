# EventTix Project Guidelines

## Core Tech Stack

- **Framework**: React 19, TypeScript, Vite
- **Styling**: Tailwind CSS v4, shadcn/ui
- **Routing**: React Router v7
- **Data Fetching**: React Query (`@tanstack/react-query`)
- **Forms**: React Hook Form + Zod (`@hookform/resolvers/zod`)
- **Maps**: React Leaflet
- **Notifications**: `react-hot-toast` (Preferred over other toast libraries)

## Architecture & Code Style

- **Feature-based Modules**: Business logic, API calls, and feature-specific components are grouped by feature in `src/features/` (e.g., `features/authentication/useLogin.ts`, `features/events/components/EventCard.tsx`).
- **Shared Atomic Components**: Globally reusable UI components are categorized in `src/components/`:
  - `ui/`: Baseline shadcn/ui components (`button.tsx`, `input.tsx`).
  - `molecules/` & `organisms/`: Shared composites (only if used across multiple features).
  - `templates/`: Route layouts (`AppLayout.tsx`, `AdminLayout.tsx`).
- **API Services**: Define API wrappers in `src/services/`.
  - Use the base `apiFetch` in `api.ts` which automatically handles JWT headers and 401 Unauthorized responses.
  - Manage auth tokens using `authStore.ts`.
- **Form Schemas**: Extract Zod validation schemas into `src/form-schema/`.

## Build and Test

- **Start Dev Server**: `npm run dev`
- **Build**: `npm run build`
- **Lint**: `npm run lint`
- **Format**: `npm run format`

## Key Conventions & Gotchas

- **Component Tracking & Reusability**: BEFORE creating new UI or styled components, ALWAYS check `UI_COMPONENTS_DOCS.md` to avoid redundancy. AFTER creating them, ALWAYS write/update the documentation in `UI_COMPONENTS_DOCS.md` to track both styled components and general UI components for future reusability.
- **State Management & Redux**: Always analyze local component state within features or files. If the state is complex, prop-drilled, or shared across components, evaluate if it should be integrated into Redux. At the end of your response, explicitly suggest refactoring the local state into Redux if applicable, and offer to perform the refactor for the user.
- **Authentication state**: Use the `useUser` hook (from `src/features/authentication/useUser.ts`) to determine authentication status and admin access instead of reading local storage directly.
- **Mutations & Routing**: Feature hooks (like `useLogin.ts`) handle data invalidation and routing/redirects automatically after success. Component forms should primarily invoke these hooks.
- **Environment config**: Require local `.env` with `VITE_API_URL` based on the `.env.txt` template.
