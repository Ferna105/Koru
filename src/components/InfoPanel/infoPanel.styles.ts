import { StyleSheet } from 'react-native';
import { tokens } from 'design-system';

export const styles = StyleSheet.create({
  card: {
    gap: tokens.spacing.md,
  },
  title: {
    gap: tokens.spacing.xxs,
  },
  body: {
    gap: tokens.spacing.sm,
  },
  closing: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: tokens.spacing.md,
  },
  // Filete de marca que separa el cierre del cuerpo sin sumar otro borde.
  accent: {
    width: 3,
    alignSelf: 'stretch',
    borderRadius: tokens.radius.sm,
    backgroundColor: tokens.color.brand.primary,
  },
});
