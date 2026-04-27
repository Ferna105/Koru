import { TypeVariant, FontFamily, Tokens } from 'design-system';

export type TextTone =
  | keyof Tokens['color']['text']
  | 'brand'
  | 'danger'
  | 'success';

export interface TextProps {
  /**
   * Token-driven type style. Pulls fontSize / lineHeight / letterSpacing
   * / fontWeight / family from tokens.type[variant].
   */
  variant?: TypeVariant;
  /** Text color from tokens.color.text (or 'brand' / 'danger' / 'success'). */
  tone?: TextTone;
  /**
   * Override the font family explicitly. Defaults to the family that
   * matches the chosen variant.
   */
  family?: FontFamily;
}
