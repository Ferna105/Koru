import React from 'react';
import { View, StyleSheet } from 'react-native';
import { useTheme } from '@react-navigation/native';
import { Text } from 'components';
import { JumpTestStackScreenProps } from 'navigation/types';

export const JumpTestRecord = ({}: JumpTestStackScreenProps<'JumpTestRecord'>) => {
  const { colors } = useTheme();
  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Text>Grabación — próximamente</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center' },
});
