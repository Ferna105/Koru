import React from 'react';
import { Text as RNText, View } from 'react-native';
import { useTheme } from 'design-system';
import { SIZE_TO_FONT, styles } from './badge.styles';

export type BadgeTone =
  | 'gold'
  | 'danger'
  | 'success'
  | 'warning'
  | 'info'
  | 'neutral';

export type BadgeSize = 'sm' | 'md' | 'lg';

interface BadgeProps {
  tone?: BadgeTone;
  size?: BadgeSize;
  dot?: boolean;
  children: React.ReactNode;
}

const withAlpha = (hex: string, alpha: number): string => {
  // hex: #RRGGBB → rgba(R,G,B,alpha)
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `rgba(${r},${g},${b},${alpha})`;
};

export const Badge = ({
  tone = 'gold',
  size = 'md',
  dot,
  children,
}: BadgeProps) => {
  const tokens = useTheme();

  const palette = {
    gold: { bg: tokens.color.brand.primary, fg: tokens.color.text.onBrand },
    danger: { bg: tokens.color.brand.danger, fg: tokens.color.text.onDanger },
    success: {
      bg: withAlpha(tokens.color.semantic.success, 0.15),
      fg: tokens.color.semantic.success,
    },
    warning: {
      bg: withAlpha(tokens.color.semantic.warning, 0.15),
      fg: tokens.color.semantic.warning,
    },
    info: {
      bg: withAlpha(tokens.color.semantic.info, 0.15),
      fg: tokens.color.semantic.info,
    },
    neutral: {
      bg: tokens.color.bg.elevated,
      fg: tokens.color.text.secondary,
    },
  }[tone];

  return (
    <View style={[styles.base, styles[size], { backgroundColor: palette.bg }]}>
      {dot && <View style={[styles.dot, { backgroundColor: palette.fg }]} />}
      <RNText
        style={{
          color: palette.fg,
          fontSize: SIZE_TO_FONT[size],
          fontWeight: '700',
          letterSpacing: 1,
          textTransform: 'uppercase',
          fontFamily: 'Manrope-Bold',
        }}>
        {children}
      </RNText>
    </View>
  );
};
