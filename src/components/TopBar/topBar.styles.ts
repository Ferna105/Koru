import { StyleSheet } from 'react-native';
import { tokens } from 'design-system';

export const styles = StyleSheet.create({
  base: {
    height: tokens.layout.topBarHeight,
    paddingHorizontal: tokens.spacing.lg,
    flexDirection: 'row',
    alignItems: 'center',
  },
  gold: {
    backgroundColor: tokens.color.brand.primary,
  },
  dark: {
    backgroundColor: tokens.color.bg.elevated,
    borderBottomWidth: 1,
    borderBottomColor: tokens.color.border.subtle,
  },
  ghost: {
    backgroundColor: 'transparent',
  },
  side: {
    width: 40,
    flexDirection: 'row',
    alignItems: 'center',
  },
  trailing: {
    justifyContent: 'flex-end',
  },
  titleWrap: {
    flex: 1,
    alignItems: 'center',
  },
});
