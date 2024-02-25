import { FunctionComponent } from 'react';
import { SvgProps } from 'react-native-svg';

interface SvgIcon {
  default: FunctionComponent<SvgProps>;
}

export const Google = require('./google.svg') as SvgIcon;
