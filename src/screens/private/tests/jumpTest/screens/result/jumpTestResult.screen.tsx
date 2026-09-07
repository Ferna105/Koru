import React, { useEffect, useRef, useState } from 'react';
import { View, StyleSheet, Alert, ActivityIndicator } from 'react-native';
import Share from 'react-native-share';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withDelay,
} from 'react-native-reanimated';
import { Button, Container, Text } from 'components';
import { tokens, useTheme } from 'design-system';
import { JumpTestStackScreenProps } from 'navigation/types';
import { getJumpType } from '../../jumpTest.catalog';
import { formatAirtimeMs } from '../../jumpTest.physics';
import { JumpRecord } from '../../jumpTest.types';
import { testsService } from 'services/tests/tests.services';

const generateId = () =>
  `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`;

/**
 * Margen que se agrega antes del despegue y después del aterrizaje al recortar
 * el clip para compartir: da contexto del envión y de la caída, y en Android
 * absorbe el desfase del corte por keyframe.
 */
const SHARE_PADDING_MS = 400;

export const JumpTestResult = ({
  route,
  navigation,
}: JumpTestStackScreenProps<'JumpTestResult'>) => {
  const t = useTheme();
  const { jumpType, videoUri, startMs, endMs, heightCm, recordId } =
    route.params;
  const jump = getJumpType(jumpType);
  const airtimeMs = Math.max(0, endMs - startMs);
  const alreadyPersisted = !!recordId;

  const [saving, setSaving] = useState(!alreadyPersisted);
  const [record, setRecord] = useState<JumpRecord | null>(
    alreadyPersisted
      ? {
          id: recordId!,
          testId: 'JUMP',
          jumpType,
          createdAt: new Date(0).toISOString(),
          videoUri,
          startMs,
          endMs,
          airtimeMs,
          heightCm,
        }
      : null,
  );
  const persistedRef = useRef(false);
  // Clip recortado ya generado: evita re-recortar si se comparte dos veces.
  const trimmedUriRef = useRef<string | null>(null);
  const [sharing, setSharing] = useState(false);

  const heroOpacity = useSharedValue(0);
  const heroScale = useSharedValue(0.92);
  const heroAnimatedStyle = useAnimatedStyle(() => ({
    opacity: heroOpacity.value,
    transform: [{ scale: heroScale.value }],
  }));

  useEffect(() => {
    heroOpacity.value = withTiming(1, { duration: 420 });
    heroScale.value = withDelay(60, withTiming(1, { duration: 380 }));
  }, [heroOpacity, heroScale]);

  useEffect(() => {
    if (alreadyPersisted) {
      return;
    }
    if (persistedRef.current) {
      return;
    }
    persistedRef.current = true;

    const persist = async () => {
      try {
        const id = generateId();
        const finalUri = await testsService.persistVideo(videoUri, id);
        const newRecord: JumpRecord = {
          id,
          testId: 'JUMP',
          jumpType,
          createdAt: new Date().toISOString(),
          videoUri: finalUri,
          startMs,
          endMs,
          airtimeMs,
          heightCm,
        };
        await testsService.saveJumpRecord(newRecord);
        setRecord(newRecord);
      } catch (e) {
        console.warn('Failed to persist jump record:', e);
        Alert.alert(
          'No se pudo guardar',
          'Tuvimos un problema guardando el test. Igual podés compartirlo.',
        );
      } finally {
        setSaving(false);
      }
    };
    persist();
  }, [
    videoUri,
    startMs,
    endMs,
    heightCm,
    airtimeMs,
    alreadyPersisted,
    jumpType,
  ]);

  const onShare = async () => {
    const sourceUri = record?.videoUri ?? videoUri;
    const message = `${jump.title}: salté ${heightCm.toFixed(
      1,
    )} cm con Koru (airtime ${formatAirtimeMs(airtimeMs)} ms)`;

    setSharing(true);
    try {
      // Se comparte sólo el tramo del salto, no la grabación entera.
      let uri = trimmedUriRef.current;
      if (!uri) {
        try {
          uri = await testsService.trimVideo(
            sourceUri,
            Math.max(0, startMs - SHARE_PADDING_MS),
            endMs + SHARE_PADDING_MS,
          );
          trimmedUriRef.current = uri;
        } catch (e) {
          // Si el recorte falla (build viejo sin el módulo nativo, códec raro)
          // compartimos el video completo en vez de dejar al usuario sin nada.
          console.warn('Trim failed, sharing full video:', e);
          uri = sourceUri;
        }
      }

      await Share.open({
        url: uri,
        type: 'video/mp4',
        message,
        failOnCancel: false,
      });
    } catch (e) {
      console.warn('Share failed:', e);
    } finally {
      setSharing(false);
    }
  };

  const onGoHistory = () => {
    // Reemplazamos el stack para que el historial quede como única pantalla:
    // volver desde ahí sale del flujo del test en vez de recorrerlo al revés.
    navigation.reset({
      index: 0,
      routes: [{ name: 'JumpTestHistory', params: { jumpType } }],
    });
  };

  const heightInt = Math.floor(heightCm);
  const heightDec = Math.round((heightCm - heightInt) * 10);

  return (
    <Container variant="base">
      <Animated.View style={[styles.hero, heroAnimatedStyle]}>
        <Text variant="overline" tone="brand">
          {jump.title}
        </Text>
        <View style={styles.heroNumberWrapper}>
          <Text
            variant="displayXL"
            family="display"
            style={styles.heroNumber}
            adjustsFontSizeToFit
            numberOfLines={1}>
            {heightInt}.{heightDec}
          </Text>
          <Text
            variant="displaySM"
            tone="secondary"
            family="display"
            style={styles.heroUnit}>
            cm
          </Text>
        </View>
        <Text variant="monoLG" tone="secondary">
          Airtime {formatAirtimeMs(airtimeMs)} ms
        </Text>
      </Animated.View>

      {saving && (
        <View style={styles.savingRow}>
          <ActivityIndicator color={t.color.text.primary} size="small" />
          <Text variant="caption" tone="secondary">
            Guardando en historial…
          </Text>
        </View>
      )}

      <View style={styles.footer}>
        <Button
          variant="primary"
          iconLeft="Share"
          loading={sharing}
          disabled={sharing}
          onPress={onShare}>
          Compartir
        </Button>
        <Button variant="ghost" onPress={onGoHistory}>
          Ver historial
        </Button>
      </View>
    </Container>
  );
};

const styles = StyleSheet.create({
  hero: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: tokens.layout.screenPadding,
    gap: tokens.spacing.sm,
  },
  heroNumberWrapper: {
    flexDirection: 'row',
    alignItems: 'flex-end',
  },
  heroNumber: {
    fontSize: 144,
    flex: 1,
    lineHeight: 156,
  },
  heroUnit: {
    marginLeft: tokens.spacing.sm,
    marginBottom: tokens.spacing.lg,
  },
  savingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: tokens.spacing.xs,
    paddingBottom: tokens.spacing.sm,
  },
  footer: {
    paddingBottom: tokens.spacing.xs,
    gap: tokens.spacing.sm,
  },
});
