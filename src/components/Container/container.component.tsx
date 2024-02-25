import React from 'react';
import { SafeAreaView, ScrollView, View } from 'react-native';

import { ReactElement } from 'react';
import { StyleProp, ViewStyle } from 'react-native';
import { styles } from './container.styles';

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
  return (
    <SafeAreaView style={styles.safeArea}>
      <Content scrollable={scrollable}>
        <View style={[style, styles.container]}>{children}</View>
      </Content>
    </SafeAreaView>
  );
};
