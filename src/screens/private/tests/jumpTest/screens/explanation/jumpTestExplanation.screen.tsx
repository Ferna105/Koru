import React from 'react';
import { View, ScrollView, StyleSheet } from 'react-native';
import { useTheme } from '@react-navigation/native';
import { Button, Text } from 'components';
import { JumpTestStackScreenProps } from 'navigation/types';
import { Sizing } from 'utils/sizing';

const STEPS = [
  'Apoyá el teléfono en el piso con la cámara apuntando hacia arriba, enfocada en tu pie.',
  'Presioná GRABAR, saltá verticalmente y volvé a pisar en el mismo lugar.',
  'En el editor, marcá el frame exacto de despegue y el de aterrizaje.',
  'Calculamos tu altura de salto automáticamente con física clásica.',
];

export const JumpTestExplanation = ({
  navigation,
}: JumpTestStackScreenProps<'JumpTestExplanation'>) => {
  const { colors } = useTheme();

  return (
    <View style={[styles.screen, { backgroundColor: colors.background }]}>
      <ScrollView
        contentContainerStyle={styles.scroll}
        showsVerticalScrollIndicator={false}>
        <Text fontSize="XXL" fontWeight="bold">
          ¿Cómo funciona?
        </Text>
        <Text fontSize="S" style={styles.intro}>
          Medimos cuánto tiempo tu pie estuvo en el aire y calculamos
          la altura con física clásica.
        </Text>

        <View style={styles.steps}>
          {STEPS.map((step, index) => (
            <View key={index} style={styles.step}>
              <View
                style={[styles.badge, { backgroundColor: colors.primary }]}>
                <Text fontSize="S" fontWeight="bold">
                  {index + 1}
                </Text>
              </View>
              <Text fontSize="S" style={styles.stepText}>
                {step}
              </Text>
            </View>
          ))}
        </View>

        <View style={[styles.tip, { borderColor: colors.card }]}>
          <Text fontSize="S" fontWeight="bold" color="card">
            TIP
          </Text>
          <Text fontSize="S" style={styles.tipText}>
            Si tu dispositivo soporta 60 fps, la medición será más precisa.
          </Text>
        </View>
      </ScrollView>

      <View style={[styles.footer, { backgroundColor: colors.background }]}>
        <Button
          type="PRIMARY"
          text="EMPEZAR A FILMAR"
          onPress={() => navigation.navigate('JumpTestRecord')}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  scroll: {
    padding: Sizing.M,
    gap: Sizing.L,
    paddingBottom: Sizing.XXL,
  },
  intro: {
    opacity: 0.7,
    lineHeight: 22,
  },
  steps: {
    gap: Sizing.M,
  },
  step: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: Sizing.M,
  },
  badge: {
    width: Sizing.XXL,
    height: Sizing.XXL,
    borderRadius: Sizing.M,
    justifyContent: 'center',
    alignItems: 'center',
    flexShrink: 0,
  },
  stepText: {
    flex: 1,
    lineHeight: 22,
    paddingTop: Sizing.XXXS,
  },
  tip: {
    borderWidth: 1,
    borderRadius: Sizing.XXS,
    padding: Sizing.M,
    gap: Sizing.XXS,
  },
  tipText: {
    opacity: 0.8,
    lineHeight: 20,
  },
  footer: {
    padding: Sizing.M,
    paddingBottom: Sizing.L,
  },
});
