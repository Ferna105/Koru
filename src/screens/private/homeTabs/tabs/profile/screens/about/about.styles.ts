import { StyleSheet } from 'react-native';
import { tokens } from 'design-system';

export const styles = StyleSheet.create({
  content: {
    paddingHorizontal: tokens.layout.screenPadding,
    paddingTop: tokens.spacing.lg,
    paddingBottom: tokens.spacing['3xl'],
    gap: tokens.spacing.xl,
  },
  brand: {
    alignItems: 'center',
    gap: tokens.spacing.sm,
  },
  features: {
    gap: tokens.spacing.md,
  },
  feature: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: tokens.spacing.md,
  },
  featureText: {
    flex: 1,
  },
  contact: {
    gap: tokens.spacing.sm,
  },
});
