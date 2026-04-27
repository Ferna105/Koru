import { StyleSheet } from 'react-native';
import { tokens } from 'design-system';

export const SIZE = 84;
export const RING_INSET_IDLE = 10;
export const RING_INSET_RECORDING = 24;

export const styles = StyleSheet.create({
  wrap: {
    width: SIZE,
    height: SIZE,
  },
  ring: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    borderWidth: 3,
    borderColor: tokens.color.text.primary,
    borderRadius: SIZE / 2,
  },
  core: {
    position: 'absolute',
    backgroundColor: tokens.color.brand.danger,
  },
});
