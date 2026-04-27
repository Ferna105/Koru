#!/usr/bin/env bash
# Generate iOS + Android brand assets from the SVG masters in assets/brand/.
# Uses macOS-native tools (qlmanage to rasterize, sips to resize).
# Re-run any time the SVG masters change.

set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
BRAND="$ROOT/assets/brand"
TMP="$(mktemp -d)"
trap 'rm -rf "$TMP"' EXIT

ICON_SVG="$BRAND/app-icon-gold.svg"
SPLASH_SVG="$BRAND/splash-logo.svg"

if [[ ! -f "$ICON_SVG" || ! -f "$SPLASH_SVG" ]]; then
  echo "Missing SVG masters under $BRAND/" >&2
  exit 1
fi

echo "→ Rasterizing masters via qlmanage…"
qlmanage -t -s 1024 -o "$TMP" "$ICON_SVG" >/dev/null 2>&1
qlmanage -t -s 512 -o "$TMP" "$SPLASH_SVG" >/dev/null 2>&1

ICON_MASTER="$TMP/app-icon-gold.svg.png"
SPLASH_MASTER="$TMP/splash-logo.svg.png"

# ─── iOS AppIcon ───────────────────────────────────────────────────────────
IOS_ICON_DIR="$ROOT/ios/Koru/Images.xcassets/AppIcon.appiconset"
mkdir -p "$IOS_ICON_DIR"

resize_to() {
  local size="$1"
  local out="$2"
  sips -s format png -z "$size" "$size" "$ICON_MASTER" --out "$out" >/dev/null
}

echo "→ Writing iOS AppIcon size ladder…"
resize_to 40   "$IOS_ICON_DIR/Icon-20@2x.png"
resize_to 60   "$IOS_ICON_DIR/Icon-20@3x.png"
resize_to 58   "$IOS_ICON_DIR/Icon-29@2x.png"
resize_to 87   "$IOS_ICON_DIR/Icon-29@3x.png"
resize_to 80   "$IOS_ICON_DIR/Icon-40@2x.png"
resize_to 120  "$IOS_ICON_DIR/Icon-40@3x.png"
resize_to 120  "$IOS_ICON_DIR/Icon-60@2x.png"
resize_to 180  "$IOS_ICON_DIR/Icon-60@3x.png"
cp "$ICON_MASTER" "$IOS_ICON_DIR/Icon-1024.png"

# ─── Android legacy mipmaps (square + round) ───────────────────────────────
ANDROID_RES="$ROOT/android/app/src/main/res"

declare -a DENSITIES=("mdpi:48" "hdpi:72" "xhdpi:96" "xxhdpi:144" "xxxhdpi:192")

echo "→ Writing Android mipmap-* legacy launcher icons…"
for spec in "${DENSITIES[@]}"; do
  density="${spec%:*}"
  size="${spec#*:}"
  dir="$ANDROID_RES/mipmap-$density"
  mkdir -p "$dir"
  resize_to "$size" "$dir/ic_launcher.png"
  resize_to "$size" "$dir/ic_launcher_round.png"
done

echo "→ Writing splash logo PNGs (bootsplash master)…"
mkdir -p "$BRAND/generated"
sips -s format png -z 240 240 "$SPLASH_MASTER" --out "$BRAND/generated/splash-logo.png" >/dev/null
sips -s format png -z 480 480 "$SPLASH_MASTER" --out "$BRAND/generated/splash-logo@2x.png" >/dev/null
sips -s format png -z 720 720 "$SPLASH_MASTER" --out "$BRAND/generated/splash-logo@3x.png" >/dev/null

echo "✓ Brand assets generated."
