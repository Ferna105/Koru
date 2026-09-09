import React, { ReactNode } from 'react';
import { ScrollView, StyleProp, View, ViewStyle } from 'react-native';
// El SafeAreaView de react-native es no-op en Android y está deprecado; con
// targetSdk 36 Android 16 dibuja edge-to-edge, así que los insets tienen que
// salir de safe-area-context para que la UI no quede bajo las barras.
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from 'design-system';
import { Tokens } from 'design-system';
import { styles } from './container.styles';

type ContainerVariant = keyof Tokens['color']['bg'];

interface ContainerProps {
  children: ReactNode;
  style?: StyleProp<ViewStyle>;
  scrollable?: boolean;
  /** Background surface variant. `base` is the default app canvas. */
  variant?: ContainerVariant;
  /** Drop the screen padding for full-bleed layouts (e.g. camera). */
  noPadding?: boolean;
}

const Content = ({
  children,
  scrollable,
}: {
  children: ReactNode;
  scrollable: boolean;
}) =>
  scrollable ? (
    <ScrollView nestedScrollEnabled>{children}</ScrollView>
  ) : (
    <>{children}</>
  );

export const Container = ({
  children,
  style,
  scrollable = false,
  variant = 'base',
  noPadding = false,
}: ContainerProps) => {
  const tokens = useTheme();
  const bg = tokens.color.bg[variant];

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: bg }]}>
      <Content scrollable={scrollable}>
        <View
          style={[
            { flex: 1, padding: noPadding ? 0 : tokens.layout.screenPadding },
            style,
          ]}>
          {children}
        </View>
      </Content>
    </SafeAreaView>
  );
};
