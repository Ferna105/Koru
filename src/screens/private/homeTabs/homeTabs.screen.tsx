import React from 'react';

import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { HomeTabParamList, RootStackScreenProps } from 'navigation/types';
import { Home } from './tabs/home/home.screen';
import { Profile } from './tabs/profile/profile.screen';
import { MatchTabs } from './tabs/matchTabs/matchTabs.screen';

const BottomTabNavigator = createBottomTabNavigator<HomeTabParamList>();

export const HomeTabs = ({}: RootStackScreenProps<'HomeTabs'>) => {
  return (
    <BottomTabNavigator.Navigator>
      <BottomTabNavigator.Screen name="Home" component={Home} />
      <BottomTabNavigator.Screen name="MatchTabs" component={MatchTabs} />
      <BottomTabNavigator.Screen name="Profile" component={Profile} />
    </BottomTabNavigator.Navigator>
  );
};
