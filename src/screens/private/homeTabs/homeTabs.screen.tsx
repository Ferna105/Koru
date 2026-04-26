import React from 'react';

import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { HomeTabParamList, RootStackScreenProps } from 'navigation/types';
import { Home } from './tabs/home/home.screen';
import { Profile } from './tabs/profile/profile.screen';
import { Tests } from './tabs/tests/tests.screen';
import { useTheme } from '@react-navigation/native';

const BottomTabNavigator = createBottomTabNavigator<HomeTabParamList>();

export const HomeTabs = ({}: RootStackScreenProps<'HomeTabs'>) => {
  const { colors } = useTheme();

  return (
    <BottomTabNavigator.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: colors.primary,
          borderTopColor: colors.background,
        },
        tabBarInactiveTintColor: colors.background,
        tabBarActiveTintColor: colors.text,
        tabBarLabelStyle: { fontWeight: '700', letterSpacing: 1 },
      }}>
      <BottomTabNavigator.Screen
        name="Home"
        component={Home}
        options={{ tabBarLabel: 'HOME' }}
      />
      <BottomTabNavigator.Screen
        name="Tests"
        component={Tests}
        options={{ tabBarLabel: 'TESTS' }}
      />
      <BottomTabNavigator.Screen
        name="Profile"
        component={Profile}
        options={{ tabBarLabel: 'CUENTA' }}
      />
    </BottomTabNavigator.Navigator>
  );
};
