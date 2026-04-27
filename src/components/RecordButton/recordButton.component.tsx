import React, { useEffect, useRef } from 'react';
import { Animated, Easing, Pressable, View } from 'react-native';
import { useTheme } from 'design-system';
import {
  RING_INSET_IDLE,
  RING_INSET_RECORDING,
  SIZE,
  styles,
} from './recordButton.styles';

export type RecordButtonState = 'idle' | 'recording' | 'paused';

interface RecordButtonProps {
  state?: RecordButtonState;
  disabled?: boolean;
  onPress?: () => void;
  /** Optional accessibility label. */
  accessibilityLabel?: string;
}

export const RecordButton = ({
  state = 'idle',
  disabled,
  onPress,
  accessibilityLabel = 'Record',
}: RecordButtonProps) => {
  const tokens = useTheme();
  const pulse = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    if (state !== 'recording') {
      pulse.setValue(1);
      return;
    }
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(pulse, {
          toValue: 1.08,
          duration: 800,
          easing: Easing.bezier(0.2, 0, 0, 1),
          useNativeDriver: true,
        }),
        Animated.timing(pulse, {
          toValue: 1,
          duration: 800,
          easing: Easing.bezier(0.2, 0, 0, 1),
          useNativeDriver: true,
        }),
      ]),
    );
    loop.start();
    return () => loop.stop();
  }, [state, pulse]);

  const inset = state === 'recording' ? RING_INSET_RECORDING : RING_INSET_IDLE;
  const coreSize = SIZE - inset * 2;

  let coreColor: string = tokens.color.brand.danger;
  let coreRadius: number = coreSize / 2;
  if (state === 'recording') {
    coreRadius = 6;
  } else if (state === 'paused') {
    coreColor = tokens.color.text.primary;
  }

  return (
    <Pressable
      disabled={disabled}
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel}
      style={[
        styles.wrap,
        disabled ? { opacity: tokens.opacity.disabled } : null,
      ]}>
      <View style={styles.ring} />
      <Animated.View
        style={[
          styles.core,
          {
            top: inset,
            left: inset,
            right: inset,
            bottom: inset,
            backgroundColor: coreColor,
            borderRadius: coreRadius,
            transform: [{ scale: pulse }],
          },
        ]}
      />
    </Pressable>
  );
};
