import React, { useEffect, useRef, useState } from 'react';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withRepeat,
  cancelAnimation,
} from 'react-native-reanimated';
import {
  View,
  StyleSheet,
  Pressable,
  Linking,
  Platform,
  AppState,
  ActivityIndicator,
  Alert,
} from 'react-native';
import {
  Camera,
  useCameraDevice,
  useCameraFormat,
  useCameraPermission,
  useMicrophonePermission,
  CameraPosition,
  VideoFile,
} from 'react-native-vision-camera';
import { useFocusEffect } from '@react-navigation/native';
import { Button, Container, Icon, RecordButton, Text } from 'components';
import { tokens, useTheme } from 'design-system';
import { JumpTestStackScreenProps } from 'navigation/types';

type Mode = 'idle' | 'countdown' | 'recording';

export const JumpTestRecord = ({
  navigation,
}: JumpTestStackScreenProps<'JumpTestRecord'>) => {
  const t = useTheme();
  const camPerm = useCameraPermission();
  const micPerm = useMicrophonePermission();
  const hasPermission = camPerm.hasPermission && micPerm.hasPermission;
  const [permissionChecked, setPermissionChecked] = useState(false);
  const [position, setPosition] = useState<CameraPosition>('back');
  const [mode, setMode] = useState<Mode>('idle');
  const [countdownValue, setCountdownValue] = useState(3);
  const [isActive, setIsActive] = useState(true);

  const cameraRef = useRef<Camera>(null);
  const recordingStartRef = useRef<number>(0);
  const countdownTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const recOpacity = useSharedValue(1);
  const countdownScale = useSharedValue(1);
  const countdownOpacity = useSharedValue(1);

  const recAnimatedStyle = useAnimatedStyle(() => ({
    opacity: recOpacity.value,
  }));
  const countdownAnimatedStyle = useAnimatedStyle(() => ({
    opacity: countdownOpacity.value,
    transform: [{ scale: countdownScale.value }],
  }));

  const device = useCameraDevice(position);
  const format = useCameraFormat(device, [
    { fps: 60 },
    { videoResolution: { width: 1280, height: 720 } },
    { videoStabilizationMode: 'off' },
  ]);
  const supportsFps60 = format?.maxFps && format.maxFps >= 60;
  const targetFps = supportsFps60 ? 60 : 30;

  useEffect(() => {
    const askPermissions = async () => {
      if (!camPerm.hasPermission) {
        await camPerm.requestPermission();
      }
      if (!micPerm.hasPermission) {
        await micPerm.requestPermission();
      }
      setPermissionChecked(true);
    };
    askPermissions();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useFocusEffect(
    React.useCallback(() => {
      setIsActive(true);
      return () => {
        setIsActive(false);
      };
    }, []),
  );

  useEffect(() => {
    const sub = AppState.addEventListener('change', state => {
      setIsActive(state === 'active');
    });
    return () => sub.remove();
  }, []);

  useEffect(() => {
    return () => {
      if (countdownTimerRef.current) {
        clearTimeout(countdownTimerRef.current);
      }
      cancelAnimation(recOpacity);
      cancelAnimation(countdownScale);
      cancelAnimation(countdownOpacity);
    };
  }, [recOpacity, countdownScale, countdownOpacity]);

  useEffect(() => {
    if (mode !== 'recording') {
      cancelAnimation(recOpacity);
      recOpacity.value = 1;
      return;
    }
    recOpacity.value = 1;
    recOpacity.value = withRepeat(
      withTiming(0.25, { duration: 500 }),
      -1,
      true,
    );
  }, [mode, recOpacity]);

  useEffect(() => {
    if (mode !== 'countdown') {
      return;
    }
    countdownScale.value = 1.6;
    countdownOpacity.value = 0;
    countdownScale.value = withTiming(1, { duration: 350 });
    countdownOpacity.value = withTiming(1, { duration: 220 });
  }, [mode, countdownValue, countdownScale, countdownOpacity]);

  const tickCountdown = (value: number) => {
    countdownTimerRef.current = setTimeout(() => {
      const next = value - 1;
      if (next <= 0) {
        setMode('recording');
        beginRecording();
      } else {
        setCountdownValue(next);
        tickCountdown(next);
      }
    }, 1000);
  };

  const startCountdown = () => {
    if (mode !== 'idle') {
      return;
    }
    setCountdownValue(3);
    setMode('countdown');
    tickCountdown(3);
  };

  const beginRecording = async () => {
    if (!cameraRef.current) {
      return;
    }
    recordingStartRef.current = Date.now();
    try {
      cameraRef.current.startRecording({
        fileType: 'mp4',
        onRecordingFinished: (video: VideoFile) => {
          const durationMs = Math.max(
            0,
            Math.round((video.duration ?? 0) * 1000),
          );
          const uri =
            Platform.OS === 'android' && !video.path.startsWith('file://')
              ? `file://${video.path}`
              : video.path;
          setMode('idle');
          navigation.navigate('JumpTestEditor', {
            videoUri: uri,
            durationMs,
            fps: targetFps,
          });
        },
        onRecordingError: error => {
          console.warn('Recording error:', error);
          setMode('idle');
          Alert.alert(
            'No se pudo grabar',
            'Hubo un problema con la cámara durante la grabación. Probá de nuevo.',
          );
        },
      });
    } catch (e) {
      console.warn('startRecording failed:', e);
      setMode('idle');
      Alert.alert(
        'No se pudo iniciar',
        'No pudimos iniciar la grabación. Verificá que la cámara esté disponible.',
      );
    }
  };

  const stopRecording = async () => {
    if (!cameraRef.current) {
      return;
    }
    try {
      await cameraRef.current.stopRecording();
    } catch (e) {
      console.warn('stopRecording failed:', e);
      setMode('idle');
      Alert.alert(
        'No se pudo guardar',
        'Hubo un problema al cerrar la grabación.',
      );
    }
  };

  const cancelCountdown = () => {
    if (countdownTimerRef.current) {
      clearTimeout(countdownTimerRef.current);
      countdownTimerRef.current = null;
    }
    setMode('idle');
  };

  const toggleLens = () => {
    if (mode !== 'idle') {
      return;
    }
    setPosition(p => (p === 'back' ? 'front' : 'back'));
  };

  const handleClose = () => {
    if (mode === 'recording' || mode === 'countdown') {
      return;
    }
    navigation.goBack();
  };

  if (!permissionChecked) {
    return (
      <Container variant="base" style={styles.center}>
        <ActivityIndicator color={t.color.text.primary} />
      </Container>
    );
  }

  if (!hasPermission) {
    return (
      <Container variant="base" style={styles.deniedContainer}>
        <Text variant="displaySM" family="display" style={styles.centerText}>
          Necesitamos acceso a la cámara
        </Text>
        <Text variant="bodyMD" tone="secondary" style={styles.centerText}>
          Para grabar el test de salto, Koru necesita permiso de cámara y
          micrófono. Activalos desde la configuración del sistema.
        </Text>
        <View style={styles.deniedActions}>
          <Button
            variant="primary"
            iconLeft="Settings"
            onPress={() => Linking.openSettings()}>
            Abrir configuración
          </Button>
          <Button variant="ghost" onPress={() => navigation.goBack()}>
            Volver
          </Button>
        </View>
      </Container>
    );
  }

  if (!device) {
    return (
      <Container variant="base" style={styles.center}>
        <Text variant="bodyMD" style={styles.centerText}>
          No se encontró cámara disponible.
        </Text>
      </Container>
    );
  }

  const isRecording = mode === 'recording';
  const isCountdown = mode === 'countdown';
  const showIdleControls = mode === 'idle';

  return (
    <View style={[styles.fill, { backgroundColor: t.color.bg.base }]}>
      <Camera
        ref={cameraRef}
        style={StyleSheet.absoluteFill}
        device={device}
        isActive={isActive}
        video={true}
        audio={true}
        format={format}
        fps={targetFps}
      />

      <View pointerEvents="none" style={styles.frameWrapper}>
        <View style={styles.frameGuide} />
      </View>

      {showIdleControls && (
        <Text variant="label" style={styles.hintTop}>
          Apuntá la cámara a tu pie
        </Text>
      )}

      {showIdleControls && (
        <Pressable
          style={[styles.topLeft, styles.iconBtn]}
          onPress={handleClose}
          hitSlop={t.layout.minHitSlop}>
          <Icon name="X" size="L" />
        </Pressable>
      )}

      {showIdleControls && (
        <Pressable
          style={[styles.topRight, styles.iconBtn]}
          onPress={toggleLens}
          hitSlop={t.layout.minHitSlop}>
          <Icon name="Settings" size="L" />
        </Pressable>
      )}

      {isRecording && (
        <Animated.View style={[styles.recBadge, recAnimatedStyle]}>
          <View
            style={[styles.recDot, { backgroundColor: t.color.brand.danger }]}
          />
          <Text variant="label" tone="onDanger">
            REC
          </Text>
        </Animated.View>
      )}

      {isCountdown && (
        <Animated.View
          pointerEvents="none"
          style={[styles.countdownWrapper, countdownAnimatedStyle]}>
          <Text variant="displayXL" family="mono" style={styles.countdownText}>
            {String(countdownValue)}
          </Text>
        </Animated.View>
      )}

      <View style={styles.bottomBar}>
        {showIdleControls && (
          <RecordButton state="idle" onPress={startCountdown} />
        )}
        {isCountdown && (
          <RecordButton state="paused" onPress={cancelCountdown} />
        )}
        {isRecording && (
          <RecordButton state="recording" onPress={stopRecording} />
        )}
      </View>
    </View>
  );
};

const FRAME_SIZE_PCT = 0.6;

const styles = StyleSheet.create({
  fill: { flex: 1 },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  centerText: { textAlign: 'center' },
  deniedContainer: {
    flex: 1,
    justifyContent: 'center',
    gap: tokens.spacing.lg,
  },
  deniedActions: {
    marginTop: tokens.spacing.xl,
    gap: tokens.spacing.sm,
  },
  frameWrapper: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
  },
  frameGuide: {
    width: `${FRAME_SIZE_PCT * 100}%`,
    aspectRatio: 1,
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.85)',
    borderStyle: 'dashed',
    borderRadius: tokens.radius.md,
  },
  hintTop: {
    position: 'absolute',
    top: 60,
    left: 0,
    right: 0,
    textAlign: 'center',
    color: '#FFFFFF',
    textShadowColor: 'rgba(0,0,0,0.7)',
    textShadowRadius: 4,
  },
  topLeft: {
    position: 'absolute',
    top: 50,
    left: tokens.layout.screenPadding,
  },
  topRight: {
    position: 'absolute',
    top: 50,
    right: tokens.layout.screenPadding,
  },
  iconBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  recBadge: {
    position: 'absolute',
    top: 50,
    alignSelf: 'center',
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.55)',
    paddingHorizontal: tokens.spacing.sm,
    paddingVertical: tokens.spacing.xs,
    borderRadius: tokens.radius.md,
    gap: tokens.spacing.xs,
  },
  recDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  countdownWrapper: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
  },
  countdownText: {
    color: '#FFFFFF',
    fontSize: 160,
    lineHeight: 180,
    textShadowColor: 'rgba(0,0,0,0.6)',
    textShadowRadius: 12,
  },
  bottomBar: {
    position: 'absolute',
    bottom: 40,
    left: 0,
    right: 0,
    alignItems: 'center',
  },
});
