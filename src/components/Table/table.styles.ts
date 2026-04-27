import { StyleSheet } from 'react-native';
import { tokens } from 'design-system';

export const styles = StyleSheet.create({
  base: {
    backgroundColor: tokens.color.bg.surface,
    borderRadius: tokens.radius.md,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: tokens.color.border.subtle,
  },
  head: {
    flexDirection: 'row',
    paddingHorizontal: tokens.spacing.lg,
    paddingVertical: tokens.spacing.md,
    backgroundColor: tokens.color.bg.elevated,
    borderBottomWidth: 1,
    borderBottomColor: tokens.color.border.subtle,
  },
  row: {
    flexDirection: 'row',
    paddingHorizontal: tokens.spacing.lg,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: tokens.color.border.subtle,
  },
  cell: {
    paddingHorizontal: tokens.spacing.sm,
  },
  zebra: {
    backgroundColor: 'rgba(255,255,255,0.015)',
  },
});
