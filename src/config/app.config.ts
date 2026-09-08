// Metadatos estáticos de la app (los consume "Acerca de Koru").
//
// APP_VERSION / APP_BUILD tienen que acompañar a los valores nativos:
//   iOS      → MARKETING_VERSION / CURRENT_PROJECT_VERSION (Koru.xcodeproj)
//   Android  → versionName / versionCode (android/app/build.gradle)
export const APP_VERSION = '1.0';
export const APP_BUILD = '1';

export const APP_DESCRIPTION =
  'Koru mide tu salto vertical con la cámara del teléfono. Grabás el salto en ' +
  'cámara lenta, marcás el frame de despegue y el de aterrizaje, y la app ' +
  'calcula la altura a partir del tiempo de vuelo.';

export const APP_FEATURES: {
  icon: 'Dumbbell' | 'Timer' | 'Chart' | 'Share';
  text: string;
}[] = [
  {
    icon: 'Dumbbell',
    text: '5 tipos de salto con su consigna y video de ejemplo.',
  },
  { icon: 'Timer', text: 'Medición por tiempo de vuelo, frame a frame.' },
  { icon: 'Chart', text: 'Historial y récord personal de cada salto.' },
  { icon: 'Share', text: 'Compartí el clip recortado de tu mejor intento.' },
];

export const CONTACT_INSTAGRAM_HANDLE = 'pedropalacios.ok';
export const CONTACT_INSTAGRAM_URL =
  'https://www.instagram.com/pedropalacios.ok';
/** Deep link a la app nativa; si no está instalada se cae a la URL web. */
export const CONTACT_INSTAGRAM_APP_URL = `instagram://user?username=${CONTACT_INSTAGRAM_HANDLE}`;
