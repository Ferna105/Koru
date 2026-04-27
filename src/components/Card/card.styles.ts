import { StyleSheet } from 'react-native';
import { tokens } from 'design-system';

export const styles = StyleSheet.create({
  base: {
    borderRadius: tokens.radius.md,
    padding: tokens.spacing.lg,
    overflow: 'hidden',
  },
  default: {
    backgroundColor: tokens.color.bg.surface,
    borderWidth: 1,
    borderColor: tokens.color.border.subtle,
  },
  elevated: {
    backgroundColor: tokens.color.bg.elevated,
    ...tokens.elevation.md,
  },
  outlined: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: tokens.color.border.default,
  },
});
