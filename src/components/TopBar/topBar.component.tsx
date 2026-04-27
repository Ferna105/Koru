import React, { ReactNode } from 'react';
import { View } from 'react-native';
import { Text } from 'components/Text/text.component';
import { styles } from './topBar.styles';

export type TopBarVariant = 'gold' | 'dark' | 'ghost';

interface TopBarProps {
  title?: string;
  leading?: ReactNode;
  trailing?: ReactNode;
  variant?: TopBarVariant;
}

export const TopBar = ({
  title,
  leading,
  trailing,
  variant = 'ghost',
}: TopBarProps) => {
  const variantStyle = styles[variant];
  const titleTone = variant === 'gold' ? 'onBrand' : 'primary';

  return (
    <View style={[styles.base, variantStyle]}>
      <View style={styles.side}>{leading}</View>
      <View style={styles.titleWrap}>
        {title && (
          <Text variant="headingSM" tone={titleTone}>
            {title}
          </Text>
        )}
      </View>
      <View style={[styles.side, styles.trailing]}>{trailing}</View>
    </View>
  );
};
