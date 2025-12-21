# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**Nossa Maternidade** - A maternal health companion app for pregnant women and new mothers in Brazil, created by Nathalia Valente. iOS-first Expo React Native app with AI-powered health companion.

## Critical Non-Negotiables

### TypeScript
- **Strict mode enforced** - Zero `any` types (use `unknown` + type guards)
- **NO `@ts-ignore`** or `@ts-expect-error` without explicit justification

### Logging
- **NEVER use `console.log/warn/error`** - Use `logger.*` from `src/utils/logger.ts`
- Pattern: `logger.info('message', 'context', metadata?)`
- Quality gate will fail if `console.log` is found

### Colors & Design System
- **NEVER hardcode colors** - Use `useThemeColors()` hook or `Tokens.*` from `src/theme/tokens.ts`
- Forbidden: `#xxx`, `rgba()`, `'white'`, `'black'` (except documented cases)
- **SINGLE SOURCE OF TRUTH**: `src/theme/tokens.ts` (Calm FemTech preset)
- Overlays: Use `Tokens.overlay.light/medium/dark/heavy/backdrop`
- Shadows: Use `Tokens.neutral[900]` as `shadowColor`

### Security
- **DO NOT** expose API keys in any manner
- **DO NOT** modify `.env*` files
- **ALWAYS** enable RLS (Row Level Security) on Supabase tables

## Commands

Use `npm` or `bun` (bun is faster):

```bash
# Development
npm start            # Start Expo dev server
npm start:clear      # Start with cleared cache
npm run ios          # Run on iOS simulator
npm run android      # Run on Android emulator
npm run web          # Run in web browser

# Quality Checks (ALWAYS run before PR)
npm run quality-gate      # Complete quality gate (typecheck + lint + build check + console.log check)
npm run typecheck         # TypeScript type checking (tsc --noEmit)
npm run lint              # ESLint
npm run lint:fix          # Auto-fix ESLint issues
npm run format            # Format with Prettier
npm run check-build-ready # Verify build readiness

# Testing
npm test              # Run Jest tests
npm test:watch        # Run tests in watch mode
npm test:coverage     # Generate coverage report

# Environment & Setup
npm run check-env     # Verify environment variables
npm run test:oauth    # Test OAuth providers
npm run create:admin  # Create admin user (Supabase)
npm run setup-secrets # Setup Supabase secrets

# Utilities
npm run clean         # Clean cache (Metro, Expo, temp files)
npm run clean:all     # Nuclear clean (includes node_modules)

# EAS Build (Production)
npm run eas:build:ios     # Build for iOS
npm run eas:build:android # Build for Android
npm run eas:build:list    # List builds
```

## Architecture

### Navigation Structure

```
RootNavigator (Native Stack) - 5-stage auth flow:
├── 1. LoginScreen (if !isAuthenticated)
├── 2. NotificationPermissionScreen (if !notificationSetupDone)
├── 3. OnboardingScreen (6 steps: welcome, name, stage, date, interests, complete)
├── 4. NathIAOnboardingScreen (5 steps: AI personalization)
└── 5. MainTabs (Bottom Tab Navigator)
    ├── Home         → HomeScreen
    ├── Ciclo        → CycleTrackerScreen
    ├── NathIA       → AssistantScreen (AI chat)
    ├── Comunidade   → CommunityScreen
    └── Meus Cuidados → MyCareScreen

Modal Screens (presentation: "modal"):
├── PostDetail, NewPost
├── DailyLog, Affirmations, Habits
├── WeightCalculator, ComingSoon
```

### State Management (Zustand + AsyncStorage)

All stores centralized in `src/state/store.ts`:

| Store                | Persisted | Purpose                                |
| -------------------- | --------- | -------------------------------------- |
| useAppStore          | Yes       | User profile, onboarding state         |
| useCommunityStore    | No        | Posts, groups (always fresh from API)  |
| useChatStore         | Yes       | AI conversation history                |
| useCycleStore        | Yes       | Menstrual cycle tracking, daily logs   |
| useAffirmationsStore | Yes       | Favorite affirmations, daily selection |
| useHabitsStore       | Yes       | 8 wellness habits, streaks             |
| useCheckInStore      | Yes       | Daily mood/energy/sleep check-ins      |

**Zustand selector pattern** (avoid infinite loops):

```typescript
// ✅ GOOD: Individual selectors
const user = useAppStore((s) => s.user);
const setUser = useAppStore((s) => s.setUser);

// ❌ BAD: Object selector creates new ref each render
const { user, setUser } = useAppStore((s) => ({ user: s.user, setUser: s.setUser }));
```

**Unused imports**: Prefix with underscore to avoid lint errors:
```typescript
import { AgentContext as _AgentContext } from '@/types'; // Not used but needed for type declarations
```

### Pre-built API Functions

Located in `src/api/`:

```typescript
// AI Chat (src/api/chat-service.ts)
getOpenAITextResponse(messages, options?)  // Default: gpt-4o
getGrokTextResponse(messages, options?)    // Alternative: grok-3-beta

// Audio (src/api/transcribe-audio.ts)
transcribeAudio(filePath)  // Uses gpt-4o-transcribe

// Images (src/api/image-generation.ts)
generateImage(prompt)      // Uses gpt-image-1

// Supabase (src/api/supabase.ts)
// Optional - only initializes if env vars exist
```

## Styling Rules

- **Use Nativewind + Tailwind** with `className` prop
- **Use `cn()` helper** from `src/utils/cn.ts` for conditional classes
- **EXCEPTION**: `<CameraView>` and `<LinearGradient>` require inline `style` prop (not className)
- **EXCEPTION**: Animated components (AnimatedView, AnimatedText) may need inline styles
- **Use Ionicons** from `@expo/vector-icons` for icons
- **Use zeego** for context/dropdown menus

### Performance & Accessibility
- **Lists**: Use `FlatList` or `FlashList` - NEVER `ScrollView + map()`
- **Memoization**: Use `React.memo()` for components with repetitive renders
- **Lazy loading**: Use `React.lazy()` for large components
- **Tap targets**: Minimum 44pt (iOS HIG) - `ACCESSIBILITY.minTapTarget` from tokens
- **Contrast**: WCAG AAA by default (7:1 ratio)
- **Always** add `accessibilityLabel` and `accessibilityRole`

### Design Tokens

**SINGLE SOURCE OF TRUTH**: `src/theme/tokens.ts` (Calm FemTech Preset)

Theme: **"Calm FemTech"** - Azul (primary) + Rosa (accent) hybrid
- Blue dominates surfaces (calm, trust, health)
- Pink for CTAs and highlights (warmth, care)
- Low visual stimulation, WCAG AAA by default

```typescript
import { Tokens } from '@/theme/tokens';  // ⭐ USE THIS
import { useThemeColors } from '@/hooks/useTheme';  // For light/dark mode

// Brand colors
Tokens.brand.primary   // Blue pastel (main structure)
Tokens.brand.accent    // Pink vibrant (CTAs only, max 10-15% of screen)
Tokens.brand.secondary // Lilac (secondary elements)
Tokens.brand.teal      // Health indicators

// Neutral grays
Tokens.neutral[50]  // Lightest background
Tokens.neutral[900] // Darkest text/shadows

// Semantic colors
Tokens.semantic.error/errorLight
Tokens.semantic.warning/warningLight
Tokens.semantic.info/infoLight
Tokens.semantic.success/successLight

// Typography
Tokens.typography.h1/h2/h3/body/caption
Tokens.font.sans/serif/mono

// Spacing (8pt grid)
Tokens.spacing.xs/sm/md/lg/xl/2xl

// Overlays (for modals, sheets)
Tokens.overlay.light/medium/dark/heavy/backdrop
```

**Theme hook for light/dark mode**:
```typescript
const theme = useTheme();
const colors = useThemeColors();  // Automatically switches based on theme

<View style={{ backgroundColor: colors.background }}>
```

**Feeling colors** (daily check-ins):
- Bem (sunny): `#FFD89B` (yellow pastel)
- Cansada (cloud): `#BAE6FD` (blue pastel)
- Enjoada (rainy): `#DDD6FE` (lavender)
- Amada (heart): `#FB7185` (pink)

**DEPRECATED**: `src/utils/colors.ts` (kept for backward compatibility only)

## Animation & Gestures

- **Use react-native-reanimated v3** - NOT `Animated` from react-native
- **Use react-native-gesture-handler** for gestures
- **Always WebSearch docs** before implementing - training data may be outdated

## Layout & Safe Areas

- **Use `SafeAreaView`** from `react-native-safe-area-context` - NEVER from `react-native`
- `SafeAreaProvider` is already configured in `App.tsx`
- Use `useSafeAreaInsets()` hook for manual inset calculations
- Tab navigator → no bottom insets needed (handled automatically)
- Native header → no safe area insets needed
- Custom header → top inset required
- **Use `Pressable`** over `TouchableOpacity`

See [docs/SAFE_AREA_MIGRATION.md](docs/SAFE_AREA_MIGRATION.md) for details.

## Camera Implementation

```typescript
// Correct import (Camera is deprecated)
import { CameraView, CameraType, useCameraPermissions } from "expo-camera";

// Must use style prop, NOT className
<CameraView style={{ flex: 1 }} facing={facing} ref={cameraRef}>
  {/* Overlay must be absolute positioned */}
  <View className="absolute inset-0 z-10">{/* UI controls */}</View>
</CameraView>;
```

## Type Definitions

Navigation types in `src/types/navigation.ts`:

- `RootStackParamList` - all stack screens
- `MainTabParamList` - 5 tab screens
- Domain types: `UserProfile`, `Post`, `ChatMessage`, `DailyLog`, `Affirmation`, `Habit`

AI types in `src/types/ai.ts`:

- `AIMessage`, `AIRequestOptions`, `AIResponse`

## File Organization

```
src/
├── api/           # External service clients (OpenAI, Grok, Supabase)
├── components/    # Reusable UI (ui/ for atoms, feature components at root)
├── screens/       # Full-page screen components
├── navigation/    # RootNavigator, MainTabNavigator
├── state/         # Zustand stores (store.ts)
├── types/         # TypeScript definitions
└── utils/         # Helpers (cn.ts, colors.ts, logger.ts, shadow.ts)

docs/              # Technical documentation
scripts/           # Build and setup scripts
```

## Key Files

| File                               | Purpose                                         |
| ---------------------------------- | ----------------------------------------------- |
| `App.tsx`                          | Root component, font loading, providers         |
| `src/state/store.ts`               | All Zustand stores                              |
| `src/navigation/RootNavigator.tsx` | Navigation config                               |
| `src/utils/colors.ts`              | Centralized color system                        |
| `tailwind.config.js`               | Theme colors, fonts, Tailwind config            |
| `app.json`                         | Expo config (bundle ID, permissions)            |
| `app.config.js`                    | Dynamic Expo config with env vars               |
| `scripts/fix-lightningcss.js`      | Windows compatibility fix (runs on postinstall) |

## Code Quality & Process

### Quality Gate (Pre-PR Checklist)

**ALWAYS run before creating PR or building**:
```bash
npm run quality-gate  # Runs all 4 checks below
```

This executes:
1. **TypeScript** type check (`tsc --noEmit`)
2. **ESLint** (blocks: `console.log`, `alert`, `any` types)
3. **Build readiness** check
4. **`console.log` detection** (must use `logger.*` instead)

### File Size & Refactoring

- **Files > 250 LOC**: Refactor (extract hooks/components/services)
- **Smallest diff possible**: Don't modify files outside necessary scope

### Breaking Changes

- If risk of breaking change: propose incremental plan
- Strategy: compatibility → migration → legacy removal (same PR when possible)

### Dependencies

- **DO NOT** add new dependencies without exhausting existing options
- Check `package.json` before suggesting new libraries

### API & Services Pattern

- **Return pattern**: `{ data, error }` (no scattered try/catch)
- **Error handling**: Centralized, logged with `logger.*`

### Environment Variables

- **NEVER modify** `.env*` files directly
- If new variable needed: inform name + usage location + ask confirmation
- Public vars: `EXPO_PUBLIC_*` (exposed to client)
- Private vars: Backend only (Supabase Edge Functions)

## Platform-Specific Notes

### Windows Development

- **Auto-fix included**: `postinstall` script fixes LightningCSS binary issues on Windows x64
- Runs automatically after `npm install` / `bun install`
- For `.sh` scripts: Use Git Bash or WSL
  ```bash
  # Windows (Git Bash required)
  bash scripts/quality-gate.sh

  # Alternative with npm script
  npm run quality-gate
  ```

### iOS Development

- **Pods fix script**: `npm run fix:ios` (if CocoaPods issues)
- **Privacy Manifest**: iOS 17+ compliance built-in (see `app.config.js`)
- **Target**: iOS 15+ (Expo SDK 54)

### Android Development

- **Target SDK**: 35 (Android 15)
- **Min SDK**: 24 (Android 7.0 - 95%+ market)
- **Edge-to-edge**: Enabled by default
- **Predictive back gesture**: Android 14+ enabled

## AI & Backend Services

### Supabase Edge Functions

Deployed functions (see `supabase/functions/`):
- `ai` - NathIA chat (Claude/Gemini/GPT integration)
- `transcribe` - Audio transcription (Whisper)
- `upload-image` - Image upload & optimization
- `notifications` - Push notification handling
- `delete-account` - LGPD-compliant account deletion
- `analytics` - Privacy-preserving analytics

**Deploy**: `npx supabase functions deploy <function-name>`
**Secrets**: Managed via `npm run setup-secrets`

### AI Providers

Priority order (configured in `.env.local`):
1. **Gemini 2.5 Flash** (primary) - Fast, cost-effective
2. **GPT-4o** (fallback) - High quality
3. **Claude 3.5 Sonnet** (specialized) - Vision tasks, complex reasoning

See `src/api/chat-service.ts` for usage patterns.

## Documentation

- [docs/](docs/) - Complete technical documentation
- [docs/DESIGN_SYSTEM_CALM_FEMTECH.md](docs/DESIGN_SYSTEM_CALM_FEMTECH.md) - Design system details
- [docs/SAFE_AREA_MIGRATION.md](docs/SAFE_AREA_MIGRATION.md) - Safe area handling
- [docs/MCP_SETUP.md](docs/MCP_SETUP.md) - MCP server configuration
- [docs/OAUTH_VERIFICATION.md](docs/OAUTH_VERIFICATION.md) - OAuth testing guide

### Community Feature Architecture

The Community feature follows best practices with proper separation of concerns:

```
src/
├── config/community.ts       # MOCK_POSTS, COMMUNITY_TOPICS, POST_TYPES
├── utils/formatters.ts       # formatTimeAgo(), formatCompactNumber(), truncateText()
├── hooks/useCommunity.ts     # All state + handlers (search, like, share, etc.)
└── components/community/
    ├── PostCard.tsx          # Post display with React.memo
    ├── ComposerCard.tsx      # New post composer with topics
    ├── NewPostModal.tsx      # Modal for creating posts
    └── index.ts              # Barrel exports
```

**Pattern**: Screen uses hook for logic, components are UI-only:
```typescript
// In CommunityScreen.tsx
const community = useCommunity(navigation);
// community.filteredPosts, community.handleLike, community.openNewPostModal, etc.
```

### Design Quality Standards

**CRITICAL**: Design system migration in progress
- **Old**: `src/utils/colors.ts` + `src/theme/design-system.ts` (DEPRECATED)
- **New**: `src/theme/tokens.ts` (Calm FemTech preset) ⭐

**When editing files**:
1. Migrate color imports to `Tokens.*` from `src/theme/tokens.ts`
2. Use `useThemeColors()` hook for light/dark mode
3. Never hardcode colors (`#xxx`, `rgba()`, `'white'`, `'black'`)

**Semantic colors** (from `Tokens.semantic.*`):
- `error/errorLight` - Medical warnings, validation errors
- `warning/warningLight` - Caution states, important notices
- `info/infoLight` - Informational messages, tips
- `success/successLight` - Confirmations, achievements

**Special features**:
- Affirmation gradients: Immersive themes (Oceano, Ametista, Lavanda, etc.)
- Feeling colors: Daily mood check-ins (Bem, Cansada, Enjoada, Amada)
- 8pt grid system: Use `Tokens.spacing.*` tokens
