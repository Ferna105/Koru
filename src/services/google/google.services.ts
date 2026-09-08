import {
  GoogleSignin,
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
  GoogleSignInResult,
} from './google.services.interfaces';

// Igual que `testsService`, esto es un objeto plano y no un hook: no depende de
// axios ni del token de la app, habla directo con el SDK nativo de Google.

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
      return { status: 'ERROR', error };
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
