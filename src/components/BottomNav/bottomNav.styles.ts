import { StyleSheet } from 'react-native';
import { tokens } from 'design-system';

export const styles = StyleSheet.create({
  base: {
    backgroundColor: tokens.color.bg.elevated,
    borderTopLeftRadius: tokens.radius.lg,
    borderTopRightRadius: tokens.radius.lg,
    overflow: 'hidden',
  },
  accent: {
    height: 2,
    backgroundColor: tokens.color.brand.danger,
  },
  items: {
    flexDirection: 'row',
    height: tokens.layout.bottomNavHeight,
  },
  item: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: tokens.spacing.xs,
  },
  label: {
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
});
