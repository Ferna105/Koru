# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

- `yarn start` — start Metro bundler.
- `yarn ios` / `yarn android` — build & run on simulator/emulator. iOS requires `bundle exec pod install` from `ios/` after dep changes.
- `yarn lint` — ESLint (`@react-native` config).
- `yarn test` — Jest with the `react-native` preset. Run a single test with `yarn test path/to/file.test.tsx` or `yarn test -t "name pattern"`.
- Type-check: `npx tsc --noEmit` (no script alias).

Node ≥ 18 is required (`engines.node`).

## Architecture

React Native 0.73 + TypeScript app. Single feature shipped today: **Koru Test de Salto** (vertical jump measurement via slow-motion video). `PLAN.md` is the source of truth for the feature's design decisions, phases, and physics; consult it before changing anything inside `src/screens/private/tests/jumpTest/` or `src/services/tests/`.

### Provider pyramid (`App.tsx`)

`GestureHandlerRootView` → `NavigationContainer` (custom dark/light themes) → `AuthProvider` → `ServiceProvider` → `Navigator`. The themes are defined inline in `App.tsx`; `colors.card` (yellow `#F2B619`) and `colors.primary` (red `#D42127`) are used pervasively, so prefer `useTheme()` over hardcoding.

### Auth gate

`src/contexts/auth.context.tsx` keeps `authToken` / `refreshToken` in a reducer mirrored to AsyncStorage (`@authToken`, `@refreshToken`). `Navigator` (`src/navigation/index.tsx`) treats `authToken === null` as "still hydrating from storage" (renders empty fragment), `''` as logged-out (Login stack), any other string as logged-in (HomeTabs + JumpTest stacks). When changing auth flow, preserve this three-state contract.

### Navigation tree (`src/navigation/types.ts`)

```
RootStack
├── Login                    (when logged out)
├── HomeTabs (BottomTabs)    (when logged in)
│   ├── Home
│   ├── Tests                ← catalog of available tests
│   └── Profile              ← labeled "CUENTA" in the tab bar
└── JumpTest (NativeStack, full-screen, portrait-locked)
    ├── JumpTestHistory
    ├── JumpTestExplanation
    ├── JumpTestRecord       ← VisionCamera, no header
    ├── JumpTestEditor       ← timeline scrubber, frame-stepping
    └── JumpTestResult       ← auto-persists + share
```

`JumpTest` is intentionally a **sibling** of `HomeTabs` at the root (not nested under the Tests tab) so the camera/editor flow runs full-screen above the tab bar. Adding new tests follows the same pattern: register in `src/screens/private/homeTabs/tabs/tests/tests.catalog.ts`, build a stack under `src/screens/private/tests/<testId>/`, and add a `RootStack.Screen` entry in `src/navigation/index.tsx`.

### Services layer

HTTP services live under `src/services/<domain>/` and expose **hooks** (`useAuthService`, ...) aggregated by `src/services/services.hook.ts` (`useServices`). Each domain has the split: `*.api.interfaces.ts` (raw API shape) → `*.services.mappers.ts` (API → domain) → `*.services.interfaces.ts` (domain shape) → `*.services.ts` (the hook). Keep this separation when adding new endpoints; consumers should never import API interfaces directly.

`ServiceProvider` (`src/contexts/service.context.tsx`) holds a single shared `axios` instance with interceptors that inject `Authorization: Bearer <authToken>` and clear the token on 401. All services pull this instance via `useContext(ServiceContext)` rather than importing axios directly. Base URL lives in `src/services/services.constants.ts` (currently `http://localhost:8080`).

`src/services/tests/tests.services.ts` is different — it's a plain object (not a hook) because it touches AsyncStorage + `react-native-fs` and has no auth/axios dependency. Storage key: `koru:tests:JUMP:history`, capped at `JUMP_HISTORY_LIMIT = 50`. Videos are persisted to `${RNFS.DocumentDirectoryPath}/koru/<id>.mp4`; the `withScheme`/`stripScheme` helpers exist because Android URIs need `file://` and iOS does not — preserve that platform branching when handling video paths.

### Module resolution

Both `babel.config.js` (module-resolver) and `tsconfig.json` (paths) treat `src/` as the root, so imports use bare paths: `import { Button } from 'components'`, `import { AuthContext } from 'contexts/auth.context'`, `import { RootStackParamList } from 'navigation/types'`. The two configs must stay in sync — update both when adding a new alias. `react-native-reanimated/plugin` must remain the **last** Babel plugin.

### Components

`src/components/index.tsx` is the public barrel — only `Text`, `TextInput`, `Container`, `Button` are exported. `Icon` is consumed via direct path. Sizing scale (`utils/sizing.tsx`, XXXS→XXXL) and color tokens (`utils/colors.tsx`) are the design-system primitives; prefer them over raw numbers/hex.

## Conventions worth knowing

- File naming: `<name>.screen.tsx`, `<name>.styles.ts`, `<name>.component.tsx`, `<name>.navigator.tsx`. Follow it for new files.
- Physics + formatting helpers for the jump test live in `src/screens/private/tests/jumpTest/jumpTest.physics.ts` (`airtimeToHeightCm`, `formatMs`). Do not inline `g = 9.80665` elsewhere.
- The Editor screen owns temp-MP4 cleanup via a `consumedRef` + `navigation.addListener('beforeRemove', …)`. If you add a new exit path from Editor, decide explicitly whether the file was "consumed" (moved by `persistVideo`) or should be deleted.
- The Result screen guards auto-persistence with `persistedRef` (StrictMode safety) and skips persistence entirely when navigated with a `recordId` param (re-opening from history). Maintain both guards if you touch that effect.
