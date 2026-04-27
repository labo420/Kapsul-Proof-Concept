# Workspace

## Overview

pnpm workspace monorepo using TypeScript. Each package manages its own dependencies.

## Stack

- **Monorepo tool**: pnpm workspaces
- **Node.js version**: 24
- **Package manager**: pnpm
- **TypeScript version**: 5.9
- **API framework**: Express 5
- **Database**: PostgreSQL + Drizzle ORM
- **Validation**: Zod (`zod/v4`), `drizzle-zod`
- **API codegen**: Orval (from OpenAPI spec)
- **Build**: esbuild (CJS bundle)

## Artifacts

### Kapsul (artifacts/kapsul) — Mobile App (Expo)
MVP of Kapsul, a mobile-first event photo collection app.
- **Theme**: OLED Black (#000000) + Neon Green (#00ff88) + Purple accent (#7c3aed)
- **Fonts**: Inter (UI) + Space Mono (counters, labels)
- **Screens**: Host Home, Create Event (2-step wizard), QR Code, Guest Upload Dashboard, Guest Wall (masonry), Scan QR
- **State**: EventContext + GuestContext (both AsyncStorage-backed, no backend)
- **Key packages**: react-native-qrcode-svg, expo-clipboard, @expo-google-fonts/space-mono
- **Next steps**: Supabase integration, real QR scanner, Vault timer

## Key Commands

- `pnpm run typecheck` — full typecheck across all packages
- `pnpm run build` — typecheck + build all packages
- `pnpm --filter @workspace/api-spec run codegen` — regenerate API hooks and Zod schemas from OpenAPI spec
- `pnpm --filter @workspace/db run push` — push DB schema changes (dev only)
- `pnpm --filter @workspace/api-server run dev` — run API server locally

See the `pnpm-workspace` skill for workspace structure, TypeScript setup, and package details.
