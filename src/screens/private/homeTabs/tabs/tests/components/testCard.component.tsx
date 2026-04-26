import React from 'react';
import { TouchableOpacity, TouchableOpacityProps } from 'react-native';
import { Text } from 'components';
import { useTheme } from '@react-navigation/native';
import { ITheme } from 'utils/colors';
import { TestDefinition } from '../tests.catalog';
import { styles } from './testCard.styles';

interface TestCardProps {
  test: TestDefinition;
}

export const TestCard = ({
  test,
  ...props
}: TouchableOpacityProps & TestCardProps) => {
  const { colors }: ITheme = useTheme();

  return (
    <TouchableOpacity
      {...props}
      activeOpacity={0.85}
      style={[styles.card, { backgroundColor: colors.card }]}>
      <Text
        style={styles.title}
        color="background"
        fontWeight="bold"
        fontSize="L">
        {test.title}
      </Text>
      {test.featured && (
        <Text
          style={styles.badge}
          color="background"
          fontWeight="bold"
          fontSize="XXS">
          ★ PROBALO
        </Text>
      )}
    </TouchableOpacity>
  );
};
