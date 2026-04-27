import { StyleSheet } from 'react-native';
import { tokens } from 'design-system';

export const styles = StyleSheet.create({
  content: {
    flex: 1,
    paddingHorizontal: tokens.layout.screenPadding,
    paddingTop: tokens.spacing.lg,
    gap: tokens.spacing.lg,
  },
  subtitle: {
    marginBottom: tokens.spacing.xs,
  },
  list: {
    gap: tokens.spacing.md,
  },
});
