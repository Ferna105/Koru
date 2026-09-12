import {
  GoogleSignin,
  statusCodes,
  type User as GoogleSignInUser,
} from '@react-native-google-signin/google-signin';
import {
  GOOGLE_IOS_CLIENT_ID,
  GOOGLE_WEB_CLIENT_ID,
  isGoogleSignInConfigured,
} from 'config/google.config';
import {
  GoogleProfile,
  GoogleService,
  GoogleSignInErrorReason,
  GoogleSignInResult,
} from './google.services.interfaces';

// Igual que `testsService`, esto es un objeto plano y no un hook: no depende de
// axios ni del token de la app, habla directo con el SDK nativo de Google.

/**
 * El SDK tipa el error como `unknown`, pero el módulo nativo adjunta un `code`.
 * `statusCodes` no expone DEVELOPER_ERROR, que en Android llega como '10'.
 */
const DEVELOPER_ERROR_CODE = '10';

const readErrorCode = (error: unknown): string =>
  typeof error === 'object' && error !== null && 'code' in error
    ? String((error as { code: unknown }).code)
    : '';

const reasonForError = (error: unknown): GoogleSignInErrorReason => {
  const code = readErrorCode(error);
  if (code === DEVELOPER_ERROR_CODE || code === 'DEVELOPER_ERROR') {
    return 'SIGNING_MISMATCH';
  }
  if (code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
    return 'PLAY_SERVICES';
  }
  return 'UNKNOWN';
};

const mapUserToProfile = (user: GoogleSignInUser): GoogleProfile => ({
  id: user.user.id,
  email: user.user.email,
  name: user.user.name,
  givenName: user.user.givenName,
  familyName: user.user.familyName,
  photo: user.user.photo,
});

export const googleService: GoogleService = {
  configure: () => {
    if (!isGoogleSignInConfigured()) {
      return;
    }
    GoogleSignin.configure({
      webClientId: GOOGLE_WEB_CLIENT_ID,
      iosClientId: GOOGLE_IOS_CLIENT_ID,
      scopes: ['profile', 'email'],
    });
  },

  signIn: async (): Promise<GoogleSignInResult> => {
    if (!isGoogleSignInConfigured()) {
      return { status: 'NOT_CONFIGURED' };
    }
    try {
      await GoogleSignin.hasPlayServices({
        showPlayServicesUpdateDialog: true,
      });
      const response = await GoogleSignin.signIn();
      if (response.type !== 'success') {
        return { status: 'CANCELLED' };
      }
      return { status: 'SUCCESS', profile: mapUserToProfile(response.data) };
    } catch (error) {
      const reason = reasonForError(error);
      // El código nativo es lo único que permite distinguir un problema de
      // firma de uno de red, así que queda en el log aunque no se muestre.
      console.warn(
        `[google] signIn falló (${reason}, code=${readErrorCode(error) || 'sin código'})`,
      );
      return { status: 'ERROR', reason, error };
    }
  },

  signOut: async (): Promise<void> => {
    try {
      await GoogleSignin.signOut();
    } catch {
      // Cerrar sesión local no debería bloquearse porque el SDK falle.
    }
  },
};
