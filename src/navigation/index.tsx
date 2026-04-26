import React, { useContext } from 'react';

import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Login } from 'screens/public/login/login.screen';
import { AuthContext } from 'contexts/auth.context';
import { RootStackParamList } from './types';
import { HomeTabs } from 'screens/private/homeTabs/homeTabs.screen';
import { JumpTestNavigator } from 'screens/private/tests/jumpTest/jumpTest.navigator';

const Stack = createNativeStackNavigator<RootStackParamList>();

export const Navigator = () => {
  const { authToken } = useContext(AuthContext);

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
