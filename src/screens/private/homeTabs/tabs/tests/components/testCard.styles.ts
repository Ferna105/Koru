import { StyleSheet } from 'react-native';
import { Sizing } from 'utils/sizing';

export const styles = StyleSheet.create({
  card: {
    padding: Sizing.M,
    borderRadius: Sizing.XXS,
    minHeight: 72,
    justifyContent: 'center',
  },
  title: {
    letterSpacing: 1,
  },
  badge: {
    position: 'absolute',
    top: Sizing.XXS,
    right: Sizing.XXS,
    flexDirection: 'row',
    alignItems: 'center',
    gap: Sizing.XXXS,
  },
  star: {
    marginRight: Sizing.XXXS,
  },
});
