import { StyleSheet } from 'react-native';
import { tokens } from 'design-system';

const AVATAR_SIZE = 64;

export const styles = StyleSheet.create({
  content: {
    paddingHorizontal: tokens.layout.screenPadding,
    paddingTop: tokens.spacing.lg,
    paddingBottom: tokens.spacing['3xl'],
    gap: tokens.spacing.lg,
  },
  identity: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: tokens.spacing.lg,
  },
  avatar: {
    width: AVATAR_SIZE,
    height: AVATAR_SIZE,
    borderRadius: tokens.radius.full,
  },
  avatarFallback: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  identityText: {
    flex: 1,
    gap: tokens.spacing.xxs,
  },
  fields: {
    gap: tokens.spacing.md,
  },
  field: {
    gap: tokens.spacing.xxs,
  },
  empty: {
    flex: 1,
    paddingHorizontal: tokens.layout.screenPadding,
    justifyContent: 'center',
  },
});
