import React from 'react';

import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { HomeTabParamList, RootStackScreenProps } from 'navigation/types';
import { Home } from './tabs/home/home.screen';
import { Profile } from './tabs/profile/profile.screen';
import { MatchTabs } from './tabs/matchTabs/matchTabs.screen';
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
      }}>
      <BottomTabNavigator.Screen name="Home" component={Home} />
      <BottomTabNavigator.Screen name="MatchTabs" component={MatchTabs} />
      <BottomTabNavigator.Screen name="Profile" component={Profile} />
    </BottomTabNavigator.Navigator>
  );
};
