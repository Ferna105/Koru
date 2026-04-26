# Plan — Feature "Tests" + Test de Salto

## Objetivo

Permitir al usuario medir cuánto saltó verticalmente filmándose el pie en primer plano, marcando los frames de despegue y aterrizaje, y calculando la altura con física clásica. La feature se construye sobre una arquitectura escalable que permita sumar otros tests más adelante.

## Decisiones tomadas

- **Trim virtual**: no re-encodeamos el video. Guardamos URI + `startMs` + `endMs`.
- **Historial de saltos** visible: primera pantalla del stack `JumpTest`.
- **Sin share-gate** entre editor y resultado. Share queda como acción opcional desde el resultado.
- **Físicamente**: `h = g·T²/8` (g = 9.80665 m/s²), donde T = airtime del pie en segundos.
- **Foco visual**: pisada en primer plano. Reduce el error de marcado de frames y simplifica la fórmula.

## Arquitectura

```
src/screens/private/
├── homeTabs/tabs/tests/                       ← tab "Tests"
│   ├── tests.screen.tsx                        ← "Mis tests"
│   ├── tests.styles.ts
│   ├── tests.catalog.ts                        ← registro central de tests
│   └── components/testCard.component.tsx
└── tests/jumpTest/                            ← flow full-screen
    ├── jumpTest.navigator.tsx
    ├── jumpTest.physics.ts
    ├── jumpTest.types.ts
    └── screens/
        ├── history/jumpTestHistory.screen.tsx
        ├── explanation/jumpTestExplanation.screen.tsx
        ├── record/jumpTestRecord.screen.tsx
        ├── editor/jumpTestEditor.screen.tsx
        └── result/jumpTestResult.screen.tsx

src/services/tests/
├── tests.services.ts                          ← AsyncStorage por TestId
└── tests.services.interfaces.ts
```

### Stack de navegación

```ts
type RootStackParamList = {
  HomeTabs: NavigatorScreenParams<HomeTabParamList>;
  Login: undefined;
  JumpTest: NavigatorScreenParams<JumpTestStackParamList>;
};

type HomeTabParamList = {
  Home: undefined;
  Tests: undefined;
  Profile: undefined;
};

type JumpTestStackParamList = {
  JumpTestHistory: undefined;
  JumpTestExplanation: undefined;
  JumpTestRecord: undefined;
  JumpTestEditor: { videoUri: string; durationMs: number };
  JumpTestResult: { videoUri: string; startMs: number; endMs: number; heightCm: number };
};
```

### Modelo de datos del historial

```ts
type JumpRecord = {
  id: string;            // uuid
  testId: 'JUMP';
  createdAt: string;     // ISO
  videoUri: string;
  startMs: number;
  endMs: number;
  airtimeMs: number;
  heightCm: number;
};
```

Storage key: `koru:tests:JUMP:history`. Se guardan los últimos N (ej. 50). Al borrar entrada se borra el archivo MP4 asociado.

## Design system

- Colors: `primary` rojo `#D42127`, `card` amarillo `#F2B619`, `background` negro, `text` blanco.
- Typography: `Sizing` XXXS→XXXL.
- Components reutilizados: `Button` (PRIMARY/SECONDARY/TERTIARY), `Container`, `Text`, `Icon`.
- Iconos a sumar: `Tests`, `Jump`, `Camera`, `Play`, `Pause`, `Stop`, `Share`, `Close`, `Check`, `Refresh` (regrabar), `Star`.

## Stack técnico

| Necesidad | Lib | Versión pinneada |
|---|---|---|
| Cámara | `react-native-vision-camera` | 4.7.3 |
| Reproductor | `react-native-video` | 6.4.5 |
| Gestos | `react-native-gesture-handler` | 2.16.2 |
| Animación | `react-native-reanimated` | 3.6.3 |
| Share | `react-native-share` | 10.2.1 |
| Permisos | `react-native-permissions` | 4.1.5 |
| Filesystem | `react-native-fs` | 2.20.0 |
| UUID | `uuid` | 9.0.1 |

## Fases

| Fase | Estado | Entregable |
|---|---|---|
| **0. Setup** | ✅ | Deps + permisos + Reanimated plugin + Kotlin 2.0 + Android disk bump |
| **1. Tab Tests** | ✅ | Pantalla "Mis tests" + catálogo + card SALTOS con badge PROBALO |
| **2. Stack JumpTest + History** | ✅ | Header amarillo + pantalla historial (estado vacío) |
| **3. Explanation** | siguiente | Copy adaptado a "filmar pisada en primer plano" |
| **4. Record** | pending | VisionCamera + record button + timer + permisos |
| **5. Editor** | pending | Video player + frame strip + brackets rojos + seek en drag |
| **6. Result** | pending | Cálculo + altura + persistencia + share |
| **7. History poblada** | pending | Lista + best-stat card |
| **8. Polish** | pending | Estados error/empty + animaciones + cleanup files |

## Edge cases

- Permiso de cámara denegado → modal con CTA a Settings.
- Llamada entrante mientras se filma → al volver, validar archivo (`onRecordingError`).
- Storage lleno → mostrar error.
- Video < 0.5 s o `endMs <= startMs` → resultado `--`.
- Forzar portrait en el flow.
- Cámara a 60fps (`fps={60}`) si el dispositivo soporta — reduce error de marcado.
- Cleanup de mp4 temp al "Volver al inicio" si el record no quedó persistido.

## Notas de Fase 1

- En Fase 1 el `onPress` del card muestra `Alert("Próximamente")`. Fase 2 lo reemplaza por `navigation.navigate('JumpTest')`.
- Tab bar con labels en mayúscula: HOME, TESTS, CUENTA. La tab `Profile` se renombró visualmente como CUENTA (matchea Figma) sin tocar la `route name`.
- Catálogo en `tests.catalog.ts`: para sumar un test nuevo basta con agregar una entrada al array (id, title, featured) + crear su stack en Fase 2 y mapearlo en `navigation/index.tsx`.
- Decisión: el badge "★ PROBALO" se renderiza con un caracter unicode en lugar de un SVG. Si más adelante queremos un star pixel-perfect del Figma, lo migramos a SVG.

## Notas de Fase 0 (post-instalación)

- `minSdk` Android: 21 → 26 (VisionCamera v4).
- `kotlinVersion`: 1.8.0 → 2.0.21 (libs nuevas requieren).
- `androidx.core` forzado a 1.13.1 para no requerir compileSdk 35.
- Heap Gradle: 2 GB → 4 GB.
- Archs: `4 → 2` (arm64-v8a + x86_64).
- AVD `Medium_Phone_API_36.0`: partición `/data` 6 GB → 16 GB.
- Pods iOS instalados.
