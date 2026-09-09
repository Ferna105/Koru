# Publicar Koru en Google Play

Guía del build firmado de Android y de los pasos que hay que hacer una sola vez
en las consolas de Google.

## 1. Keystore de upload

La app se firma con `android/app/koru-upload.keystore` (RSA 2048, alias
`koru-upload`, válida hasta 2054). Las credenciales viven en
`android/keystore.properties`.

**Los dos archivos están fuera de git a propósito** (ver `.gitignore`). No hay
copia en el repo ni en ningún otro lado: si se pierden, no se puede volver a
firmar una actualización con la misma clave y hay que pedirle a Google un
[reseteo de la clave de upload](https://support.google.com/googleplay/android-developer/answer/9842756).
Guardá una copia de ambos en el gestor de contraseñas antes de publicar.

`android/app/build.gradle` levanta ese `.properties` al configurar el proyecto.
Si el archivo no existe, el build de release **cae al keystore de debug** y
avisa por consola: sirve para probar `assembleRelease` en local, pero ese AAB no
se puede subir a Play.

Huella de la clave de upload:

```
SHA-1: 60:41:34:01:79:84:C4:01:83:B9:BD:AD:14:D8:FF:9B:F2:C2:2F:05
```

Para volver a sacarla:

```sh
keytool -list -v -keystore android/app/koru-upload.keystore -alias koru-upload
```

## 2. Generar el AAB

```sh
yarn build:android        # → android/app/build/outputs/bundle/release/app-release.aab
```

Ese `.aab` es lo que se sube a Play Console. `yarn build:android:apk` genera un
APK, que sirve para probar en un teléfono pero **no** para publicar.

Para verificar con qué clave quedó firmado:

```sh
unzip -p android/app/build/outputs/bundle/release/app-release.aab \
  'META-INF/KORU-UPL.RSA' | keytool -printcert
```

El SHA-1 que imprime tiene que ser el de arriba.

## 3. Versionado

Antes de cada subida hay que subir `versionCode` (Play rechaza uno repetido).
Los cuatro valores se mantienen a mano y tienen que coincidir:

| Dónde | Campo |
| --- | --- |
| `android/app/build.gradle` | `versionCode` / `versionName` |
| `ios/Koru.xcodeproj` | `CURRENT_PROJECT_VERSION` / `MARKETING_VERSION` |
| `src/config/app.config.ts` | `APP_BUILD` / `APP_VERSION` |

Hoy: `versionName 1.0`, `versionCode 1`.

## 4. Google Sign-In en producción

Google resuelve el login de Android por **package name + SHA-1**, así que cada
clave que firme la app necesita su propio client OAuth en el proyecto
`koru-507923`. Sin esto el login anda en debug y falla en el build de Play.

Hay que registrar **dos** huellas, no una:

1. **La clave de upload** — ✅ ya registrada como client `Koru Android (upload)`
   (creado el 8/9/2026, package `com.koru.ok`, con la SHA-1 de arriba).
2. **La clave de firma de app** — ⏳ **pendiente**. La genera Play App Signing y
   recién existe después de subir el primer AAB: sale de Play Console →
   *Prueba y versiones* → *Firma de aplicaciones*. Es la que firma el APK que
   instalan los usuarios, así que **es la que realmente importa**: sin ella el
   login con Google falla para todo el que instale desde Play.

Se registra en Google Cloud Console → *Credenciales* → *Crear credenciales* →
*ID de cliente de OAuth* → Android, package `com.koru.ok` + la SHA-1. El client ID
que devuelve no se usa en el código: Google resuelve el login por package+SHA-1,
y `google.config.ts` solo necesita el client web y el de iOS.

Detalle completo del proyecto de Google en `GOOGLE_SIGNIN_SETUP.md`.

## 5. Play Console — primera publicación

- **Ficha**: nombre, descripción corta y larga, ícono 512×512, gráfico de
  funciones 1024×500 y capturas de teléfono.
- **Política de privacidad**: <https://ferna105.github.io/Koru/privacy.html>
  (ya publicada, se sirve con GitHub Pages desde `docs/`).
- **Data safety**: la app pide `CAMERA` y `RECORD_AUDIO` (graba el salto con
  audio) y usa Google Sign-In, así que hay que declarar que recolecta
  **nombre, email y foto de perfil** para autenticación. Los videos y el
  historial no salen del dispositivo — no hay backend.
- **Permisos**: el AAB declara `CAMERA`, `RECORD_AUDIO`, `INTERNET` y
  `ACCESS_NETWORK_STATE`, nada más. `READ/WRITE_EXTERNAL_STORAGE` los inyectaba
  `react-native-fs` y se sacan con `tools:node="remove"` en
  `android/app/src/main/AndroidManifest.xml`, porque Koru guarda todo en el
  directorio privado de la app: declararlos obligaría a justificar acceso a
  almacenamiento compartido sin usarlo. Si alguna vez hace falta escribir fuera
  del sandbox, hay que revertir ese `remove` **y** completar la declaración de
  permisos en Play. `CAMERA` se justifica con la descripción, pero conviene
  tener el video de demo listo por si Google lo pide.
- **Content rating**, **público objetivo** y **anuncios** (no tiene): son
  formularios obligatorios antes de poder publicar.

Recomendado para la primera subida: **testing interno** antes que producción.
Valida la firma, el login con Google y la instalación real sin esperar revisión.

## 6. Identificadores

El `applicationId` publicado es **`com.koru.ok`**, no `com.koru`: ese último ya
estaba tomado por otra app en Play Store. Como el identificador es único en toda
la tienda y no se puede cambiar después de publicar, se eligió `com.koru.ok`
siguiendo el patrón de la otra app de la cuenta.

Ojo con dos cosas:

- El **`namespace`** de Gradle sigue siendo `com.koru` (es el paquete de las
  clases Kotlin, no tiene por qué coincidir con el `applicationId`). Por eso el
  componente se lanza como `com.koru.ok/com.koru.MainActivity`.
- El **bundle ID de iOS** también es `com.koru.ok`, para que las dos plataformas
  coincidan.
- Los tres clients OAuth del proyecto `koru-507923` (Android debug, Android
  upload e iOS) se editaron para apuntar a `com.koru.ok`. Como se editaron en vez
  de recrearse, los client IDs de `google.config.ts` y el URL scheme del
  `Info.plist` **no cambiaron**.

## 7. Requisito de targetSdk

Play exige **API 36 (Android 16)** para apps nuevas desde el 31/8/2026. El
proyecto está en `targetSdk 36` (`android/build.gradle`); bajarlo hace que Play
rechace el AAB al subirlo.
