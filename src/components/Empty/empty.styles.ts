import { StyleSheet } from 'react-native';
import { tokens } from 'design-system';

export const styles = StyleSheet.create({
  wrap: {
    alignItems: 'center',
    gap: tokens.spacing.md,
    maxWidth: 320,
    alignSelf: 'center',
  },
  iconHost: {
    width: 80,
    height: 80,
    borderRadius: tokens.radius.xl,
    backgroundColor: tokens.color.brand.primaryDim,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: tokens.spacing.sm,
  },
  title: {
    textAlign: 'center',
  },
  body: {
    textAlign: 'center',
  },
  action: {
    marginTop: tokens.spacing.md,
  },
});
