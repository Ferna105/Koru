import React from 'react';
import { View } from 'react-native';

import { Container, Text } from 'components';
import { HomeTabScreenProps } from 'navigation/types';
import { TESTS_CATALOG, TestDefinition } from './tests.catalog';
import { TestCard } from './components/testCard.component';
import { styles } from './tests.styles';

export const Tests = ({ navigation }: HomeTabScreenProps<'Tests'>) => {
  const handlePressTest = (test: TestDefinition) => {
    if (test.id === 'JUMP') {
      navigation.navigate('JumpTest', { screen: 'JumpTestHistory' });
    }
  };

  return (
    <Container style={styles.container}>
      <Text style={styles.title} fontSize="XXXL" fontWeight="bold" color="card">
        Mis tests
      </Text>
      <Text style={styles.subtitle} fontSize="S">
        A continuación podrás ver todos los tests que hiciste y agregar nuevos
      </Text>
      <View style={styles.list}>
        {TESTS_CATALOG.map(test => (
          <TestCard
            key={test.id}
            test={test}
            onPress={() => handlePressTest(test)}
          />
        ))}
      </View>
    </Container>
  );
};
