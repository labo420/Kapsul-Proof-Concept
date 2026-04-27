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
- **Theme**: Social/Viral — Deep violet-black (#08060F) + Violet→Pink gradient (#8B5CF6→#EC4899), glassmorphic cards
- **Fonts**: Inter (UI) + Space Mono (counters only)
- **Screens**: Host Home, Create Event (2-step wizard), QR Code, Guest Upload Dashboard, Guest Wall (masonry), Scan QR, Event Detail
- **Components**: GradientButton, GradientBadge, NeonProgressBar (gradient fill), PhotoCard (gradient overlay + reactions), DeliveryModeSelector (gradient chips)
- **State**: EventContext + GuestContext (both AsyncStorage-backed, no backend)
- **Key packages**: expo-linear-gradient, react-native-qrcode-svg, expo-clipboard, @expo-google-fonts/space-mono, react-native-reanimated
- **Next steps**: Supabase integration, real QR scanner, Vault timer

## Key Commands

- `pnpm run typecheck` — full typecheck across all packages
- `pnpm run build` — typecheck + build all packages
- `pnpm --filter @workspace/api-spec run codegen` — regenerate API hooks and Zod schemas from OpenAPI spec
- `pnpm --filter @workspace/db run push` — push DB schema changes (dev only)
- `pnpm --filter @workspace/api-server run dev` — run API server locally

See the `pnpm-workspace` skill for workspace structure, TypeScript setup, and package details.
