import React from 'react';
import { View, ScrollView } from 'react-native';

import { Container, TestCard, Text, TopBar } from 'components';
import { HomeTabScreenProps } from 'navigation/types';
import { TESTS_CATALOG, TestDefinition } from './tests.catalog';
import { styles } from './tests.styles';

export const Tests = ({ navigation }: HomeTabScreenProps<'Tests'>) => {
  const handlePressTest = (test: TestDefinition) => {
    if (test.id === 'JUMP') {
      navigation.navigate('JumpTest', {
        screen: 'JumpTestExplanation',
        params: { jumpType: test.jumpType },
      });
    }
  };

  return (
    <Container variant="base" noPadding>
      <TopBar title="Tests" />
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}>
        <Text variant="bodyMD" tone="secondary" style={styles.subtitle}>
          Elegí qué salto querés testear. Primero te mostramos la consigna y el
          video de ejemplo.
        </Text>
        <View style={styles.list}>
          {TESTS_CATALOG.map(test => (
            <TestCard
              key={test.jumpType}
              title={test.title}
              subtitle={test.subtitle}
              thumbnail={test.thumbnail}
              onPress={() => handlePressTest(test)}
            />
          ))}
        </View>
      </ScrollView>
    </Container>
  );
};
