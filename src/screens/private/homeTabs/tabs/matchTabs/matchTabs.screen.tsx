import React from 'react';

import { HomeTabMatchTabParamList, HomeTabScreenProps } from 'navigation/types';
import { SearchMatch } from './tabs/searchMatch/searchMatch.screen';
import { CreateMatch } from './tabs/createMatch/createMatch.screen';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

const BottomTabNavigator = createBottomTabNavigator<HomeTabMatchTabParamList>();

export const MatchTabs = ({}: HomeTabScreenProps<'MatchTabs'>) => {
  return (
    <BottomTabNavigator.Navigator>
      <BottomTabNavigator.Screen name="CreateMatch" component={CreateMatch} />
      <BottomTabNavigator.Screen name="SearchMatch" component={SearchMatch} />
    </BottomTabNavigator.Navigator>
  );
};
