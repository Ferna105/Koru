// IDs de cliente OAuth del proyecto de Google Cloud "Koru" (koru-507923).
// Ver GOOGLE_SIGNIN_SETUP.md para el paso a paso de cómo se generaron y dónde
// se pega cada uno en las plataformas nativas.
//
// Si alguno vuelve al placeholder, el login de Google avisa que falta la
// configuración en vez de reventar con un error nativo opaco.
const PLACEHOLDER = 'REPLACE_ME';

/** Client ID de tipo "Web application". Necesario en Android y para el idToken. */
export const GOOGLE_WEB_CLIENT_ID =
  '750626947997-mtmtql4bhj1sumebtqnttevvesuaksn3.apps.googleusercontent.com';

/** Client ID de tipo "iOS". Su reverse debe estar en el Info.plist. */
export const GOOGLE_IOS_CLIENT_ID =
  '750626947997-bl008hifetsn1cao7cqroi8oih0bqt37.apps.googleusercontent.com';

export const isGoogleSignInConfigured = (): boolean =>
  !GOOGLE_WEB_CLIENT_ID.includes(PLACEHOLDER) &&
  !GOOGLE_IOS_CLIENT_ID.includes(PLACEHOLDER);
