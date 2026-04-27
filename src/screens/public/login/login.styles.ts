import { StyleSheet } from 'react-native';
import { tokens } from 'design-system';

export const styles = StyleSheet.create({
  container: {
    justifyContent: 'space-between',
    paddingVertical: tokens.spacing['4xl'],
  },
  brand: {
    alignItems: 'center',
    marginTop: tokens.spacing['5xl'],
    gap: tokens.spacing.sm,
  },
  tagline: {
    letterSpacing: 0.4,
  },
  form: {
    gap: tokens.spacing.lg,
  },
  heading: {
    marginBottom: tokens.spacing.xs,
  },
  field: {
    marginBottom: tokens.spacing.xs,
  },
  separator: {
    marginVertical: tokens.spacing.sm,
  },
});
