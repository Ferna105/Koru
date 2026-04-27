import React from 'react';
import { Pressable, View } from 'react-native';
import { Text } from 'components/Text/text.component';
import { styles } from './tabs.styles';

export type TabsVariant = 'underline' | 'segmented';

export interface TabItem {
  id: string;
  label: string;
  count?: number;
}

interface TabsProps {
  tabs: TabItem[];
  activeId: string;
  onChange: (id: string) => void;
  variant?: TabsVariant;
}

export const Tabs = ({
  tabs,
  activeId,
  onChange,
  variant = 'underline',
}: TabsProps) => {
  if (variant === 'segmented') {
    return (
      <View style={styles.segmented}>
        {tabs.map(t => {
          const active = t.id === activeId;
          return (
            <Pressable
              key={t.id}
              onPress={() => onChange(t.id)}
              style={[styles.segmentedTab, active && styles.segmentedActive]}>
              <Text
                variant="bodySM"
                tone={active ? 'onBrand' : 'secondary'}
                style={{ fontWeight: '600' }}>
                {t.label}
              </Text>
            </Pressable>
          );
        })}
      </View>
    );
  }

  return (
    <View style={styles.underline}>
      {tabs.map(t => {
        const active = t.id === activeId;
        return (
          <Pressable
            key={t.id}
            onPress={() => onChange(t.id)}
            style={styles.underlineTab}>
            <Text
              variant="bodyMD"
              tone={active ? 'primary' : 'tertiary'}
              style={{ fontWeight: '600' }}>
              {t.label}
            </Text>
            {t.count !== undefined && (
              <Text
                variant="caption"
                tone={active ? 'brand' : 'tertiary'}
                family="mono">
                {t.count}
              </Text>
            )}
            {active && <View style={styles.underlineActiveBar} />}
          </Pressable>
        );
      })}
    </View>
  );
};
