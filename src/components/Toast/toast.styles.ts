import { StyleSheet } from 'react-native';
import { tokens } from 'design-system';

/** Separación del host respecto del borde seguro inferior. */
export const TOAST_BOTTOM_OFFSET = tokens.spacing['2xl'];

export const styles = StyleSheet.create({
  host: {
    position: 'absolute',
    left: tokens.spacing.lg,
    right: tokens.spacing.lg,
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
