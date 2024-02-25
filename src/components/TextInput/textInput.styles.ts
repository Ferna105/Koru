import { useTheme } from '@react-navigation/native';
import { StyleSheet } from 'react-native';
import { Sizing } from 'utils/sizing';

export const useStyles = () => {
  const { colors } = useTheme();

  const styles = StyleSheet.create({
    container: {
      width: '100%',
    },
    textInputContainer: {
      flexDirection: 'row',
      width: '100%',
    },
    textInput: {
      color: colors.text,
      backgroundColor: colors.card,
      padding: Sizing.S,
      flex: 1,
    },
    labelContainer: {
      marginBottom: Sizing.XXXS,
    },
  });

  return { styles };
};
