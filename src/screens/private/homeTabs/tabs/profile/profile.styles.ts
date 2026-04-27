import { StyleSheet } from 'react-native';
import { tokens } from 'design-system';

export const styles = StyleSheet.create({
  content: {
    flex: 1,
    paddingHorizontal: tokens.layout.screenPadding,
    paddingTop: tokens.spacing.lg,
    paddingBottom: tokens.spacing.lg,
    justifyContent: 'space-between',
  },
  list: {
    gap: tokens.spacing.xs,
  },
});
