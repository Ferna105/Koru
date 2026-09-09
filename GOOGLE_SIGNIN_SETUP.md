# Google Sign-In — configuración

El login con Google (`@react-native-google-signin/google-signin` +
`src/services/google/`) ya está conectado al proyecto de Google Cloud. Este
documento queda como referencia de **qué se creó y dónde vive cada valor**.

## Proyecto de Google Cloud

| Dato                | Valor           |
| ------------------- | --------------- |
| Nombre del proyecto | `Koru`          |
| ID del proyecto     | `koru-507923`   |
| Número de proyecto  | `750626947997`  |

Consent screen (Google Auth Platform → *Público*): tipo **External**, estado
**En producción**, scopes `email` y `profile`.

Al estar en producción entra **cualquier cuenta de Google**, sin cargar testers
a mano. Google no exige verificación porque los scopes `email`/`profile` no son
sensibles, no hay logo cargado y hay un solo dominio autorizado; si en algún
momento se agrega alguna de esas tres cosas, la app pasa a requerir revisión.

Las páginas públicas que Google pide para estar en producción se sirven con
GitHub Pages desde `docs/` (rama `main`):

| | |
| --- | --- |
| Página principal | <https://ferna105.github.io/Koru/> |
| Política de privacidad | <https://ferna105.github.io/Koru/privacy.html> |
| Dominio autorizado | `ferna105.github.io` |

> ⚠️ La política describe la app tal como está hoy: sin backend, sin analítica,
> todo guardado en el dispositivo. Si se conecta la API (`services.constants.ts`
> todavía apunta a `localhost:8080`), hay que actualizar `docs/privacy.html`.

## OAuth clients

| Tipo            | Nombre en la consola   | Identificado por                    | Se usa en                                        |
| --------------- | ---------------------- | ----------------------------------- | ------------------------------------------------ |
| Aplicación web  | `Koru Web (idToken)`   | —                                   | `GOOGLE_WEB_CLIENT_ID` (Android + idToken)       |
| iOS             | `Koru iOS`             | Bundle ID `com.koru.ok`             | `GOOGLE_IOS_CLIENT_ID` + URL scheme del Info.plist |
| Android         | `Koru Android (debug)` | Package `com.koru.ok` + SHA-1 de debug | Nada en JS: Google lo resuelve por package+SHA-1 |
| Android         | `Koru Android (upload)`| Package `com.koru.ok` + SHA-1 de upload | Nada en JS: ídem |

Los IDs concretos están en `src/config/google.config.ts` y en
`ios/Koru/Info.plist` (reversed client ID). El *client secret* del client web no
se usa en la app: el flujo nativo no lo necesita.

### SHA-1 registradas (Android)

Google resuelve el login de Android por **package name + SHA-1**, así que cada
clave que firme la app necesita su propio client de Android en la consola.

> El package es **`com.koru.ok`** (no `com.koru`, que ya estaba tomado en Play
> Store). Los tres clients se editaron para reflejarlo, así que los client IDs
> siguen siendo los mismos que están en `google.config.ts`.

| Clave | SHA-1 | Estado |
| --- | --- | --- |
| Debug (`android/app/debug.keystore`, versionado) | `5E:8F:16:06:2E:A3:CD:2C:4A:0D:54:78:76:BA:A6:F3:8C:AB:F6:25` | Registrada |
| Upload (`android/app/koru-upload.keystore`, fuera de git) | `60:41:34:01:79:84:C4:01:83:B9:BD:AD:14:D8:FF:9B:F2:C2:2F:05` | Registrada (client `Koru Android (upload)`, 8 sept 2026) |
| Play App Signing | la genera Google al subir el primer AAB | **Falta registrar** |

Para releerlas:

```sh
keytool -list -v -keystore android/app/debug.keystore \
  -alias androiddebugkey -storepass android -keypass android
keytool -list -v -keystore android/app/koru-upload.keystore -alias koru-upload
```

La de Play App Signing sale de Play Console → *Prueba y versiones* → *Firma de
aplicaciones*, recién después de la primera subida. Es la que firma el APK que
llega a los usuarios, así que sin ella **el login falla en producción aunque
ande en debug y en el AAB local**.

## Pendientes

- Registrar la SHA-1 de Play App Signing después de subir el primer AAB. Es la
  única que falta, y sin ella el login falla para los usuarios que instalen
  desde Play aunque ande en debug y en el AAB local.

Ver `RELEASE.md` para el flujo completo de publicación.

## Rebuild nativo

La librería trae código nativo, así que no alcanza con recargar Metro:

```sh
cd ios && bundle exec pod install && cd ..
yarn ios
yarn android
```
