import React from 'react';

import {
  createBottomTabNavigator,
  BottomTabBarProps,
} from '@react-navigation/bottom-tabs';
import { HomeTabParamList, RootStackScreenProps } from 'navigation/types';
import { Home } from './tabs/home/home.screen';
import { Profile } from './tabs/profile/profile.screen';
import { Tests } from './tabs/tests/tests.screen';
import { BottomNav, BottomNavItem } from 'components';

const BottomTabNavigator = createBottomTabNavigator<HomeTabParamList>();

const TAB_ITEMS: BottomNavItem[] = [
  { id: 'Home', label: 'Inicio', icon: 'Home' },
  { id: 'Tests', label: 'Tests', icon: 'List' },
  { id: 'Profile', label: 'Cuenta', icon: 'User' },
];

const TabBar = ({ state, navigation }: BottomTabBarProps) => {
  const activeId = state.routes[state.index].name;
  return (
    <BottomNav
      items={TAB_ITEMS}
      activeId={activeId}
      onSelect={id => {
        const target = state.routes.find(r => r.name === id);
        if (!target) {
          return;
        }
        const event = navigation.emit({
          type: 'tabPress',
          target: target.key,
          canPreventDefault: true,
        });
        const isActive = state.index === state.routes.indexOf(target);
        if (isActive || event.defaultPrevented) {
          return;
        }
        navigation.navigate(target.name, target.params);
      }}
    />
  );
};

export const HomeTabs = ({}: RootStackScreenProps<'HomeTabs'>) => {
  return (
    <BottomTabNavigator.Navigator
      screenOptions={{ headerShown: false }}
      tabBar={TabBar}>
      <BottomTabNavigator.Screen name="Home" component={Home} />
      <BottomTabNavigator.Screen name="Tests" component={Tests} />
      <BottomTabNavigator.Screen name="Profile" component={Profile} />
    </BottomTabNavigator.Navigator>
  );
};
