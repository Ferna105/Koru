import React from 'react';
import { useTheme } from '@react-navigation/native';
import { Text as TextBase, TextProps as TextDefaultProps } from 'react-native';
import { Sizing } from 'utils/sizing';
import { ITheme } from 'utils/colors';
import { TextProps } from './text.interfaces';

export const Text = ({
  style,
  fontSize = 'M',
  fontWeight = 'normal',
  color = 'text',
  ...props
}: TextDefaultProps & TextProps) => {
  const { colors }: ITheme = useTheme();

  return (
    <TextBase
      {...props}
      style={[
        style,
        {
          color: colors[color],
          fontSize: Sizing[fontSize],
          fontWeight: fontWeight,
        },
      ]}
    />
  );
};
