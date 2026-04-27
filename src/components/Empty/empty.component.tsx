import React, { ReactNode } from 'react';
import { View } from 'react-native';
import { Text } from 'components/Text/text.component';
import { styles } from './empty.styles';

interface EmptyProps {
  icon?: ReactNode;
  title: string;
  body?: string;
  action?: ReactNode;
}

export const Empty = ({ icon, title, body, action }: EmptyProps) => (
  <View style={styles.wrap}>
    {icon && <View style={styles.iconHost}>{icon}</View>}
    <Text variant="displaySM" family="display" style={styles.title}>
      {title}
    </Text>
    {body && (
      <Text variant="bodyMD" tone="secondary" style={styles.body}>
        {body}
      </Text>
    )}
    {action && <View style={styles.action}>{action}</View>}
  </View>
);
