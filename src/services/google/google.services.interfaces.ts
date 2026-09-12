/** Datos de la persona que devuelve Google al iniciar sesión. */
export interface GoogleProfile {
  id: string;
  email: string;
  name: string | null;
  givenName: string | null;
  familyName: string | null;
  photo: string | null;
}

/**
 * Por qué falló el login. Importa distinguirlos porque la acción que resuelve
 * cada uno es distinta y solo una la puede hacer la persona usuaria.
 */
export type GoogleSignInErrorReason =
  /**
   * DEVELOPER_ERROR (código 10 en Android): el par package + SHA-1 con el que
   * está firmado el build no coincide con ningún client de OAuth del proyecto.
   * Pasa, por ejemplo, si se publica en Play sin registrar la SHA-1 de Play App
   * Signing, que es distinta de la clave de subida. No es un problema de red y
   * no se arregla reintentando.
   */
  | 'SIGNING_MISMATCH'
  /** Google Play Services ausente o desactualizado en el dispositivo. */
  | 'PLAY_SERVICES'
  /** Cualquier otra cosa, incluida una caída de red real. */
  | 'UNKNOWN';

export type GoogleSignInResult =
  | { status: 'SUCCESS'; profile: GoogleProfile }
  | { status: 'CANCELLED' }
  /** Faltan los client IDs en `config/google.config.ts`. */
  | { status: 'NOT_CONFIGURED' }
  | { status: 'ERROR'; reason: GoogleSignInErrorReason; error: unknown };

export interface GoogleService {
  configure: () => void;
  signIn: () => Promise<GoogleSignInResult>;
  signOut: () => Promise<void>;
}
