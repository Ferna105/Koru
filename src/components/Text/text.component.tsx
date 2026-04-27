import React from 'react';
import {
  Text as TextBase,
  TextProps as TextDefaultProps,
  TextStyle,
} from 'react-native';
import { useTheme } from 'design-system';
import { TextProps, TextTone } from './text.interfaces';

const FAMILY_FOR_WEIGHT = (weight: TextStyle['fontWeight']): string => {
  switch (weight) {
    case '700':
    case 'bold':
      return 'Manrope-Bold';
    case '600':
      return 'Manrope-SemiBold';
    case '500':
      return 'Manrope-Medium';
    default:
      return 'Manrope-Regular';
  }
};

const FAMILY_FOR_DISPLAY = (weight: TextStyle['fontWeight']): string => {
  switch (weight) {
    case '700':
    case 'bold':
      return 'Archivo-Bold';
    case '800':
      return 'Archivo-ExtraBold';
    case '900':
    default:
      return 'Archivo-Black';
  }
};

const resolveFamily = (
  family: 'display' | 'body' | 'mono',
  weight: TextStyle['fontWeight'],
): string => {
  if (family === 'mono') {
    return 'JetBrainsMono-Medium';
  }
  if (family === 'display') {
    return FAMILY_FOR_DISPLAY(weight);
  }
  return FAMILY_FOR_WEIGHT(weight);
};

const resolveTone = (
  tone: TextTone,
  tokens: ReturnType<typeof useTheme>,
): string => {
  switch (tone) {
    case 'brand':
      return tokens.color.brand.primary;
    case 'danger':
      return tokens.color.brand.danger;
    case 'success':
      return tokens.color.semantic.success;
    default:
      return tokens.color.text[tone];
  }
};

export const Text = ({
  style,
  variant = 'bodyMD',
  tone = 'primary',
  family,
  ...props
}: TextDefaultProps & TextProps) => {
  const tokens = useTheme();
  const v = tokens.type[variant];
  const fam = family ?? (v.family as 'display' | 'body' | 'mono');
  return (
    <TextBase
      {...props}
      style={[
        {
          fontSize: v.fontSize,
          lineHeight: v.lineHeight,
          letterSpacing: v.letterSpacing,
          fontWeight: v.fontWeight as TextStyle['fontWeight'],
          fontFamily: resolveFamily(
            fam,
            v.fontWeight as TextStyle['fontWeight'],
          ),
          color: resolveTone(tone, tokens),
          textTransform:
            'textTransform' in v
              ? (v.textTransform as TextStyle['textTransform'])
              : undefined,
        },
        style,
      ]}
    />
  );
};
