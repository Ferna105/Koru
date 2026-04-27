import React from 'react';
import { View } from 'react-native';
import { Card, Container, Icon, Text, TopBar } from 'components';
import { styles } from './home.styles';
import { HomeTabScreenProps } from 'navigation/types';

export const Home = ({ navigation }: HomeTabScreenProps<'Home'>) => {
  return (
    <Container variant="base" noPadding>
      <TopBar title="Inicio" />
      <View style={styles.content}>
        <Text variant="overline" tone="tertiary">
          Acceso rápido
        </Text>

        <Card
          variant="elevated"
          onPress={() =>
            navigation.navigate('JumpTest', { screen: 'JumpTestExplanation' })
          }>
          <View style={styles.tile}>
            <Icon name="Dumbbell" size="XL" />
            <View style={styles.tileText}>
              <Text variant="headingMD">Test de salto</Text>
              <Text variant="bodySM" tone="secondary">
                Mide tu salto vertical con cámara lenta.
              </Text>
            </View>
            <Icon name="ChevronRight" size="L" />
          </View>
        </Card>

        <Card
          variant="default"
          onPress={() =>
            navigation.navigate('JumpTest', { screen: 'JumpTestHistory' })
          }>
          <View style={styles.tile}>
            <Icon name="Chart" size="XL" />
            <View style={styles.tileText}>
              <Text variant="headingMD">Historial</Text>
              <Text variant="bodySM" tone="secondary">
                Mirá tu progreso y comparativa.
              </Text>
            </View>
            <Icon name="ChevronRight" size="L" />
          </View>
        </Card>
      </View>
    </Container>
  );
};
