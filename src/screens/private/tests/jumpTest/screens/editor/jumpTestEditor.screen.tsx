import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  View,
  StyleSheet,
  Pressable,
  LayoutChangeEvent,
  GestureResponderEvent,
  Alert,
} from 'react-native';
import Video, {
  VideoRef,
  OnLoadData,
  OnProgressData,
} from 'react-native-video';
import { Button, Icon, Text } from 'components';
import { tokens, useTheme } from 'design-system';
import { JumpTestStackScreenProps } from 'navigation/types';
import { airtimeToHeightCm, formatMs } from '../../jumpTest.physics';
import { testsService } from 'services/tests/tests.services';

type Handle = 'start' | 'end';

const HANDLE_HIT = 28;
const TIMELINE_HEIGHT = 56;
const MIN_AIRTIME_MS = 50;

export const JumpTestEditor = ({
  route,
  navigation,
}: JumpTestStackScreenProps<'JumpTestEditor'>) => {
  const t = useTheme();
  const { videoUri, durationMs: durationFromParams, fps = 30 } = route.params;

  const videoRef = useRef<VideoRef>(null);
  const [durationMs, setDurationMs] = useState(durationFromParams || 0);
  const [startMs, setStartMs] = useState(0);
  const [endMs, setEndMs] = useState(durationFromParams || 0);
  const [activeHandle, setActiveHandle] = useState<Handle>('start');
  const [isPlaying, setIsPlaying] = useState(false);
  const [trackWidth, setTrackWidth] = useState(0);
  const [videoSize, setVideoSize] = useState<{
    width: number;
    height: number;
  } | null>(null);

  const draggingRef = useRef<Handle | null>(null);
  const consumedRef = useRef(false);
  const frameMs = 1000 / Math.max(1, fps);

  useEffect(() => {
    if (durationMs > 0 && endMs === 0) {
      setEndMs(durationMs);
    }
  }, [durationMs, endMs]);

  useEffect(() => {
    const unsub = navigation.addListener('beforeRemove', () => {
      if (consumedRef.current) {
        return;
      }
      testsService.deleteVideoAt(videoUri).catch(() => {});
    });
    return unsub;
  }, [navigation, videoUri]);

  const onLoad = (data: OnLoadData) => {
    const ms = Math.round((data.duration ?? 0) * 1000);
    if (ms > 0 && Math.abs(ms - durationMs) > 50) {
      setDurationMs(ms);
      if (endMs === 0 || endMs > ms) {
        setEndMs(ms);
      }
    }
    if (data.naturalSize) {
      setVideoSize({
        width: data.naturalSize.width,
        height: data.naturalSize.height,
      });
    }
  };

  const onProgress = (data: OnProgressData) => {
    if (!isPlaying) {
      return;
    }
    const currentMs = Math.round(data.currentTime * 1000);
    if (currentMs >= endMs - 16) {
      videoRef.current?.seek(startMs / 1000);
    }
  };

  const seekTo = (ms: number) => {
    videoRef.current?.seek(ms / 1000);
  };

  const xToMs = (x: number) => {
    if (trackWidth <= 0 || durationMs <= 0) {
      return 0;
    }
    const ratio = Math.min(1, Math.max(0, x / trackWidth));
    return Math.round(ratio * durationMs);
  };

  const msToX = (ms: number) => {
    if (durationMs <= 0) {
      return 0;
    }
    const ratio = Math.min(1, Math.max(0, ms / durationMs));
    return ratio * trackWidth;
  };

  const updateHandle = (handle: Handle, value: number) => {
    if (handle === 'start') {
      const clamped = Math.max(0, Math.min(value, endMs - MIN_AIRTIME_MS));
      setStartMs(clamped);
      seekTo(clamped);
    } else {
      const clamped = Math.min(
        durationMs,
        Math.max(value, startMs + MIN_AIRTIME_MS),
      );
      setEndMs(clamped);
      seekTo(clamped);
    }
    setActiveHandle(handle);
  };

  const pickClosestHandle = (touchMs: number): Handle => {
    const distStart = Math.abs(touchMs - startMs);
    const distEnd = Math.abs(touchMs - endMs);
    return distStart <= distEnd ? 'start' : 'end';
  };

  const onTouchStart = (e: GestureResponderEvent) => {
    if (trackWidth <= 0) {
      return;
    }
    setIsPlaying(false);
    const touchX = e.nativeEvent.locationX;
    const touchMs = xToMs(touchX);
    const handle = pickClosestHandle(touchMs);
    draggingRef.current = handle;
    updateHandle(handle, touchMs);
  };

  const onTouchMove = (e: GestureResponderEvent) => {
    const handle = draggingRef.current;
    if (!handle) {
      return;
    }
    const touchX = e.nativeEvent.locationX;
    updateHandle(handle, xToMs(touchX));
  };

  const onTouchEnd = () => {
    draggingRef.current = null;
  };

  const stepFrame = (handle: Handle, dir: -1 | 1) => {
    const current = handle === 'start' ? startMs : endMs;
    updateHandle(handle, current + dir * frameMs);
  };

  const togglePlay = () => {
    if (!isPlaying) {
      seekTo(startMs);
      setIsPlaying(true);
    } else {
      setIsPlaying(false);
    }
  };

  const onLayoutTrack = (e: LayoutChangeEvent) => {
    setTrackWidth(e.nativeEvent.layout.width);
  };

  const goCalculate = () => {
    const airtimeMs = Math.max(0, endMs - startMs);
    if (airtimeMs < MIN_AIRTIME_MS) {
      Alert.alert(
        'Rango muy corto',
        'El tiempo entre despegue y aterrizaje es muy corto para calcular la altura. Movés los brackets para ampliarlo.',
      );
      return;
    }
    const heightCm = Math.round(airtimeToHeightCm(airtimeMs) * 10) / 10;
    consumedRef.current = true;
    navigation.navigate('JumpTestResult', {
      videoUri,
      startMs,
      endMs,
      heightCm,
    });
  };

  const goBackToRecord = () => {
    navigation.goBack();
  };

  const onVideoError = () => {
    Alert.alert(
      'No se pudo abrir el video',
      'Hubo un problema cargando el archivo grabado. Probá de nuevo.',
      [{ text: 'OK', onPress: () => navigation.goBack() }],
    );
  };

  const airtimeMs = Math.max(0, endMs - startMs);
  const startX = msToX(startMs);
  const endX = msToX(endMs);

  const aspectRatio = useMemo(() => {
    if (videoSize && videoSize.width && videoSize.height) {
      return videoSize.width / videoSize.height;
    }
    return 9 / 16;
  }, [videoSize]);

  return (
    <View style={[styles.screen, { backgroundColor: t.color.bg.base }]}>
      <View style={[styles.videoWrapper, { aspectRatio }]}>
        <Video
          ref={videoRef}
          source={{ uri: videoUri }}
          style={StyleSheet.absoluteFill}
          paused={!isPlaying}
          repeat={false}
          resizeMode="contain"
          onLoad={onLoad}
          onProgress={onProgress}
          onError={onVideoError}
          progressUpdateInterval={50}
          muted
        />
      </View>

      <View style={styles.body}>
        <View style={styles.statsRow}>
          <Stat label="DESPEGUE" value={formatMs(startMs)} />
          <Stat label="ATERRIZAJE" value={formatMs(endMs)} />
          <Stat label="AIRTIME" value={`${airtimeMs} ms`} />
        </View>

        <View
          style={styles.timelineWrapper}
          onLayout={onLayoutTrack}
          onStartShouldSetResponder={() => true}
          onMoveShouldSetResponder={() => true}
          onResponderGrant={onTouchStart}
          onResponderMove={onTouchMove}
          onResponderRelease={onTouchEnd}
          onResponderTerminate={onTouchEnd}>
          <View
            style={[styles.track, { backgroundColor: t.color.bg.elevated }]}
          />
          {trackWidth > 0 && (
            <View
              style={[
                styles.selection,
                {
                  left: startX,
                  width: Math.max(0, endX - startX),
                  backgroundColor: t.color.brand.primary,
                },
              ]}
            />
          )}
          {trackWidth > 0 && (
            <Bracket
              x={startX}
              color={t.color.brand.primary}
              active={activeHandle === 'start'}
            />
          )}
          {trackWidth > 0 && (
            <Bracket
              x={endX}
              color={t.color.brand.primary}
              active={activeHandle === 'end'}
            />
          )}
        </View>

        <View style={styles.stepRow}>
          <StepGroup
            label="DESPEGUE"
            active={activeHandle === 'start'}
            onMinus={() => stepFrame('start', -1)}
            onPlus={() => stepFrame('start', 1)}
            onSelect={() => setActiveHandle('start')}
          />
          <StepGroup
            label="ATERRIZAJE"
            active={activeHandle === 'end'}
            onMinus={() => stepFrame('end', -1)}
            onPlus={() => stepFrame('end', 1)}
            onSelect={() => setActiveHandle('end')}
          />
        </View>

        <View style={styles.actionsRow}>
          <Button
            variant="ghost"
            iconLeft={isPlaying ? 'Stop' : 'Play'}
            fullWidth={false}
            onPress={togglePlay}>
            {isPlaying ? 'Pausar loop' : 'Reproducir loop'}
          </Button>
          <Button variant="link" fullWidth={false} onPress={goBackToRecord}>
            Volver a grabar
          </Button>
        </View>
      </View>

      <View style={styles.footer}>
        <Button variant="primary" iconLeft="Check" onPress={goCalculate}>
          Calcular altura
        </Button>
      </View>
    </View>
  );
};

const Stat = ({ label, value }: { label: string; value: string }) => (
  <View style={styles.stat}>
    <Text variant="overline" tone="tertiary">
      {label}
    </Text>
    <Text variant="monoMD">{value}</Text>
  </View>
);

const Bracket = ({
  x,
  color,
  active,
}: {
  x: number;
  color: string;
  active: boolean;
}) => {
  return (
    <View
      pointerEvents="none"
      style={[
        styles.bracket,
        {
          left: x - HANDLE_HIT / 2,
          width: HANDLE_HIT,
          borderColor: color,
          backgroundColor: active ? color : 'transparent',
          opacity: active ? 1 : 0.85,
        },
      ]}
    />
  );
};

const StepGroup = ({
  label,
  active,
  onMinus,
  onPlus,
  onSelect,
}: {
  label: string;
  active: boolean;
  onMinus: () => void;
  onPlus: () => void;
  onSelect: () => void;
}) => {
  return (
    <View style={styles.stepGroup}>
      <Pressable onPress={onMinus} style={styles.stepBtn}>
        <Icon name="ChevronLeft" size="L" />
      </Pressable>
      <Pressable onPress={onSelect} style={styles.stepLabel}>
        <Text variant="overline" tone={active ? 'brand' : 'tertiary'}>
          {label}
        </Text>
      </Pressable>
      <Pressable onPress={onPlus} style={styles.stepBtn}>
        <Icon name="ChevronRight" size="L" />
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  videoWrapper: {
    width: '100%',
    backgroundColor: '#000',
    maxHeight: '50%',
    alignSelf: 'center',
  },
  body: {
    flex: 1,
    padding: tokens.layout.screenPadding,
    gap: tokens.spacing.lg,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: tokens.spacing.sm,
  },
  stat: {
    flex: 1,
    gap: tokens.spacing.xxs,
  },
  timelineWrapper: {
    height: TIMELINE_HEIGHT,
    justifyContent: 'center',
  },
  track: {
    height: 6,
    borderRadius: 3,
    width: '100%',
  },
  selection: {
    position: 'absolute',
    top: TIMELINE_HEIGHT / 2 - 3,
    height: 6,
    borderRadius: 3,
    opacity: 0.35,
  },
  bracket: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    borderWidth: 3,
    borderRadius: tokens.radius.sm,
  },
  stepRow: {
    flexDirection: 'row',
    gap: tokens.spacing.sm,
  },
  stepGroup: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: tokens.color.bg.surface,
    borderRadius: tokens.radius.sm,
    padding: tokens.spacing.xs,
  },
  stepBtn: {
    paddingHorizontal: tokens.spacing.sm,
    paddingVertical: tokens.spacing.xs,
  },
  stepLabel: {
    flex: 1,
    alignItems: 'center',
  },
  actionsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: tokens.spacing.xs,
  },
  footer: {
    padding: tokens.layout.screenPadding,
    paddingBottom: tokens.spacing['2xl'],
  },
});
