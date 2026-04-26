import 'react-native-gesture-handler';
import React from 'react';
import { useColorScheme } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
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
    <GestureHandlerRootView style={{ flex: 1 }}>
      <NavigationContainer theme={scheme === 'dark' ? DarkTheme : DefaultTheme}>
        <AuthProvider>
          <ServiceProvider>
            <Navigator />
          </ServiceProvider>
        </AuthProvider>
      </NavigationContainer>
    </GestureHandlerRootView>
  );
}

export default App;
