import { StyleSheet } from 'react-native';
import { tokens } from 'design-system';

export const styles = StyleSheet.create({
  underline: {
    flexDirection: 'row',
    gap: tokens.spacing['2xl'],
    paddingHorizontal: tokens.spacing.xs,
    borderBottomWidth: 1,
    borderBottomColor: tokens.color.border.subtle,
  },
  segmented: {
    flexDirection: 'row',
    padding: tokens.spacing.xs,
    backgroundColor: tokens.color.bg.elevated,
    borderRadius: 10,
    alignSelf: 'flex-start',
  },
  underlineTab: {
    paddingVertical: 14,
    flexDirection: 'row',
    alignItems: 'center',
    gap: tokens.spacing.xs,
    position: 'relative',
  },
  underlineActiveBar: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: -1,
    height: 2,
    backgroundColor: tokens.color.brand.primary,
    borderRadius: 2,
  },
  segmentedTab: {
    paddingVertical: 8,
    paddingHorizontal: tokens.spacing.lg,
    borderRadius: 7,
  },
  segmentedActive: {
    backgroundColor: tokens.color.brand.primary,
  },
});
