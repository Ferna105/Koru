import React from 'react';
import { Pressable, Text as RNText, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from 'design-system';
import { Icon } from 'components/Icon/icon.component';
import { Icons } from 'components/Icon/icon.interfaces';
import { styles } from './bottomNav.styles';

export interface BottomNavItem {
  id: string;
  label: string;
  icon: keyof typeof Icons;
}

interface BottomNavProps {
  items: BottomNavItem[];
  activeId: string;
  onSelect: (id: string) => void;
  /** Render the red accent bar above the items. Defaults to on. */
  showAccent?: boolean;
}

export const BottomNav = ({
  items,
  activeId,
  onSelect,
  showAccent = true,
}: BottomNavProps) => {
  const tokens = useTheme();
  // Android dibuja edge-to-edge desde targetSdk 35, así que la barra de botones
  // (o el gesture pill) se superpone al nav si no reservamos su alto acá.
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.base, { paddingBottom: insets.bottom }]}>
      {showAccent && <View style={styles.accent} />}
      <View style={styles.items}>
        {items.map(item => {
          const active = activeId === item.id;
          const tint = active
            ? tokens.color.brand.primary
            : tokens.color.text.tertiary;
          return (
            <Pressable
              key={item.id}
              onPress={() => onSelect(item.id)}
              style={styles.item}>
              <Icon name={item.icon} size="L" color={tint} />
              <RNText
                style={[
                  styles.label,
                  { color: tint, fontFamily: 'Manrope-Bold' },
                ]}>
                {item.label}
              </RNText>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
};
