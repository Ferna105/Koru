import { StyleSheet } from 'react-native';
import { tokens } from 'design-system';

export const styles = StyleSheet.create({
  base: {
    borderRadius: tokens.radius.md,
    paddingHorizontal: tokens.spacing.xl,
    paddingVertical: 18,
    minHeight: 96,
    justifyContent: 'space-between',
    gap: tokens.spacing.sm,
  },
  default: {
    backgroundColor: tokens.color.bg.surface,
    borderWidth: 1,
    borderColor: tokens.color.border.subtle,
  },
  gold: {
    backgroundColor: tokens.color.brand.primary,
  },
  head: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    gap: tokens.spacing.md,
  },
  stat: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: tokens.spacing.xs,
  },
});
