import React from 'react';
import {
  Pressable,
  PressableProps,
  View,
  ViewProps,
  ViewStyle,
} from 'react-native';
import { useTheme } from 'design-system';
import { styles } from './card.styles';

export type CardVariant = 'default' | 'elevated' | 'outlined';

interface CardProps {
  variant?: CardVariant;
  onPress?: () => void;
}

type Props = ViewProps &
  Omit<PressableProps, 'children' | 'style'> &
  CardProps & {
    children?: React.ReactNode;
    style?: ViewStyle | ViewStyle[];
  };

export const Card = ({
  variant = 'default',
  onPress,
  children,
  style,
  ...rest
}: Props) => {
  const tokens = useTheme();
  const variantStyle = styles[variant];

  if (onPress) {
    return (
      <Pressable
        onPress={onPress}
        style={({ pressed }) => [
          styles.base,
          variantStyle,
          pressed && { opacity: tokens.opacity.pressed },
          style,
        ]}>
        {children}
      </Pressable>
    );
  }

  return (
    <View {...rest} style={[styles.base, variantStyle, style]}>
      {children}
    </View>
  );
};
