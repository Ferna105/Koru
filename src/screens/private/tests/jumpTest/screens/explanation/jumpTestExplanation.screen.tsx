import React, { useState } from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
  Pressable,
  useWindowDimensions,
} from 'react-native';
import { useIsFocused } from '@react-navigation/native';
import Video from 'react-native-video';
import { Badge, Button, Card, Container, Icon, Text, TopBar } from 'components';
import { tokens, useTheme } from 'design-system';
import { JumpTestStackScreenProps } from 'navigation/types';
import { getJumpType, JUMP_UNIVERSAL_NOTE } from '../../jumpTest.catalog';

const STEPS = [
  'Apoyá el celular en el piso con la cámara apuntando a tu pie en contacto con el suelo. Mientras más cerca esté el pie más certera será el cálculo del salto. No hace falta que se vea el cuerpo completo en el video.',
  'Presioná GRABAR y hacé el salto según la consigna.',
  'En el editor, marcá el frame exacto de despegue y el de aterrizaje.',
  'Calculamos tu altura de salto automáticamente con física clásica.',
];

// Los videos explicativos son verticales (394 × 850).
const VIDEO_ASPECT_RATIO = 394 / 850;

export const JumpTestExplanation = ({
  route,
  navigation,
}: JumpTestStackScreenProps<'JumpTestExplanation'>) => {
  const t = useTheme();
  const { height } = useWindowDimensions();
  const isFocused = useIsFocused();
  const { jumpType } = route.params;
  const jump = getJumpType(jumpType);
  const [paused, setPaused] = useState(false);

  const videoHeight = Math.min(420, height * 0.42);
  const videoWidth = videoHeight * VIDEO_ASPECT_RATIO;

  const goBack = () => navigation.goBack();
  const backButton = (
    <Pressable hitSlop={t.layout.minHitSlop} onPress={goBack}>
      <Icon name="ChevronLeft" size="L" />
    </Pressable>
  );
  const historyButton = (
    <Pressable
      hitSlop={t.layout.minHitSlop}
      onPress={() => navigation.navigate('JumpTestHistory', { jumpType })}>
      <Icon name="Chart" size="L" />
    </Pressable>
  );

  return (
    <Container variant="base" noPadding>
      <TopBar
        title="Cómo funciona"
        leading={backButton}
        trailing={historyButton}
      />
      <ScrollView
        contentContainerStyle={styles.scroll}
        showsVerticalScrollIndicator={false}>
        <Text variant="displaySM" family="display">
          {jump.title}
        </Text>
        <Text variant="bodyMD" tone="secondary">
          {jump.description}
        </Text>

        <Pressable
          onPress={() => setPaused(p => !p)}
          style={[
            styles.videoFrame,
            { height: videoHeight, width: videoWidth },
          ]}>
          <Video
            source={{ uri: jump.video }}
            style={StyleSheet.absoluteFill}
            resizeMode="contain"
            repeat
            muted
            paused={paused || !isFocused}
          />
          {paused && (
            <View style={styles.playOverlay}>
              <Icon name="Play" size="XXXL" color={t.color.white} />
            </View>
          )}
        </Pressable>
        <Text variant="caption" tone="tertiary" style={styles.videoCaption}>
          {paused
            ? 'Tocá el video para reproducirlo'
            : 'Tocá el video para pausarlo'}
        </Text>

        <Card variant="outlined" style={styles.note}>
          <Text variant="overline" tone="brand">
            Importante
          </Text>
          <Text variant="bodySM" tone="secondary">
            {JUMP_UNIVERSAL_NOTE}
          </Text>
        </Card>

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

        <Card variant="outlined" style={styles.note}>
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
          onPress={() => navigation.navigate('JumpTestRecord', { jumpType })}>
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
  videoFrame: {
    alignSelf: 'center',
    borderRadius: tokens.radius.lg,
    overflow: 'hidden',
    backgroundColor: tokens.color.bg.sunken,
  },
  playOverlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: tokens.color.bg.overlay,
  },
  videoCaption: {
    textAlign: 'center',
    marginTop: -tokens.spacing.sm,
  },
  note: {
    gap: tokens.spacing.xs,
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
  footer: {
    padding: tokens.layout.screenPadding,
    paddingBottom: tokens.spacing['2xl'],
  },
});
