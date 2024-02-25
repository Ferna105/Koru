import React from 'react';
import { View } from 'react-native';
import { useStyles } from './separator.styles';

export const Separator = () => {
  const { styles } = useStyles();
  return <View style={styles.separator} />;
};
