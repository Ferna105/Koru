import React, { useContext, useEffect } from 'react';

import { createNativeStackNavigator } from '@react-navigation/native-stack';
import BootSplash from 'react-native-bootsplash';
import { Login } from 'screens/public/login/login.screen';
import { AuthContext } from 'contexts/auth.context';
import { RootStackParamList } from './types';
import { HomeTabs } from 'screens/private/homeTabs/homeTabs.screen';
import { JumpTestNavigator } from 'screens/private/tests/jumpTest/jumpTest.navigator';
import { DesignSystemScreen } from 'screens/private/_dev/designSystem.screen';

const Stack = createNativeStackNavigator<RootStackParamList>();

export const Navigator = () => {
  const { authToken } = useContext(AuthContext);

  // Hide the native bootsplash once auth hydration finishes (authToken
  // transitions from `null` to either '' or a real token).
  useEffect(() => {
    if (authToken !== null) {
      BootSplash.hide({ fade: true });
    }
  }, [authToken]);

  if (authToken === null) {
    return <></>;
  }

  return (
    <Stack.Navigator>
      {authToken ? (
        <>
          <Stack.Screen
            name="HomeTabs"
            component={HomeTabs}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="JumpTest"
            component={JumpTestNavigator}
            options={{ headerShown: false }}
          />
          {__DEV__ && (
            <Stack.Screen
              name="DesignSystem"
              component={DesignSystemScreen}
              options={{ title: 'Design System' }}
            />
          )}
        </>
      ) : (
        <Stack.Screen
          name="Login"
          component={Login}
          options={{ headerShown: false }}
        />
      )}
    </Stack.Navigator>
  );
};
