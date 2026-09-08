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
| iOS             | `Koru iOS`             | Bundle ID `com.koru`                | `GOOGLE_IOS_CLIENT_ID` + URL scheme del Info.plist |
| Android         | `Koru Android (debug)` | Package `com.koru` + SHA-1 de debug | Nada en JS: Google lo resuelve por package+SHA-1 |

Los IDs concretos están en `src/config/google.config.ts` y en
`ios/Koru/Info.plist` (reversed client ID). El *client secret* del client web no
se usa en la app: el flujo nativo no lo necesita.

### SHA-1 registrada (Android)

`5E:8F:16:06:2E:A3:CD:2C:4A:0D:54:78:76:BA:A6:F3:8C:AB:F6:25`

Sale del keystore versionado en el repo, `android/app/debug.keystore`, que hoy
firma **debug y release** (ver `signingConfigs` en `android/app/build.gradle`):

```sh
keytool -list -v -keystore android/app/debug.keystore \
  -alias androiddebugkey -storepass android -keypass android
```

Cuando se genere el keystore real de release —o si se usa Play App Signing—
hay que **agregar esa segunda SHA-1** como client de Android adicional, o el
login falla solo en los builds firmados de producción.

## Pendientes

- Registrar la SHA-1 del keystore de release cuando exista (ver arriba).

## Rebuild nativo

La librería trae código nativo, así que no alcanza con recargar Metro:

```sh
cd ios && bundle exec pod install && cd ..
yarn ios
yarn android
```
