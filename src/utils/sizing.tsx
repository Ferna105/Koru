// Legacy sizing tokens — values aligned to the 4pt grid in design-system/tokens.
// New code should prefer importing `tokens` from 'design-system' directly.

import { tokens } from '../design-system/tokens';

export enum Sizing {
  XXXS = 4,
  XXS = 8,
  XS = 12,
  S = 14,
  M = 16,
  L = 18,
  XL = 20,
  XXL = 24,
  XXXL = 32,
}

export enum FontWeight {
  BOLD = '700',
  REGULAR = '500',
  LIGHT = '300',
}

// Alias to the 4pt grid (numeric tokens) for new code.
export const Spacing = tokens.spacing;
export const Radius = tokens.radius;
