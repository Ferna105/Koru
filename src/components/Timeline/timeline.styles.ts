import { StyleSheet } from 'react-native';
import { tokens } from 'design-system';

export const styles = StyleSheet.create({
  base: { width: '100%' },
  track: {
    height: 56,
    backgroundColor: tokens.color.bg.elevated,
    borderRadius: tokens.radius.sm,
    overflow: 'hidden',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: tokens.spacing.xs,
    gap: tokens.spacing.xs,
    position: 'relative',
  },
  tick: {
    width: 1.5,
    height: 12,
    backgroundColor: tokens.color.text.tertiary,
    opacity: 0.5,
  },
  tickMajor: {
    height: 22,
    opacity: 1,
    backgroundColor: tokens.color.text.secondary,
  },
  marker: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    width: 2,
    backgroundColor: tokens.color.brand.primary,
  },
  markerCap: {
    position: 'absolute',
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: tokens.color.brand.primary,
    left: -5,
  },
});
