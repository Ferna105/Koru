import React from 'react';

import {
  ColorValue,
  TouchableOpacity,
  TouchableOpacityProps,
} from 'react-native';
import { Text } from 'components';
import { useTheme } from '@react-navigation/native';
import { ColorsPallete, ITheme } from 'utils/colors';
import { Sizing } from 'utils/sizing';
import { styles } from './button.styles';
import { Icon } from 'components/Icon/icon.component';
import { Icons } from 'components/Icon/icon.interfaces';

export enum ButtonTypes {
  PRIMARY = 'PRIMARY',
  SECONDARY = 'SECONDARY',
  TERTIARY = 'TERTIARY',
}

interface ButtonProps {
  text: string;
  type: keyof typeof ButtonTypes;
  icon?: keyof typeof Icons;
}

export const Button = ({
  icon,
  text,
  type,
  ...props
}: TouchableOpacityProps & ButtonProps) => {
  const { colors }: ITheme = useTheme();

  const typeColors: {
    [key in ButtonTypes]: {
      background: ColorValue;
      text: keyof ColorsPallete;
    };
  } = {
    [ButtonTypes.PRIMARY]: { background: colors.primary, text: 'background' },
    [ButtonTypes.SECONDARY]: { background: colors.card, text: 'text' },
    [ButtonTypes.TERTIARY]: { background: colors.text, text: 'background' },
  };

  return (
    <TouchableOpacity
      {...props}
      style={[
        styles.touchable,
        {
          backgroundColor: typeColors[type].background,
          padding: Sizing.M,
          borderRadius: Sizing.XXS,
        },
      ]}>
      {icon && <Icon size="XXL" name={icon} style={styles.icon} />}
      <Text style={styles.text} color={typeColors[type].text} fontWeight="bold">
        {text}
      </Text>
    </TouchableOpacity>
  );
};
