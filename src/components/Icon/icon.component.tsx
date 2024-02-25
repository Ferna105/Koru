import React from 'react';
import { IconProps } from './icon.interfaces';
import { View, ViewProps } from 'react-native';
import * as Icons from './assets/icon.assets';
import { Sizing } from 'utils/sizing';

export const Icon = ({ name, size, ...props }: ViewProps & IconProps) => {
  const IconComponent = Icons[name].default;

  return (
    <View {...props}>
      <IconComponent width={Sizing[size]} height={Sizing[size]} />
    </View>
  );
};
