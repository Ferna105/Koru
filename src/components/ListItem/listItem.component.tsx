import React, { ReactNode } from 'react';
import { Pressable, View } from 'react-native';
import { useTheme } from 'design-system';
import { Text } from 'components/Text/text.component';
import { styles } from './listItem.styles';

interface ListItemProps {
  title: string;
  subtitle?: string;
  leading?: ReactNode;
  trailing?: ReactNode;
  onPress?: () => void;
}

export const ListItem = ({
  title,
  subtitle,
  leading,
  trailing,
  onPress,
}: ListItemProps) => {
  const tokens = useTheme();

  const body = (
    <>
      {leading}
      <View style={styles.text}>
        <Text variant="bodyMD" style={{ fontWeight: '600' }}>
          {title}
        </Text>
        {subtitle && (
          <Text variant="caption" tone="tertiary" style={styles.sub}>
            {subtitle}
          </Text>
        )}
      </View>
      {trailing}
    </>
  );

  if (onPress) {
    return (
      <Pressable
        onPress={onPress}
        style={({ pressed }) => [
          styles.base,
          pressed ? { opacity: tokens.opacity.pressed } : null,
        ]}>
        {body}
      </Pressable>
    );
  }

  return <View style={styles.base}>{body}</View>;
};
