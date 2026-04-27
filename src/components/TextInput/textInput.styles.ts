import { StyleSheet } from 'react-native';
import { tokens } from 'design-system';

export const useStyles = () => {
  const styles = StyleSheet.create({
    container: {
      width: '100%',
    },
    label: {
      marginBottom: tokens.spacing.xs,
    },
    control: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: tokens.spacing.sm,
      backgroundColor: tokens.color.bg.surface,
      borderRadius: tokens.radius.md,
      borderWidth: 1,
      borderColor: tokens.color.border.default,
      paddingHorizontal: tokens.spacing.md,
      minHeight: 48,
    },
    controlFocus: {
      borderColor: tokens.color.border.focus,
    },
    controlError: {
      borderColor: tokens.color.brand.danger,
    },
    controlDisabled: {
      opacity: tokens.opacity.disabled,
    },
    input: {
      flex: 1,
      color: tokens.color.text.primary,
      fontSize: tokens.type.bodyMD.fontSize,
      lineHeight: tokens.type.bodyMD.lineHeight,
      fontFamily: 'Manrope-Regular',
      paddingVertical: tokens.spacing.md,
    },
    inputMono: {
      fontFamily: 'JetBrainsMono-Medium',
    },
    hint: {
      marginTop: tokens.spacing.xs,
    },
  });

  return { styles };
};
