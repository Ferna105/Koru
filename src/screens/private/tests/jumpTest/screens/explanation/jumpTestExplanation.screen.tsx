import React from 'react';
import { View, ScrollView, StyleSheet, Pressable } from 'react-native';
import { Badge, Button, Card, Container, Icon, Text, TopBar } from 'components';
import { tokens, useTheme } from 'design-system';
import { JumpTestStackScreenProps } from 'navigation/types';

const STEPS = [
  'Apoyá el teléfono en el piso con la cámara apuntando hacia arriba, enfocada en tu pie.',
  'Presioná GRABAR, saltá verticalmente y volvé a pisar en el mismo lugar.',
  'En el editor, marcá el frame exacto de despegue y el de aterrizaje.',
  'Calculamos tu altura de salto automáticamente con física clásica.',
];

export const JumpTestExplanation = ({
  navigation,
}: JumpTestStackScreenProps<'JumpTestExplanation'>) => {
  const t = useTheme();

  const goBack = () => navigation.goBack();
  const backButton = (
    <Pressable hitSlop={t.layout.minHitSlop} onPress={goBack}>
      <Icon name="ChevronLeft" size="L" />
    </Pressable>
  );

  return (
    <Container variant="base" noPadding>
      <TopBar title="Cómo funciona" leading={backButton} />
      <ScrollView
        contentContainerStyle={styles.scroll}
        showsVerticalScrollIndicator={false}>
        <Text variant="displaySM" family="display">
          Salto vertical
        </Text>
        <Text variant="bodyMD" tone="secondary">
          Medimos cuánto tiempo tu pie estuvo en el aire y calculamos la altura
          con física clásica.
        </Text>

        <View style={styles.steps}>
          {STEPS.map((step, index) => (
            <View key={index} style={styles.step}>
              <Badge tone="gold" size="md">
                {String(index + 1)}
              </Badge>
              <Text variant="bodyMD" style={styles.stepText}>
                {step}
              </Text>
            </View>
          ))}
        </View>

        <Card variant="outlined" style={styles.tip}>
          <Text variant="overline" tone="brand">
            Tip
          </Text>
          <Text variant="bodySM" tone="secondary">
            Si tu dispositivo soporta 60 fps, la medición será más precisa.
          </Text>
        </Card>
      </ScrollView>

      <View style={styles.footer}>
        <Button
          variant="primary"
          iconLeft="Record"
          onPress={() => navigation.navigate('JumpTestRecord')}>
          Empezar a filmar
        </Button>
      </View>
    </Container>
  );
};

const styles = StyleSheet.create({
  scroll: {
    padding: tokens.layout.screenPadding,
    gap: tokens.spacing.lg,
    paddingBottom: tokens.spacing['3xl'],
  },
  steps: {
    gap: tokens.spacing.md,
    marginTop: tokens.spacing.sm,
  },
  step: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: tokens.spacing.md,
  },
  stepText: {
    flex: 1,
    paddingTop: tokens.spacing.xxs,
  },
  tip: {
    gap: tokens.spacing.xs,
  },
  footer: {
    padding: tokens.layout.screenPadding,
    paddingBottom: tokens.spacing['2xl'],
  },
});
