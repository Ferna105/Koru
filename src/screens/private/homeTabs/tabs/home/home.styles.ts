import { StyleSheet } from 'react-native';
import { tokens } from 'design-system';

export const styles = StyleSheet.create({
  content: {
    flex: 1,
    paddingHorizontal: tokens.layout.screenPadding,
    paddingTop: tokens.spacing.lg,
    gap: tokens.spacing.lg,
  },
  tile: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: tokens.spacing.lg,
  },
  tileText: {
    flex: 1,
    gap: tokens.spacing.xxs,
  },
});
