import { StyleSheet } from 'react-native';
import { tokens } from 'design-system';

export const styles = StyleSheet.create({
  base: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: tokens.spacing.xs,
    borderRadius: tokens.radius.xs + 2,
    alignSelf: 'flex-start',
  },
  sm: { paddingHorizontal: 7, paddingVertical: 3 },
  md: { paddingHorizontal: 10, paddingVertical: 4 },
  lg: { paddingHorizontal: 12, paddingVertical: 6 },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
});

export const SIZE_TO_FONT = {
  sm: 9,
  md: 11,
  lg: 13,
} as const;
