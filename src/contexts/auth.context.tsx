import { useAsyncStorage } from '@react-native-async-storage/async-storage';
import React, {
  createContext,
  useReducer,
  useCallback,
  useMemo,
  PropsWithChildren,
  useEffect,
} from 'react';

interface AuthState {
  authToken: string | null;
  refreshToken: string | null;
}

const initialState: AuthState = {
  authToken: null,
  refreshToken: null,
};

enum AuthActionTypes {
  SET_AUTH_TOKEN = 'SET_AUTH_TOKEN',
  SET_REFRESH_TOKEN = 'SET_REFRESH_TOKEN',
}

interface SetAuthTokenAction {
  type: AuthActionTypes.SET_AUTH_TOKEN;
  payload: string | null;
}

interface SetRefreshTokenAction {
  type: AuthActionTypes.SET_REFRESH_TOKEN;
  payload: string | null;
}

type AuthAction = SetAuthTokenAction | SetRefreshTokenAction;

const authReducer = (state: AuthState, action: AuthAction): AuthState => {
  switch (action.type) {
    case AuthActionTypes.SET_AUTH_TOKEN:
      return {
        ...state,
        authToken: action.payload,
      };
    case AuthActionTypes.SET_REFRESH_TOKEN:
      return {
        ...state,
        refreshToken: action.payload,
      };
    default:
      return state;
  }
};

interface AuthContextType {
  authToken: string | null;
  setAuthToken: (authToken: string) => void;
  refreshToken: string | null;
  setRefreshToken: (refreshToken: string) => void;
}

const AuthContext = createContext<AuthContextType>({
  authToken: null,
  setAuthToken: () => {},
  refreshToken: null,
  setRefreshToken: () => {},
});

const AuthProvider: React.FC<PropsWithChildren> = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);
  const authTokenAsyncStorage = useAsyncStorage('@authToken');
  const refreshTokenAsyncStorage = useAsyncStorage('@refreshToken');

  const setAuthToken = useCallback(
    (authToken: string | null): void => {
      const action: SetAuthTokenAction = {
        type: AuthActionTypes.SET_AUTH_TOKEN,
        payload: authToken,
      };
      dispatch(action);
    },
    [dispatch],
  );

  const setRefreshToken = useCallback(
    (refreshToken: string | null): void => {
      const action: SetRefreshTokenAction = {
        type: AuthActionTypes.SET_REFRESH_TOKEN,
        payload: refreshToken,
      };
      dispatch(action);
    },
    [dispatch],
  );

  const contextValue = useMemo(() => {
    return {
      authToken: state.authToken,
      setAuthToken,
      refreshToken: state.refreshToken,
      setRefreshToken,
    };
  }, [state.authToken, setAuthToken, state.refreshToken, setRefreshToken]);

  useEffect(() => {
    if (state.authToken === null) {
      authTokenAsyncStorage.getItem().then(authToken => {
        setAuthToken(authToken ?? '');
      });
    } else {
      authTokenAsyncStorage.setItem(state.authToken);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [setAuthToken, state.authToken]);

  useEffect(() => {
    if (state.refreshToken === null) {
      refreshTokenAsyncStorage.getItem().then(refreshToken => {
        setRefreshToken(refreshToken ?? '');
      });
    } else {
      refreshTokenAsyncStorage.setItem(state.refreshToken);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [setRefreshToken, state.refreshToken]);

  return (
    <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
  );
};

export { AuthContext, AuthProvider };
