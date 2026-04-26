import React from 'react';
import { View, StyleSheet } from 'react-native';
import { useTheme } from '@react-navigation/native';
import { Button, Text } from 'components';
import { JumpTestStackScreenProps } from 'navigation/types';
import { Sizing } from 'utils/sizing';

export const JumpTestHistory = ({ navigation }: JumpTestStackScreenProps<'JumpTestHistory'>) => {
  const { colors } = useTheme();

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.empty}>
        <Text fontSize="XL" fontWeight="bold" style={styles.centered}>
          {'Aún no hiciste\nningún salto'}
        </Text>
        <Text fontSize="S" style={[styles.centered, styles.subtitle]}>
          Filmá tu pisada en primer plano y medí tu altura de salto
        </Text>
        <Button
          type="PRIMARY"
          text="EMPEZAR"
          onPress={() => navigation.navigate('JumpTestExplanation')}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: Sizing.M,
  },
  empty: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: Sizing.L,
  },
  centered: {
    textAlign: 'center',
  },
  subtitle: {
    opacity: 0.6,
  },
});
