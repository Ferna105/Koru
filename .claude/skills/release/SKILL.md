---
name: release
description: Publica una nueva versión de Koru en Google Play con fastlane — bump de versión, checks, AAB firmado, subida al canal y envío a revisión. Usar cuando se pida "sacar una release", "nueva versión", "subir a Play", "publicar 1.0.x" o promover una versión entre canales.
---

# Release de Koru a Google Play

Todo el flujo está automatizado en `fastlane/Fastfile`. **No hagas los pasos a
mano** (editar `build.gradle`, correr `yarn build:android`, subir el `.aab` por
el navegador): el lane los hace en orden y falla ruidosamente si algo no cuadra.
`RELEASE.md` §8 es la documentación de referencia.

## 1. Antes de arrancar

Corré esto y leé la salida antes de tocar nada:

```sh
git status --short
FASTLANE_SKIP_UPDATE_CHECK=1 bundle exec fastlane android version
```

- **El working tree tiene que estar limpio.** El lane `release` lo exige (hace
  commit + tag al final). Si hay cambios sin commitear, preguntá si commitearlos
  primero o correr con `commit:false`.
- `android version` imprime la versión actual y verifica que los cuatro lugares
  de `RELEASE.md` §3 coincidan. Si dice que está desincronizada, arreglá eso
  antes de seguir.

## 2. Elegir el número de versión

Si el usuario no lo dijo, **preguntale** — no lo inventes. El `versionCode` se
autoincrementa; el `versionName` es una decisión de producto:

- fix puntual → patch (`1.0.2` → `1.0.3`)
- feature nueva → minor (`1.0.2` → `1.1.0`)

## 3. Correr el release

```sh
FASTLANE_SKIP_UPDATE_CHECK=1 bundle exec fastlane android release version:1.0.3
```

Eso hace, en orden: bump de los 4 valores → `tsc` + `lint` + `test` → AAB
firmado → subida al track `alpha` → envío a revisión → commit `release: 1.0.3 (4)`
+ tag `v1.0.3`.

Opciones útiles:

| Flag | Cuándo |
| --- | --- |
| `notes:"..."` | Notas de la versión. Por defecto: *"Mejoras de estabilidad y correcciones menores."* |
| `build:7` | Forzar un `versionCode` en vez del autoincremento |
| `track:internal` | Otro canal (ver §5) |
| `skip_checks:true` | Saltear tsc/lint/test. **Solo si el usuario lo pide explícitamente** |
| `commit:false` | No tocar git |

El lane tarda varios minutos (el build de Gradle y la subida del AAB de ~33 MB):
corrélo en background y esperá la notificación, no hagas polling con `sleep`.

**El push del commit y el tag queda a mano** — es intencional. Al terminar,
recordale al usuario que falta `git push && git push --tags`, y no lo hagas vos
salvo que te lo pida.

## 4. Si falla

| Síntoma | Qué pasa |
| --- | --- |
| `No encontré el patrón ... en <archivo>` | Cambió el formato de un archivo de versión. Actualizá los patrones en las tablas del tope del `Fastfile` — no edites el archivo a mano y sigas. |
| `Falta la clave de servicio de Play` | No está `fastlane/play-store-key.json` (no se versiona). Ver `RELEASE.md` §8. |
| `Falta android/keystore.properties` | Sin eso Gradle firma con debug y el AAB no sirve. Ver `RELEASE.md` §1. |
| `Version code X has already been used` | Ya existe ese `versionCode` en Play. Subí el build. |
| Falla `check` | Arreglá el type-check/lint/test antes de publicar. No lo saltees por tu cuenta. |
| `Google Api Error: ... track` | El track no existe. `supply` lista los válidos en el error. |

Si la subida falló **después** del bump, los archivos de versión quedaron
modificados sin commit: decíselo al usuario y no vuelvas a correr `release` sin
resolverlo (el `ensure_git_status_clean` lo va a frenar igual).

## 5. Canales y promoción

Estado actual de la cuenta (verificar si cambió):

- **`alpha`** — *Prueba cerrada - Alpha*. Es el default y el único canal en uso.
- **`production`** — **bloqueado**. Play exige, para cuentas personales, una
  prueba cerrada con **12 testers durante 14 días**. Al 12/9/2026 había **1
  tester**. Hasta cumplirlo, "Promocionar versión" aparece deshabilitado en la
  consola y `promote to:production` va a fallar.

Si te piden "subir a producción", **no lo intentes sin avisar**: explicá el
bloqueo y ofrecé subir a `alpha`.

Para promover un `versionCode` ya publicado:

```sh
FASTLANE_SKIP_UPDATE_CHECK=1 bundle exec fastlane android promote from:alpha to:production build:4
```

Ojo: la cuenta de servicio hoy tiene **solo** el permiso *Lanzar aplicaciones en
canales de pruebas*. Para promover a producción hay que tildarle además *Lanzar a
producción...* en Play Console → Usuarios y permisos.

## 6. Verificar y reportar

Comprobá que el `versionCode` llegó al canal:

```sh
FASTLANE_SKIP_UPDATE_CHECK=1 bundle exec fastlane run google_play_track_version_codes \
  track:alpha package_name:com.koru.ok json_key:fastlane/play-store-key.json
```

Después informá al usuario: versión y `versionCode`, canal, notas usadas, que
quedó **enviada a revisión** (Google suele tardar hasta 7 días), y que falta el
`git push`. Si el build tiró advertencias (por ejemplo la de que no hay archivo
de desofuscación de R8/ProGuard, que es la habitual y es benigna), mencionalas
sin alarmar.
