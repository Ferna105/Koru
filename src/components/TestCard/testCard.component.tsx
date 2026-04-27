import React from 'react';
import { Pressable, View } from 'react-native';
import { useTheme } from 'design-system';
import { Text } from 'components/Text/text.component';
import { Icon } from 'components/Icon/icon.component';
import { styles } from './testCard.styles';

export type TestCardAccent = 'gold' | 'none';

interface TestCardProps {
  title: string;
  subtitle?: string;
  /** Numeric value of a recorded result (e.g. "47"). */
  value?: string | number;
  /** Unit label rendered next to the value (e.g. "cm"). */
  unit?: string;
  accent?: TestCardAccent;
  starred?: boolean;
  /** Optional status pill text below the value (e.g. "Personal best"). */
  status?: string;
  onPress?: () => void;
}

export const TestCard = ({
  title,
  subtitle,
  value,
  unit,
  accent = 'none',
  starred,
  status,
  onPress,
}: TestCardProps) => {
  const tokens = useTheme();
  const isGold = accent === 'gold';
  const titleTone = isGold ? 'onBrand' : 'primary';
  const subTone = isGold ? 'onBrand' : 'tertiary';
  const starColor = isGold
    ? tokens.color.text.onBrand
    : tokens.color.brand.primary;

  return (
    <Pressable
      disabled={!onPress}
      onPress={onPress}
      style={({ pressed }) => [
        styles.base,
        isGold ? styles.gold : styles.default,
        pressed && onPress ? { opacity: tokens.opacity.pressed } : null,
      ]}>
      <View style={styles.head}>
        <View style={{ flex: 1 }}>
          <Text variant="headingSM" tone={titleTone} family="display">
            {title.toUpperCase()}
          </Text>
          {subtitle && (
            <Text
              variant="caption"
              tone={subTone}
              style={{ marginTop: tokens.spacing.xs }}>
              {subtitle}
            </Text>
          )}
        </View>
        {starred && (
          <Icon
            name={starred ? 'StarFilled' : 'Star'}
            size="L"
            color={starColor}
          />
        )}
      </View>
      {value !== undefined && (
        <View style={styles.stat}>
          <Text
            variant="displayMD"
            tone={isGold ? 'onBrand' : 'brand'}
            family="display">
            {value}
          </Text>
          {unit && (
            <Text
              variant="bodyMD"
              tone={isGold ? 'onBrand' : 'tertiary'}
              family="display"
              style={{ opacity: 0.7 }}>
              {unit}
            </Text>
          )}
        </View>
      )}
      {status && (
        <Text variant="overline" tone={isGold ? 'onBrand' : 'secondary'}>
          {status}
        </Text>
      )}
    </Pressable>
  );
};
