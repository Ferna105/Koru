import React from 'react';
import { TextInput as TextInputBase, TextInputProps, View } from 'react-native';
import { useStyles } from './textInput.styles';
import { Text } from 'components/Text/text.component';

export const TextInput = ({ style, ...props }: TextInputProps) => {
  const { styles } = useStyles();

  return (
    <View style={styles.container}>
      <Text style={styles.labelContainer} fontSize="S">
        {props.placeholder}
      </Text>
      <View style={styles.textInputContainer}>
        <TextInputBase {...props} style={[style, styles.textInput]} />
      </View>
    </View>
  );
};
