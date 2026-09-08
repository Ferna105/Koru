import 'react-native-gesture-handler';
import React from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { AuthProvider } from './src/contexts/auth.context';
import { ServiceProvider } from './src/contexts/service.context';
import { UserProvider } from './src/contexts/user.context';
import { Navigator } from './src/navigation';
import { NavigationContainer, Theme } from '@react-navigation/native';
import { ThemeProvider, tokens } from './src/design-system';
import { googleService } from './src/services/google/google.services';

const navTheme: Theme = {
  dark: true,
  colors: {
    primary: tokens.color.brand.primary,
    background: tokens.color.bg.base,
    card: tokens.color.bg.surface,
    text: tokens.color.text.primary,
    border: tokens.color.border.default,
    notification: tokens.color.brand.danger,
  },
};

// `configure` es sincrónico y hay que llamarlo una sola vez antes del primer
// `signIn`.
googleService.configure();

function App() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <ThemeProvider>
        <NavigationContainer theme={navTheme}>
          <AuthProvider>
            <UserProvider>
              <ServiceProvider>
                <Navigator />
              </ServiceProvider>
            </UserProvider>
          </AuthProvider>
        </NavigationContainer>
      </ThemeProvider>
    </GestureHandlerRootView>
  );
}

export default App;
