// Legacy color types — preserved while screens migrate to design-system tokens.
// Old call sites (Button, Text) read `colors` from React Navigation's useTheme,
// which now mirrors our tokens (see App.tsx navTheme).
// New code should import from 'design-system' instead.

import { tokens } from '../design-system/tokens';

export interface ColorsPallete {
  primary: string;
  card: string;
  background: string;
  text: string;
  border: string;
  notification: string;
}

export interface ITheme {
  dark: boolean;
  colors: ColorsPallete;
}

export enum Colors {
  White = '#FFFFFF',
  Black = '#000000',
}

// New code: alias to tokens.color so callers can `import { Color } from 'utils/colors'`.
export const Color = tokens.color;
