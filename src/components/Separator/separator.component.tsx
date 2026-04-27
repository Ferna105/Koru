import React from 'react';
import { View } from 'react-native';
import { useTheme, ColorBorder } from 'design-system';
import { styles } from './separator.styles';

interface SeparatorProps {
  tone?: ColorBorder;
}

export const Separator = ({ tone = 'subtle' }: SeparatorProps) => {
  const tokens = useTheme();
  return (
    <View
      style={[
        styles.separator,
        { borderBottomColor: tokens.color.border[tone] },
      ]}
    />
  );
};
