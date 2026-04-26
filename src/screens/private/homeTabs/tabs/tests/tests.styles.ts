import { StyleSheet } from 'react-native';
import { Sizing } from 'utils/sizing';

export const styles = StyleSheet.create({
  container: {
    paddingHorizontal: Sizing.M,
    paddingTop: Sizing.M,
  },
  title: {
    marginBottom: Sizing.XXS,
  },
  subtitle: {
    marginBottom: Sizing.XXL,
  },
  list: {
    gap: Sizing.M,
  },
});
