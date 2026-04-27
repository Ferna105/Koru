import { StyleSheet } from 'react-native';
import { tokens } from 'design-system';

export const styles = StyleSheet.create({
  host: {
    position: 'absolute',
    left: tokens.spacing.lg,
    right: tokens.spacing.lg,
    bottom: tokens.spacing['2xl'],
    gap: tokens.spacing.md,
  },
  toast: {
    flexDirection: 'row',
    backgroundColor: tokens.color.bg.elevated,
    borderRadius: tokens.radius.md,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: tokens.color.border.subtle,
    ...tokens.elevation.lg,
  },
  bar: {
    width: 4,
  },
  body: {
    flex: 1,
    paddingHorizontal: tokens.spacing.lg,
    paddingVertical: 14,
  },
  text: {
    marginTop: 2,
  },
  action: {
    paddingHorizontal: tokens.spacing.md,
    justifyContent: 'center',
  },
});
