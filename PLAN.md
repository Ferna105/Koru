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
| **3. Explanation** | ✅ | Copy adaptado a "filmar pisada en primer plano" |
| **4. Record** | ✅ | VisionCamera + permisos cám/mic + countdown + REC + switch front/back |
| **5. Editor** | ✅ | Video + timeline + brackets draggables + step ±1f + loop + cálculo |
| **6. Result** | ✅ | Hero altura + auto-persist (RNFS + AsyncStorage) + share |
| **7. History poblada** | ✅ | Best-stat card + lista cards + tap reabre Result + long-press borra |
| **8. Polish** | ✅ | Cleanup temp + airtime mínimo + error handlers + animaciones |

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

## Notas de Fase 3

- Layout: `ScrollView` + footer fijo con el botón "EMPEZAR A FILMAR" fuera del scroll.
- Pasos numerados: badge rojo circular + texto a la derecha con `flex: 1` para wrapping correcto.
- Tip en recuadro con borde amarillo (`colors.card`).
- Navega a `JumpTestRecord` al presionar el CTA.

## Notas de Fase 4

- Pantalla full-screen sin header (`headerShown: false`).
- Stack `JumpTest` forzado a `orientation: 'portrait'` desde `screenOptions`.
- Permisos: pide cámara + micrófono al montar usando `useCameraPermission` + `useMicrophonePermission` de Vision-Camera. Si alguno está denegado, render bloqueado con copy explicativo + botón "ABRIR CONFIGURACIÓN" (`Linking.openSettings()`) + "VOLVER".
- Lente por defecto: trasera. Botón ↺ arriba-derecha permite alternar a frontal mientras esté en `idle`.
- FPS: usa `useCameraFormat` con prioridad `{ fps: 60 }` → si el device soporta 60 fps los pide, si no fallback 30 fps.
- Estados internos: `idle | countdown | recording`.
  - `idle`: preview + ✕ (top-left, vuelve) + ↺ (top-right, switch lens) + hint "Apuntá la cámara a tu pie" + cuadro punteado centrado (60% ancho, `borderStyle: 'dashed'`) + botón REC redondo grande abajo.
  - `countdown`: 3 → 2 → 1 con texto blanco gigante (160px), shadow para legibilidad. Tap al botón cancela.
  - `recording`: badge "● REC" parpadeando (intervalo 500 ms) + botón cuadrado rojo abajo (stop manual, sin tope de tiempo).
- `Camera.startRecording` con `fileType: 'mp4'`. En `onRecordingFinished` se prepende `file://` para Android (donde el path llega sin scheme) y se navega a `JumpTestEditor` con `videoUri` + `durationMs` (en ms) + `fps` (para step ±1f preciso).
- Cleanup: limpia `setTimeout` y `setInterval` en unmount; `isActive` de la cámara se sincroniza con `useFocusEffect` + `AppState` para no consumir recursos cuando la pantalla no está visible.

## Notas de Fase 5

- `jumpTest.physics.ts` expone `airtimeToHeightCm(ms)` con `g = 9.80665 m/s²` y `h = g·T²/8`, más helper `formatMs(ms) → "MM:SS.mmm"`.
- `JumpTestStackParamList.JumpTestEditor` ahora acepta `fps?: number` (default 30 si no llega).
- Layout: video arriba (`aspectRatio` deducido del `naturalSize` que reporta `onLoad`, fallback 9:16, `maxHeight: 50%`). Debajo: stats row + timeline + step row + acciones + footer con CTA.
- Stats row: `DESPEGUE` (formatMs) · `ATERRIZAJE` (formatMs) · `AIRTIME` (`${airtimeMs} ms`).
- Timeline custom hecha sin gesture-handler: `View` con responder API (`onResponderGrant/Move/Release`). Al tocar la barra: detecta el handle más cercano (`pickClosestHandle`) y lo arrastra; pausa el playback y hace `seek` en vivo en el video. Clamp: `start ∈ [0, end−50ms]`, `end ∈ [start+50ms, durationMs]`.
- Brackets renderizados como `View` absoluto (`borderWidth: 3`, color `primary`); el activo se rellena sólido. La selección se pinta como overlay rojo translúcido entre los brackets.
- Step row: dos grupos `−1f / LABEL / +1f`. `1f = 1000/fps`. Tap en el LABEL marca ese handle como activo. El label activo se pinta `primary`.
- Loop play/pause: cuando `isPlaying`, en `onProgress` (cada 50 ms) si `currentTime ≥ endMs−16ms` hace `seek(startMs/1000)`. Tocar la timeline o cambiar handle pausa el loop automáticamente.
- "VOLVER A GRABAR" link amarillo a la derecha del play (`navigation.goBack()`).
- CTA "CALCULAR ALTURA" → calcula `heightCm` (redondeo a 1 decimal) y navega a `JumpTestResult` con `{ videoUri, startMs, endMs, heightCm }`. Persistencia + share quedan para Fase 6.

## Notas de Fase 6

- Service nuevo: `src/services/tests/tests.services.ts` con `loadJumpHistory`, `saveJumpRecord`, `deleteJumpRecord`, `persistVideo`. Storage key `koru:tests:JUMP:history`, tope `JUMP_HISTORY_LIMIT = 50`.
- `persistVideo(srcUri, id)` mueve (o copia como fallback) el MP4 desde `temp` a `${RNFS.DocumentDirectoryPath}/koru/<id>.mp4`. En Android devuelve la URI con `file://`, en iOS sin scheme. `deleteJumpRecord` también borra el archivo.
- Auto-guardado en `JumpTestResult`: al montar, useEffect con guard `persistedRef` para que no se ejecute dos veces (StrictMode / re-renders). Genera un `id` (`Date.now().toString(36) + random`) — sin `uuid` para evitar el polyfill `react-native-get-random-values`.
- Hero del Result: label "ALTURA DE SALTO" (M, letter-spacing 3) + número gigante (160px, line-height 170) + unit `cm` (48px) + "Airtime XXX ms" (XL).
- Mientras guarda, se muestra `ActivityIndicator` + "Guardando en historial…" en S/bold.
- Acciones footer: `Button PRIMARY "COMPARTIR"` y `Button TERTIARY "VER HISTORIAL"`.
- Share: `react-native-share` con `{ url, type: 'video/mp4', message }`. Mensaje: "Salté X.X cm con Koru (airtime XXX ms)". `failOnCancel: false` para que cancelar no tire error.
- "VER HISTORIAL" hace `navigation.popToTop()` (vuelve a `JumpTestHistory`, primera screen del stack).

## Notas de Fase 7

- `JumpTestHistory` carga la lista con `useFocusEffect` + `testsService.loadJumpHistory()`. Mientras `records === null` renderiza una pantalla negra (sin spinner pesado, la carga es local).
- `JumpTestStackParamList.JumpTestResult` extendido con `recordId?: string`. Si llega, el Result salta el auto-persist (`alreadyPersisted = true`) y no muestra el spinner "Guardando…". Esto permite reabrir registros del historial sin duplicarlos.
- Best-stat: card con fondo `colors.card` arriba de la lista mostrando la mayor altura (`reduce` por `heightCm`) + fecha relativa + airtime. Solo se renderiza cuando hay al menos 1 record.
- Item card: row horizontal con borde izquierdo amarillo (`borderLeftWidth: 4`, `borderLeftColor: colors.card`), altura prominente a la izq (`fontSize: 36`), fecha + airtime a la derecha alineados a `flex-end`.
- Fechas formateadas con helper local `formatRelative(iso)`: "hoy HH:mm", "ayer HH:mm", "DD/MM HH:mm". Sin libs externas.
- `onLongPress` con `delayLongPress: 350` ms abre `Alert` nativo "Borrar este test" / "Cancelar" / "Borrar" (estilo `destructive`). El service borra el archivo MP4 + entrada y se recarga la lista.
- Pull-to-refresh disponible aunque la fuente sea local — útil cuando se borra y se quiere reintentar.
- Botón fijo abajo "NUEVO SALTO" (`position: 'absolute'`) que navega a `JumpTestExplanation`. Cuando la lista está vacía, sólo se muestra el empty state con CTA "EMPEZAR".

## Notas de Fase 8

- Service: nuevo método `deleteVideoAt(uri)` en `tests.services.ts` para borrar archivos por URI con guard de `exists()` y try/catch silencioso.
- Cleanup en `JumpTestEditor`: flag `consumedRef` se setea a `true` cuando se navega al Result. `navigation.addListener('beforeRemove', …)` borra el MP4 temporal si `consumedRef === false` (cubre tanto "VOLVER A GRABAR" como gesto/back del header). Si se calculó altura, no se borra (la persistencia lo mueve).
- Validación: `MIN_AIRTIME_MS = 50` (ya usado para clamp de los brackets). En `goCalculate`, si el airtime queda por debajo, se muestra `Alert.alert('Rango muy corto', …)` y no se navega.
- Errores de video en Editor: `<Video onError={…} />` muestra `Alert` con copy en español + `goBack()` en el OK. Cubre archivos corruptos o borrados.
- Errores de grabación en Record: `onRecordingError`, `startRecording` catch y `stopRecording` catch ahora muestran `Alert` además del `console.warn`. Estado vuelve a `idle` para que el usuario pueda reintentar.
- Animaciones (Reanimated 3.6.3, ya en deps de Fase 0):
  - Countdown: por cada cambio de `countdownValue`, `scale: 1.6 → 1` (350 ms) y `opacity: 0 → 1` (220 ms). El componente pasa a `Animated.View`.
  - REC blink: opacity animada con `withRepeat(withTiming(0.25, 500), -1, true)` (reemplazó al `setInterval` anterior). Cancel en unmount y al salir de `recording`.
  - Hero del Result: `opacity: 0 → 1` (420 ms) + `scale: 0.92 → 1` (380 ms con `withDelay(60)`).
- Forced portrait, permisos, 60 fps y empty/denied screens ya estaban resueltos en Fases 4 y 7.

## Estado final

Todas las fases del plan están ✅. La feature "Test de Salto" cubre el flow completo: Tab Tests → Historial → Explicación → Grabación → Editor → Resultado, con persistencia local de records + share + manejo de errores y polish visual. Próximas mejoras posibles (no incluidas en este plan): tira de thumbnails reales en el Editor, tests adicionales en `tests.catalog.ts`, sincronización con backend.

## Notas de Fase 0 (post-instalación)

- `minSdk` Android: 21 → 26 (VisionCamera v4).
- `kotlinVersion`: 1.8.0 → 2.0.21 (libs nuevas requieren).
- `androidx.core` forzado a 1.13.1 para no requerir compileSdk 35.
- Heap Gradle: 2 GB → 4 GB.
- Archs: `4 → 2` (arm64-v8a + x86_64).
- AVD `Medium_Phone_API_36.0`: partición `/data` 6 GB → 16 GB.
- Pods iOS instalados.
