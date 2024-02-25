import { ColorsPallete } from 'utils/colors';
import { Sizing } from 'utils/sizing';

export interface TextProps {
  fontSize?: keyof typeof Sizing;
  color?: keyof ColorsPallete;
  fontWeight?: 'bold' | 'normal';
}
