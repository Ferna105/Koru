import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Linking,
  Platform,
  AppState,
  ActivityIndicator,
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
import { useTheme } from '@react-navigation/native';
import { useFocusEffect } from '@react-navigation/native';
import { Button, Text } from 'components';
import { JumpTestStackScreenProps } from 'navigation/types';
import { Sizing } from 'utils/sizing';

type Mode = 'idle' | 'countdown' | 'recording';

export const JumpTestRecord = ({
  navigation,
}: JumpTestStackScreenProps<'JumpTestRecord'>) => {
  const { colors } = useTheme();
  const camPerm = useCameraPermission();
  const micPerm = useMicrophonePermission();
  const hasPermission = camPerm.hasPermission && micPerm.hasPermission;
  const [permissionChecked, setPermissionChecked] = useState(false);
  const [position, setPosition] = useState<CameraPosition>('back');
  const [mode, setMode] = useState<Mode>('idle');
  const [countdownValue, setCountdownValue] = useState(3);
  const [recBlink, setRecBlink] = useState(true);
  const [isActive, setIsActive] = useState(true);

  const cameraRef = useRef<Camera>(null);
  const recordingStartRef = useRef<number>(0);
  const countdownTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const blinkTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);

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
      if (blinkTimerRef.current) {
        clearInterval(blinkTimerRef.current);
      }
    };
  }, []);

  useEffect(() => {
    if (mode !== 'recording') {
      if (blinkTimerRef.current) {
        clearInterval(blinkTimerRef.current);
        blinkTimerRef.current = null;
      }
      setRecBlink(true);
      return;
    }
    blinkTimerRef.current = setInterval(() => {
      setRecBlink(prev => !prev);
    }, 500);
    return () => {
      if (blinkTimerRef.current) {
        clearInterval(blinkTimerRef.current);
        blinkTimerRef.current = null;
      }
    };
  }, [mode]);

  const startCountdown = () => {
    if (mode !== 'idle') return;
    setCountdownValue(3);
    setMode('countdown');
    tickCountdown(3);
  };

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

  const beginRecording = async () => {
    if (!cameraRef.current) return;
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
        },
      });
    } catch (e) {
      console.warn('startRecording failed:', e);
      setMode('idle');
    }
  };

  const stopRecording = async () => {
    if (!cameraRef.current) return;
    try {
      await cameraRef.current.stopRecording();
    } catch (e) {
      console.warn('stopRecording failed:', e);
      setMode('idle');
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
    if (mode !== 'idle') return;
    setPosition(p => (p === 'back' ? 'front' : 'back'));
  };

  const handleClose = () => {
    if (mode === 'recording' || mode === 'countdown') return;
    navigation.goBack();
  };

  if (!permissionChecked) {
    return (
      <View
        style={[
          styles.fill,
          styles.center,
          { backgroundColor: colors.background },
        ]}>
        <ActivityIndicator color={colors.text} />
      </View>
    );
  }

  if (!hasPermission) {
    return (
      <View
        style={[styles.fill, styles.deniedContainer, { backgroundColor: colors.background }]}>
        <Text fontSize="XXL" fontWeight="bold" style={styles.centerText}>
          Necesitamos acceso a la cámara
        </Text>
        <Text fontSize="S" style={[styles.centerText, styles.deniedBody]}>
          Para grabar el test de salto Koru necesita permiso de cámara y
          micrófono. Activalos desde la configuración del sistema.
        </Text>
        <View style={styles.deniedActions}>
          <Button
            type="PRIMARY"
            text="ABRIR CONFIGURACIÓN"
            onPress={() => Linking.openSettings()}
          />
          <View style={{ height: Sizing.S }} />
          <Button
            type="TERTIARY"
            text="VOLVER"
            onPress={() => navigation.goBack()}
          />
        </View>
      </View>
    );
  }

  if (!device) {
    return (
      <View
        style={[
          styles.fill,
          styles.center,
          { backgroundColor: colors.background },
        ]}>
        <Text fontSize="M" style={styles.centerText}>
          No se encontró cámara disponible.
        </Text>
      </View>
    );
  }

  const isRecording = mode === 'recording';
  const isCountdown = mode === 'countdown';
  const showIdleControls = mode === 'idle';

  return (
    <View style={[styles.fill, { backgroundColor: colors.background }]}>
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
        <Text
          fontSize="M"
          fontWeight="bold"
          style={styles.hintTop}>
          Apuntá la cámara a tu pie
        </Text>
      )}

      {showIdleControls && (
        <TouchableOpacity
          style={[styles.topLeft, styles.iconBtn]}
          onPress={handleClose}
          hitSlop={12}>
          <Text fontSize="XXL" fontWeight="bold">
            ✕
          </Text>
        </TouchableOpacity>
      )}

      {showIdleControls && (
        <TouchableOpacity
          style={[styles.topRight, styles.iconBtn]}
          onPress={toggleLens}
          hitSlop={12}>
          <Text fontSize="XL">↺</Text>
        </TouchableOpacity>
      )}

      {isRecording && recBlink && (
        <View style={styles.recBadge}>
          <View style={[styles.recDot, { backgroundColor: colors.primary }]} />
          <Text fontSize="S" fontWeight="bold">
            REC
          </Text>
        </View>
      )}

      {isCountdown && (
        <View pointerEvents="none" style={styles.countdownWrapper}>
          <Text style={styles.countdownText} fontWeight="bold">
            {countdownValue}
          </Text>
        </View>
      )}

      <View style={styles.bottomBar}>
        {showIdleControls && (
          <TouchableOpacity
            onPress={startCountdown}
            style={[styles.recBtn, { borderColor: colors.text }]}
            activeOpacity={0.8}>
            <View style={[styles.recBtnInner, { backgroundColor: colors.primary }]} />
          </TouchableOpacity>
        )}
        {isCountdown && (
          <TouchableOpacity
            onPress={cancelCountdown}
            style={[styles.recBtn, { borderColor: colors.text }]}
            activeOpacity={0.8}>
            <View style={[styles.recBtnInner, { backgroundColor: colors.text }]} />
          </TouchableOpacity>
        )}
        {isRecording && (
          <TouchableOpacity
            onPress={stopRecording}
            style={[styles.recBtn, { borderColor: colors.text }]}
            activeOpacity={0.8}>
            <View style={[styles.stopBtnInner, { backgroundColor: colors.primary }]} />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

const FRAME_SIZE_PCT = 0.6;

const styles = StyleSheet.create({
  fill: { flex: 1 },
  center: { justifyContent: 'center', alignItems: 'center' },
  centerText: { textAlign: 'center' },
  deniedContainer: {
    paddingHorizontal: Sizing.L,
    paddingVertical: Sizing.XXL,
    justifyContent: 'center',
  },
  deniedBody: {
    marginTop: Sizing.M,
    opacity: 0.8,
    lineHeight: 22,
  },
  deniedActions: {
    marginTop: Sizing.XXL,
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
    borderRadius: Sizing.XS,
  },
  hintTop: {
    position: 'absolute',
    top: 60,
    left: 0,
    right: 0,
    textAlign: 'center',
    textShadowColor: 'rgba(0,0,0,0.7)',
    textShadowRadius: 4,
  },
  topLeft: {
    position: 'absolute',
    top: 50,
    left: Sizing.M,
  },
  topRight: {
    position: 'absolute',
    top: 50,
    right: Sizing.M,
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
    paddingHorizontal: Sizing.S,
    paddingVertical: Sizing.XXS,
    borderRadius: Sizing.M,
    gap: Sizing.XXS,
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
  recBtn: {
    width: 84,
    height: 84,
    borderRadius: 42,
    borderWidth: 4,
    justifyContent: 'center',
    alignItems: 'center',
  },
  recBtnInner: {
    width: 64,
    height: 64,
    borderRadius: 32,
  },
  stopBtnInner: {
    width: 36,
    height: 36,
    borderRadius: 6,
  },
});
