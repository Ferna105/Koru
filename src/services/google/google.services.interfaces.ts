/** Datos de la persona que devuelve Google al iniciar sesión. */
export interface GoogleProfile {
  id: string;
  email: string;
  name: string | null;
  givenName: string | null;
  familyName: string | null;
  photo: string | null;
}

export type GoogleSignInResult =
  | { status: 'SUCCESS'; profile: GoogleProfile }
  | { status: 'CANCELLED' }
  /** Faltan los client IDs en `config/google.config.ts`. */
  | { status: 'NOT_CONFIGURED' }
  | { status: 'ERROR'; error: unknown };

export interface GoogleService {
  configure: () => void;
  signIn: () => Promise<GoogleSignInResult>;
  signOut: () => Promise<void>;
}
