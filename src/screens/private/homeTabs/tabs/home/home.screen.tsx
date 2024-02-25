import React from 'react';
import { Container, Text } from 'components';
import { styles } from './home.styles';
import { HomeTabScreenProps } from 'navigation/types';
export const Home = ({}: HomeTabScreenProps<'Home'>) => {
  return (
    <Container style={styles.container}>
      <Text>HOLA</Text>
    </Container>
  );
};
