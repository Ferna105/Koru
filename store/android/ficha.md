# Ficha de Play Store — Koru

Textos propuestos para la ficha principal. Están en español (Argentina), que es
el idioma de toda la app.

## Nombre de la aplicación

Máximo 30 caracteres.

```
Koru — Test de Salto
```

(19 caracteres)

## Descripción corta

Máximo 80 caracteres. Es lo que se ve en el listado, antes de entrar a la ficha.

```
Medí tu salto vertical con la cámara del teléfono. Sin sensores ni equipo.
```

(73 caracteres)

## Descripción larga

Máximo 4000 caracteres.

```
Koru mide tu salto vertical usando solo la cámara de tu teléfono.

Grabás el salto en cámara lenta, marcás el frame en el que despegás y el frame
en el que aterrizás, y la app calcula la altura a partir del tiempo de vuelo.
No necesitás plataforma de contacto, sensores ni ningún equipo extra.

CINCO TIPOS DE SALTO

Cada uno con su consigna y un video de ejemplo para que sepas exactamente cómo
ejecutarlo:

• Salto sentadilla profunda — 3 segundos inmóvil y saltás
• Salto con impulso — con impulso de brazos
• Salto sin impulso — manos en la cadera
• Salto desde el cajón — caés del cajón y saltás
• Salto a un pie — un solo pie en el piso

MEDICIÓN FRAME A FRAME

La app graba en cámara lenta y te deja recorrer el video cuadro por cuadro con
una línea de tiempo. Vos marcás el despegue y el aterrizaje; Koru calcula la
altura con la física del tiempo de vuelo. Cuanto más preciso el marcado, más
precisa la medición.

TU PROGRESO

Cada medición queda guardada con su video. Podés ver el historial de cada tipo
de salto y tu récord personal, y comparar cómo venís evolucionando.

COMPARTÍ TU MEJOR INTENTO

Koru recorta el clip justo en el salto para que puedas compartirlo sin editar
nada.

TODO EN TU TELÉFONO

Los videos y las mediciones se guardan en tu dispositivo. No hay servidores de
por medio.
```

## Categoría y etiquetas

- **Tipo de aplicación**: Aplicación (no juego)
- **Categoría**: Salud y bienestar (alternativa: Deportes)
- **Etiquetas sugeridas**: entrenamiento, fitness, deportes, rendimiento

## Datos de contacto

- **Correo**: fernamariscotti@gmail.com
- **Sitio web**: https://ferna105.github.io/Koru/
- **Política de privacidad**: https://ferna105.github.io/Koru/privacy.html

## Recursos gráficos

| Recurso | Requisito de Play | Estado |
| --- | --- | --- |
| Ícono | 512×512 PNG, 32 bits, sin transparencia | ✅ `store/android/icon-512.png` |
| Gráfico de funciones | 1024×500 PNG o JPG | ❌ falta |
| Capturas de teléfono | mín. 2, entre 320 px y 3840 px de lado | ✅ `store/android/screen-*.png` (1080×2400) |
| Capturas de tablet | opcional (obligatorio solo si se declara soporte de tablet) | — |

## Data safety — qué declarar

La app **sí recolecta datos**, por el login con Google:

| Tipo de dato | Se recolecta | Se comparte | Motivo |
| --- | --- | --- | --- |
| Nombre | Sí | No | Funcionalidad de la app (identificar la cuenta) |
| Dirección de correo | Sí | No | Funcionalidad de la app / autenticación |
| Foto de perfil | Sí | No | Funcionalidad de la app (mostrarla en Cuenta) |

Precisiones:

- Los datos **no salen del dispositivo**: `GOOGLE_WEB_CLIENT_ID` autentica contra
  Google y el perfil se guarda en AsyncStorage. No hay backend propio
  (`services.constants.ts` todavía apunta a `localhost:8080`, sin uso real).
- Los **videos de los saltos y el historial no se recolectan**: viven en el
  directorio privado de la app (`RNFS.DocumentDirectoryPath`) y solo salen del
  teléfono si el usuario decide compartir un clip con el botón de compartir.
- Cifrado en tránsito: sí (el login con Google usa HTTPS).
- ¿Se pueden borrar los datos? Sí — cerrando sesión.
