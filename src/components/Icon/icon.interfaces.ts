import { Sizing } from 'utils/sizing';

export enum Icons {
  Google = 'Google',
}

export interface IconProps {
  name: keyof typeof Icons;
  size: keyof typeof Sizing;
}
