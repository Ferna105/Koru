import React, { useState } from 'react';
import {
  TextInput as TextInputBase,
  TextInputProps as RNTextInputProps,
  View,
} from 'react-native';
import { useTheme } from 'design-system';
import { Text } from 'components/Text/text.component';
import { Icon } from 'components/Icon/icon.component';
import { Icons } from 'components/Icon/icon.interfaces';
import { useStyles } from './textInput.styles';

export type TextInputState =
  | 'default'
  | 'focus'
  | 'disabled'
  | 'readonly'
  | 'error';

interface TextInputExtraProps {
  /** Field label rendered above the control. Falls back to placeholder. */
  label?: string;
  /** Helper text shown below the control. */
  hint?: string;
  /** Error message — overrides `hint` and applies the error visual. */
  error?: string;
  /** Visual state. `disabled` also disables input. */
  state?: TextInputState;
  /** Render an icon before the input. */
  iconLeft?: keyof typeof Icons;
  /** Render an icon after the input. */
  iconRight?: keyof typeof Icons;
  /** Use the mono font (for codes, time, etc.). */
  mono?: boolean;
}

export const TextInput = ({
  label,
  hint,
  error,
  state = 'default',
  iconLeft,
  iconRight,
  mono = false,
  style,
  onFocus,
  onBlur,
  ...props
}: RNTextInputProps & TextInputExtraProps) => {
  const tokens = useTheme();
  const { styles } = useStyles();
  const [focused, setFocused] = useState(false);

  const isError = state === 'error' || !!error;
  const isDisabled = state === 'disabled';
  const isReadonly = state === 'readonly';
  const showFocusRing = focused && !isError && !isDisabled;

  const labelText = label ?? props.placeholder;

  return (
    <View style={styles.container}>
      {labelText && (
        <Text variant="label" tone="secondary" style={styles.label}>
          {labelText}
        </Text>
      )}
      <View
        style={[
          styles.control,
          showFocusRing && styles.controlFocus,
          isError && styles.controlError,
          isDisabled && styles.controlDisabled,
        ]}>
        {iconLeft && (
          <Icon name={iconLeft} size="L" color={tokens.color.text.tertiary} />
        )}
        <TextInputBase
          {...props}
          editable={!isDisabled && !isReadonly}
          onFocus={e => {
            setFocused(true);
            onFocus?.(e);
          }}
          onBlur={e => {
            setFocused(false);
            onBlur?.(e);
          }}
          placeholderTextColor={tokens.color.text.tertiary}
          style={[styles.input, mono && styles.inputMono, style]}
        />
        {iconRight && (
          <Icon name={iconRight} size="L" color={tokens.color.text.tertiary} />
        )}
      </View>
      {(error || hint) && (
        <Text
          variant="caption"
          tone={isError ? 'danger' : 'secondary'}
          style={styles.hint}>
          {error ?? hint}
        </Text>
      )}
    </View>
  );
};
