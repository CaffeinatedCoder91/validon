# Project Context

## What This Is

A data quality checker demo application built to showcase n8n workflow
orchestration with AI/LLM integration.

## Tech Stack

- Frontend: React 18 + TypeScript + Vite
- Styling: Plain CSS (keep it simple)
- HTTP Client: Native fetch API
- n8n: Workflow orchestration (external - not in this repo)
- AI: Claude via n8n's Anthropic node (external)

## Code Style

- TypeScript strict mode
- Functional components only
- Custom hooks for logic separation
- No unnecessary dependencies
- Keep it simple - this is a demo not a production app
- Never use abbreviations in variable names, function names, or parameters - always use full descriptive names

## Project Structure

```
src/
  components/       ← UI components
  hooks/            ← custom hooks
  types/            ← TypeScript types
  utils/            ← helper functions
  App.tsx
  main.tsx
  index.css
```

## Important Rules

- Always use TypeScript - no any types
- Components should be small and focused
- Separate concerns - logic in hooks, display in components
- Handle loading, error, and empty states always
- Accessible HTML (labels, roles, aria attributes)
- No external UI libraries - build from scratch

## Environment Variables

```
VITE_N8N_WEBHOOK_URL=  ← the n8n webhook endpoint
```

## What NOT to Do

- No Redux or complex state management (useState is fine)
- No React Query (fetch is enough for this demo)
- No CSS frameworks (plain CSS only)
- No authentication (demo only)
- No database (stateless)
