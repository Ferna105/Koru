import React from 'react';
import {
  ActivityIndicator,
  Pressable,
  PressableProps,
  TouchableOpacityProps,
  View,
} from 'react-native';
import { useTheme } from 'design-system';
import { Text } from 'components/Text/text.component';
import { Icon } from 'components/Icon/icon.component';
import { Icons } from 'components/Icon/icon.interfaces';
import { ButtonSize, SIZES, styles } from './button.styles';

export type ButtonVariant =
  | 'primary'
  | 'secondary'
  | 'destructive'
  | 'ghost'
  | 'link';

interface ButtonProps {
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
  fullWidth?: boolean;
  iconLeft?: keyof typeof Icons;
  iconRight?: keyof typeof Icons;
}

type Props = Omit<TouchableOpacityProps, 'children'> &
  Omit<PressableProps, 'children' | 'style'> &
  ButtonProps & {
    children?: React.ReactNode;
  };

export const Button = ({
  variant = 'primary',
  size = 'md',
  loading,
  fullWidth = true,
  iconLeft,
  iconRight,
  disabled,
  children,
  ...props
}: Props) => {
  const tokens = useTheme();

  const VARIANTS: Record<
    ButtonVariant,
    { bg: string; fg: string; border: string; borderWidth: number }
  > = {
    primary: {
      bg: tokens.color.brand.primary,
      fg: tokens.color.text.onBrand,
      border: 'transparent',
      borderWidth: 0,
    },
    secondary: {
      bg: 'transparent',
      fg: tokens.color.text.primary,
      border: tokens.color.border.strong,
      borderWidth: 1,
    },
    destructive: {
      bg: tokens.color.brand.danger,
      fg: tokens.color.text.onDanger,
      border: 'transparent',
      borderWidth: 0,
    },
    ghost: {
      bg: 'transparent',
      fg: tokens.color.text.primary,
      border: 'transparent',
      borderWidth: 0,
    },
    link: {
      bg: 'transparent',
      fg: tokens.color.text.link,
      border: 'transparent',
      borderWidth: 0,
    },
  };

  const v = VARIANTS[variant];
  const s = SIZES[size];
  const isDisabled = disabled || loading;

  return (
    <Pressable
      {...props}
      disabled={isDisabled}
      hitSlop={tokens.spacing.sm}
      style={({ pressed }) => [
        styles.base,
        fullWidth ? styles.fullWidth : styles.inline,
        {
          height: s.height,
          paddingHorizontal: s.paddingHorizontal,
          backgroundColor: v.bg,
          borderColor: v.border,
          borderWidth: v.borderWidth,
          opacity: isDisabled
            ? tokens.opacity.disabled
            : pressed
            ? tokens.opacity.pressed
            : 1,
        },
      ]}>
      {loading && <ActivityIndicator size="small" color={v.fg} />}
      {iconLeft && !loading && <Icon name={iconLeft} size="L" color={v.fg} />}
      {children !== undefined && children !== null && (
        <Text variant="button" style={{ color: v.fg }}>
          {children}
        </Text>
      )}
      {iconRight && (
        <View>
          <Icon name={iconRight} size="L" color={v.fg} />
        </View>
      )}
    </Pressable>
  );
};
