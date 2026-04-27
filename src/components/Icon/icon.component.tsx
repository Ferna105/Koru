import React from 'react';
import { View, ViewProps } from 'react-native';
import * as Icons from './assets/icon.assets';
import { Sizing } from 'utils/sizing';
import { useTheme } from 'design-system';
import { IconProps } from './icon.interfaces';

export const Icon = ({
  name,
  size = 'XXL',
  color,
  strokeWidth,
  ...props
}: ViewProps & IconProps) => {
  const tokens = useTheme();
  const IconComponent = Icons[name].default;
  const dimension = Sizing[size];
  const stroke = (color ?? tokens.color.text.primary) as string;

  return (
    <View {...props}>
      <IconComponent
        width={dimension}
        height={dimension}
        stroke={stroke}
        strokeWidth={strokeWidth}
      />
    </View>
  );
};
