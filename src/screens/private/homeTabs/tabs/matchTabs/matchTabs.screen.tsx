import React from 'react';

import { HomeTabMatchTabParamList, HomeTabScreenProps } from 'navigation/types';
import { SearchMatch } from './tabs/searchMatch/searchMatch.screen';
import { CreateMatch } from './tabs/createMatch/createMatch.screen';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';

const TopTabNavigator =
  createMaterialTopTabNavigator<HomeTabMatchTabParamList>();

export const MatchTabs = ({}: HomeTabScreenProps<'MatchTabs'>) => {
  return (
    <TopTabNavigator.Navigator>
      <TopTabNavigator.Screen name="CreateMatch" component={CreateMatch} />
      <TopTabNavigator.Screen name="SearchMatch" component={SearchMatch} />
    </TopTabNavigator.Navigator>
  );
};
