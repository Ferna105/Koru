import { StyleSheet } from 'react-native';
import { tokens } from 'design-system';

export const styles = StyleSheet.create({
  scrim: {
    flex: 1,
    backgroundColor: tokens.color.bg.overlay,
    alignItems: 'center',
    justifyContent: 'center',
    padding: tokens.spacing['2xl'],
  },
  modal: {
    backgroundColor: tokens.color.bg.elevated,
    borderRadius: tokens.radius.lg,
    padding: tokens.spacing['2xl'],
    width: '100%',
    maxWidth: 360,
    ...tokens.elevation.lg,
  },
  title: {
    marginBottom: tokens.spacing.md,
  },
  body: {
    marginBottom: tokens.spacing['2xl'],
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: tokens.spacing.sm,
  },
  // Bottom sheet variant
  sheetScrim: {
    flex: 1,
    backgroundColor: tokens.color.bg.overlay,
    justifyContent: 'flex-end',
  },
  sheet: {
    backgroundColor: tokens.color.bg.elevated,
    borderTopLeftRadius: tokens.radius.xl,
    borderTopRightRadius: tokens.radius.xl,
    paddingHorizontal: tokens.spacing['2xl'],
    paddingTop: tokens.spacing.md,
    paddingBottom: tokens.spacing['2xl'],
    ...tokens.elevation.lg,
  },
  handle: {
    alignSelf: 'center',
    width: 40,
    height: 4,
    backgroundColor: tokens.color.border.strong,
    borderRadius: 2,
    marginBottom: tokens.spacing.lg,
  },
  sheetTitle: {
    marginBottom: tokens.spacing.lg,
  },
});
