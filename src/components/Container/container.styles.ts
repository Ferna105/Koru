import { StyleSheet } from 'react-native';
import { tokens } from 'design-system';

export const styles = StyleSheet.create({
  safeArea: { flex: 1 },
  container: {
    padding: tokens.layout.screenPadding,
    flex: 1,
  },
});
