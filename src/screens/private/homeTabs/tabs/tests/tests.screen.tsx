import React from 'react';
import { View } from 'react-native';

import { Container, TestCard, Text, TopBar } from 'components';
import { HomeTabScreenProps } from 'navigation/types';
import { TESTS_CATALOG, TestDefinition } from './tests.catalog';
import { styles } from './tests.styles';

export const Tests = ({ navigation }: HomeTabScreenProps<'Tests'>) => {
  const handlePressTest = (test: TestDefinition) => {
    if (test.id === 'JUMP') {
      navigation.navigate('JumpTest', { screen: 'JumpTestHistory' });
    }
  };

  return (
    <Container variant="base" noPadding>
      <TopBar title="Tests" />
      <View style={styles.content}>
        <Text variant="bodyMD" tone="secondary" style={styles.subtitle}>
          Elegí un test para ejecutarlo o revisar tu historial.
        </Text>
        <View style={styles.list}>
          {TESTS_CATALOG.map(test => (
            <TestCard
              key={test.id}
              title={test.title}
              subtitle="Salto vertical"
              accent={test.featured ? 'gold' : 'none'}
              starred={test.featured}
              onPress={() => handlePressTest(test)}
            />
          ))}
        </View>
      </View>
    </Container>
  );
};
