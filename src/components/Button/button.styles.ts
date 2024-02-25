import { StyleSheet } from 'react-native';
import { Sizing } from 'utils/sizing';

export const styles = StyleSheet.create({
  touchable: {
    width: '100%',
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
  },
  icon: {
    marginRight: Sizing.S,
  },
  text: { fontWeight: 'bold' },
});
