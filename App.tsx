import 'react-native-gesture-handler';
import React from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { AuthProvider } from './src/contexts/auth.context';
import { ServiceProvider } from './src/contexts/service.context';
import { Navigator } from './src/navigation';
import { NavigationContainer, Theme } from '@react-navigation/native';
import { ThemeProvider, tokens } from './src/design-system';

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

function App() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <ThemeProvider>
        <NavigationContainer theme={navTheme}>
          <AuthProvider>
            <ServiceProvider>
              <Navigator />
            </ServiceProvider>
          </AuthProvider>
        </NavigationContainer>
      </ThemeProvider>
    </GestureHandlerRootView>
  );
}

export default App;
