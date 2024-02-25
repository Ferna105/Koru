import React from 'react';
import { useColorScheme } from 'react-native';
import { AuthProvider } from './src/contexts/auth.context';
import { ServiceProvider } from './src/contexts/service.context';
import { Navigator } from './src/navigation';
import {
  DarkTheme,
  DefaultTheme,
  NavigationContainer,
} from '@react-navigation/native';

function App() {
  const scheme = useColorScheme();

  return (
    <NavigationContainer theme={scheme === 'dark' ? DarkTheme : DefaultTheme}>
      <AuthProvider>
        <ServiceProvider>
          <Navigator />
        </ServiceProvider>
      </AuthProvider>
    </NavigationContainer>
  );
}

export default App;
