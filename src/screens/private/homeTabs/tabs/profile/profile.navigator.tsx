import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { HomeTabScreenProps, ProfileStackParamList } from 'navigation/types';
import { Profile } from './profile.screen';
import { MyProfile } from './screens/myProfile/myProfile.screen';
import { About } from './screens/about/about.screen';

const Stack = createNativeStackNavigator<ProfileStackParamList>();

// Stack anidado dentro del tab "Cuenta" (a diferencia de JumpTest, que es
// hermano de HomeTabs) para que la bottom nav siga visible en las subpantallas.
export const ProfileNavigator = ({}: HomeTabScreenProps<'Profile'>) => {
  return (
    <Stack.Navigator
      screenOptions={{ headerShown: false, animation: 'slide_from_right' }}>
      <Stack.Screen name="ProfileHome" component={Profile} />
      <Stack.Screen name="MyProfile" component={MyProfile} />
      <Stack.Screen name="About" component={About} />
    </Stack.Navigator>
  );
};
