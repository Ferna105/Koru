import React from 'react';
import { useColorScheme } from 'react-native';
import { AuthProvider } from './src/contexts/auth.context';
import { ServiceProvider } from './src/contexts/service.context';
import { Navigator } from './src/navigation';
import { NavigationContainer, Theme } from '@react-navigation/native';

function App() {
  const scheme = useColorScheme();

  const DarkTheme: Theme = {
    colors: {
      background: 'black',
      primary: 'red',
      text: 'white',
      border: 'white',
      card: '#FFF000',
      notification: 'white',
    },
    dark: true,
  };

  const DefaultTheme: Theme = {
    colors: {
      background: '#000000',
      primary: '#D42127',
      text: '#FFFFFF',
      border: '#FFFFFF',
      card: '#F2B619',
      notification: '#F2B619',
    },
    dark: false,
  };

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
