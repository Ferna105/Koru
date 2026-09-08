import AsyncStorage from '@react-native-async-storage/async-storage';
import React, {
  createContext,
  PropsWithChildren,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { GoogleProfile } from 'services/google/google.services.interfaces';

export const USER_STORAGE_KEY = '@user';

interface UserContextType {
  /** Perfil de Google de la sesión actual; `null` si todavía no hay usuario. */
  user: GoogleProfile | null;
  setUser: (user: GoogleProfile | null) => void;
}

const UserContext = createContext<UserContextType>({
  user: null,
  setUser: () => {},
});

const UserProvider: React.FC<PropsWithChildren> = ({ children }) => {
  const [user, setUserState] = useState<GoogleProfile | null>(null);

  // Rehidrata el perfil guardado para que "Mi perfil" tenga datos apenas
  // arranca la app (el gate de sesión lo sigue manejando `AuthContext`).
  useEffect(() => {
    AsyncStorage.getItem(USER_STORAGE_KEY).then(raw => {
      if (!raw) {
        return;
      }
      try {
        setUserState(JSON.parse(raw) as GoogleProfile);
      } catch {
        AsyncStorage.removeItem(USER_STORAGE_KEY);
      }
    });
  }, []);

  const setUser = useCallback((next: GoogleProfile | null): void => {
    setUserState(next);
    if (next) {
      AsyncStorage.setItem(USER_STORAGE_KEY, JSON.stringify(next));
    } else {
      AsyncStorage.removeItem(USER_STORAGE_KEY);
    }
  }, []);

  const contextValue = useMemo(() => ({ user, setUser }), [user, setUser]);

  return (
    <UserContext.Provider value={contextValue}>{children}</UserContext.Provider>
  );
};

export { UserContext, UserProvider };
