import React, { useEffect, useRef, useState } from 'react';
import { View, StyleSheet, Alert, ActivityIndicator } from 'react-native';
import Share from 'react-native-share';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withDelay,
} from 'react-native-reanimated';
import { useTheme } from '@react-navigation/native';
import { Button, Text } from 'components';
import { JumpTestStackScreenProps } from 'navigation/types';
import { Sizing } from 'utils/sizing';
import { JumpRecord } from '../../jumpTest.types';
import { testsService } from 'services/tests/tests.services';

const generateId = () =>
  `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`;

export const JumpTestResult = ({
  route,
  navigation,
}: JumpTestStackScreenProps<'JumpTestResult'>) => {
  const { colors } = useTheme();
  const { videoUri, startMs, endMs, heightCm, recordId } = route.params;
  const airtimeMs = Math.max(0, endMs - startMs);
  const alreadyPersisted = !!recordId;

  const [saving, setSaving] = useState(!alreadyPersisted);
  const [record, setRecord] = useState<JumpRecord | null>(
    alreadyPersisted
      ? {
          id: recordId!,
          testId: 'JUMP',
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
    if (alreadyPersisted) return;
    if (persistedRef.current) return;
    persistedRef.current = true;

    const persist = async () => {
      try {
        const id = generateId();
        const finalUri = await testsService.persistVideo(videoUri, id);
        const newRecord: JumpRecord = {
          id,
          testId: 'JUMP',
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
  }, [videoUri, startMs, endMs, heightCm, airtimeMs, alreadyPersisted]);

  const onShare = async () => {
    const uri = record?.videoUri ?? videoUri;
    const message = `Salté ${heightCm.toFixed(1)} cm con Koru (airtime ${airtimeMs} ms)`;
    try {
      await Share.open({
        url: uri,
        type: 'video/mp4',
        message,
        failOnCancel: false,
      });
    } catch (e) {
      console.warn('Share failed:', e);
    }
  };

  const onGoHistory = () => {
    navigation.popToTop();
  };

  const heightInt = Math.floor(heightCm);
  const heightDec = Math.round((heightCm - heightInt) * 10);

  return (
    <View style={[styles.screen, { backgroundColor: colors.background }]}>
      <Animated.View style={[styles.hero, heroAnimatedStyle]}>
        <Text fontSize="M" fontWeight="bold" style={styles.heroLabel}>
          ALTURA DE SALTO
        </Text>
        <View style={styles.heroNumberWrapper}>
          <Text style={styles.heroNumber} fontWeight="bold">
            {heightInt}.{heightDec}
          </Text>
          <Text fontWeight="bold" style={styles.heroUnit}>
            cm
          </Text>
        </View>
        <Text fontSize="XL" fontWeight="bold" style={styles.heroAirtime}>
          Airtime {airtimeMs} ms
        </Text>
      </Animated.View>

      {saving && (
        <View style={styles.savingRow}>
          <ActivityIndicator color={colors.text} size="small" />
          <Text fontSize="S" fontWeight="bold" style={styles.savingText}>
            Guardando en historial…
          </Text>
        </View>
      )}

      <View style={styles.footer}>
        <Button type="PRIMARY" text="COMPARTIR" onPress={onShare} />
        <View style={{ height: Sizing.S }} />
        <Button type="TERTIARY" text="VER HISTORIAL" onPress={onGoHistory} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  hero: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: Sizing.M,
    gap: Sizing.S,
  },
  heroLabel: {
    opacity: 0.7,
    letterSpacing: 3,
    marginBottom: Sizing.XS,
  },
  heroNumberWrapper: {
    flexDirection: 'row',
    alignItems: 'flex-end',
  },
  heroNumber: {
    fontSize: 160,
    color: '#FFFFFF',
    lineHeight: 170,
  },
  heroUnit: {
    fontSize: 48,
    color: '#FFFFFF',
    marginLeft: Sizing.XS,
    marginBottom: Sizing.L,
    opacity: 0.85,
  },
  heroAirtime: {
    opacity: 0.8,
    marginTop: Sizing.S,
  },
  savingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Sizing.XS,
    paddingBottom: Sizing.S,
  },
  savingText: {
    opacity: 0.8,
    letterSpacing: 1,
  },
  footer: {
    padding: Sizing.M,
    paddingBottom: Sizing.L,
  },
});
