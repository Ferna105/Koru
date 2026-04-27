import { StyleSheet } from 'react-native';
import { tokens } from 'design-system';

export const styles = StyleSheet.create({
  base: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: tokens.spacing.md + 2,
    paddingHorizontal: tokens.spacing.lg,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: tokens.color.border.subtle,
  },
  text: {
    flex: 1,
    minWidth: 0,
  },
  sub: {
    marginTop: 2,
  },
});
