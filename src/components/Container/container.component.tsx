import React from 'react';
import {
  ImageBackground,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  View,
} from 'react-native';

import { ReactElement } from 'react';
import { StyleProp, ViewStyle } from 'react-native';
import { styles } from './container.styles';
import { useTheme } from '@react-navigation/native';

interface ContainerProps {
  children: ReactElement | ReactElement[];
  style?: StyleProp<ViewStyle>;
  scrollable?: boolean;
}

interface ContentProps {
  children: ReactElement | ReactElement[];
  scrollable: boolean;
}

const Content = ({ children, scrollable }: ContentProps) => {
  if (scrollable) {
    return <ScrollView nestedScrollEnabled>{children}</ScrollView>;
  } else {
    return <>{children}</>;
  }
};

export const Container = ({
  children,
  style,
  scrollable = false,
}: ContainerProps) => {
  const { colors } = useTheme();

  return (
    <SafeAreaView
      style={[styles.safeArea, { backgroundColor: colors.background }]}>
      <Content scrollable={scrollable}>
        <ImageBackground
          source={require('./container.png')}
          resizeMode="contain"
          style={StyleSheet.absoluteFill}
        />
        <View style={[style, styles.container]}>{children}</View>
      </Content>
    </SafeAreaView>
  );
};
