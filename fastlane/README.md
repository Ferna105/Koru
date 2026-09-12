fastlane documentation
----

# Installation

Make sure you have the latest version of the Xcode command line tools installed:

```sh
xcode-select --install
```

For _fastlane_ installation instructions, see [Installing _fastlane_](https://docs.fastlane.tools/#installing-fastlane)

# Available Actions

## Android

### android version

```sh
[bundle exec] fastlane android version
```

Muestra la versión actual y verifica que los cuatro lugares coincidan

### android bump

```sh
[bundle exec] fastlane android bump
```

Sube versionName/versionCode en los cuatro lugares. Uso: bump version:1.0.3 [build:5]

### android check

```sh
[bundle exec] fastlane android check
```

Type-check, lint y tests

### android build

```sh
[bundle exec] fastlane android build
```

Genera el AAB firmado de release

### android upload

```sh
[bundle exec] fastlane android upload
```

Sube el AAB ya generado a Play. Uso: upload [track:alpha] [notes:"..."]

### android release

```sh
[bundle exec] fastlane android release
```

Release completo: bump + checks + AAB + subida. Uso: release version:1.0.3 [build:5] [track:alpha] [notes:"..."] [skip_checks:true] [commit:false]

### android promote

```sh
[bundle exec] fastlane android promote
```

Promueve un versionCode ya publicado de un canal a otro. Uso: promote from:alpha to:production [build:5]

### android validate_key

```sh
[bundle exec] fastlane android validate_key
```

Valida que la clave de servicio tenga acceso a la app

----

This README.md is auto-generated and will be re-generated every time [_fastlane_](https://fastlane.tools) is run.

More information about _fastlane_ can be found on [fastlane.tools](https://fastlane.tools).

The documentation of _fastlane_ can be found on [docs.fastlane.tools](https://docs.fastlane.tools).
