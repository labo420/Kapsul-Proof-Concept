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

### Piclo (artifacts/piclo) — Mobile App (Expo)
MVP of Piclo, a mobile-first event photo collection app.
- **Theme**: Social/Viral — Deep violet-black (#08060F) + Indigo→Pink gradient (#6366F1→#EC4899), glassmorphic cards
- **Fonts**: Inter (UI) + Space Mono (counters) + Lilita One (logo wordmark)
- **Screens**: Login (CenteredCard design — glass card, indigo/pink gradient), Host Home, Create Event (2-step wizard), QR Code, Guest Join (`/join/[id]` — loading→success/error, calls `apiJoinEvent`, redirects to guest tab), Guest Upload Dashboard, Guest Wall (masonry), Scan QR (web: TextInput fallback; native: camera), Event Detail
- **Guest join flow**: QR encodes `Linking.createURL("/join/{id}")` → HTTPS URL on web, `piclo://join/{id}` on native. Route `/join/[id]` handles web link; `scan.tsx` handles QR + manual code entry on web
- **Components**: GradientButton, GradientBadge, NeonProgressBar (gradient fill), PhotoCard (gradient overlay + reactions), DeliveryModeSelector (gradient chips)
- **State**: EventContext (API-first, AsyncStorage as cache) + GuestContext (AsyncStorage-backed)
- **Backend**: Real API via `artifacts/piclo/lib/api.ts` — creates events in DB, uploads photos to object storage, join event via QR scan
- **Key packages**: expo-linear-gradient, expo-linking, react-native-qrcode-svg, expo-clipboard, @expo-google-fonts/space-mono, react-native-reanimated
- **Config**: `app.config.js` (dynamic, replaces `app.json`) — reads `REPLIT_EXPO_DEV_DOMAIN` for correct expo-router `origin`
- **Backend DB schema**: `lib/db/src/schema/` — events, photos, guests tables (Drizzle + PostgreSQL)
- **Photo storage**: Replit Object Storage (GCS) via `artifacts/api-server/src/lib/objectStorage.ts`
- **API Routes**: POST /api/events, GET /api/events/:id, POST /api/events/:id/join, POST /api/events/:id/photos, GET /api/events/:id/photos, GET /api/photos/{*objectPath}
- **Auth**: POST /api/auth/register, POST /api/auth/login, GET /api/auth/me, PATCH /api/auth/profile, GET /api/auth/check-username, GET /api/users/:username (privacy-aware)
- **Social**: POST/DELETE /api/social/follow/:id, GET /api/social/followers/:id, GET /api/social/following/:id, GET /api/social/feed (alias: /api/feed), GET /api/social/suggestions, PATCH /api/social/photos/:id/privacy, POST/DELETE/GET /api/social/photos/:id/like(s), POST/GET /api/social/photos/:id/comments
- **Notifications**: GET/PATCH /api/notifications (types: follow, photo, like, comment)
- **DB Migrations**: 0000_init, 0001_users_follows, 0002_photo_likes_public, 0003_notifications, 0004_photo_likes, 0005_photo_comments
- **Profile tab**: Instagram-style with avatar, bio, link, followers/following, highlights, content grid, public/private toggle, notifications modal (handles follow/photo/like/comment types)
- **Home tab**: Feed of followed users' public content with like button + comment modal (CommentsModal)

## Key Commands

- `pnpm run typecheck` — full typecheck across all packages
- `pnpm run build` — typecheck + build all packages
- `pnpm --filter @workspace/api-spec run codegen` — regenerate API hooks and Zod schemas from OpenAPI spec
- `pnpm --filter @workspace/db run push` — push DB schema changes (dev only)
- `pnpm --filter @workspace/api-server run dev` — run API server locally

See the `pnpm-workspace` skill for workspace structure, TypeScript setup, and package details.
