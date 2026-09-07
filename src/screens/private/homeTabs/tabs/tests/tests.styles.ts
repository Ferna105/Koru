import { StyleSheet } from 'react-native';
import { tokens } from 'design-system';

export const styles = StyleSheet.create({
  content: {
    paddingHorizontal: tokens.layout.screenPadding,
    paddingTop: tokens.spacing.lg,
    paddingBottom: tokens.spacing['3xl'],
    gap: tokens.spacing.lg,
  },
  subtitle: {
    marginBottom: tokens.spacing.xs,
  },
  list: {
    gap: tokens.spacing.md,
  },
});
