import { useTheme } from '@react-navigation/native';
import { StyleSheet } from 'react-native';
import { Sizing } from 'utils/sizing';

export const useStyles = () => {
  const { colors } = useTheme();

  const styles = StyleSheet.create({
    separator: {
      borderBottomColor: colors.border,
      borderBottomWidth: 1,
      width: '100%',
      marginVertical: Sizing.M,
    },
  });
  return { styles };
};
