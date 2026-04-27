import React, {
  ReactNode,
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { Animated, Pressable, View } from 'react-native';
import { useTheme } from 'design-system';
import { Text } from 'components/Text/text.component';
import { styles } from './toast.styles';

export type ToastTone = 'info' | 'success' | 'warning' | 'danger';

interface ToastConfig {
  id: number;
  tone: ToastTone;
  title: string;
  body?: string;
  actionLabel?: string;
  onAction?: () => void;
  durationMs: number;
}

interface ToastContextValue {
  show: (
    cfg: Omit<ToastConfig, 'id' | 'durationMs'> & { durationMs?: number },
  ) => void;
  hide: (id: number) => void;
}

const ToastContext = createContext<ToastContextValue | null>(null);

const DEFAULT_DURATION = 3200;

export const ToastProvider = ({ children }: { children: ReactNode }) => {
  const [items, setItems] = useState<ToastConfig[]>([]);
  const counter = useRef(0);

  const hide = useCallback((id: number) => {
    setItems(prev => prev.filter(i => i.id !== id));
  }, []);

  const show = useCallback<ToastContextValue['show']>(
    cfg => {
      counter.current += 1;
      const id = counter.current;
      const next: ToastConfig = {
        id,
        durationMs: cfg.durationMs ?? DEFAULT_DURATION,
        ...cfg,
      };
      setItems(prev => [...prev, next]);
      setTimeout(() => hide(id), next.durationMs);
    },
    [hide],
  );

  const value = useMemo(() => ({ show, hide }), [show, hide]);

  return (
    <ToastContext.Provider value={value}>
      {children}
      <View pointerEvents="box-none" style={styles.host}>
        {items.map(t => (
          <ToastView key={t.id} cfg={t} onDismiss={() => hide(t.id)} />
        ))}
      </View>
    </ToastContext.Provider>
  );
};

const ToastView = ({
  cfg,
  onDismiss,
}: {
  cfg: ToastConfig;
  onDismiss: () => void;
}) => {
  const tokens = useTheme();
  const opacity = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(20)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(opacity, {
        toValue: 1,
        duration: tokens.motion.duration.base,
        useNativeDriver: true,
      }),
      Animated.timing(translateY, {
        toValue: 0,
        duration: tokens.motion.duration.base,
        useNativeDriver: true,
      }),
    ]).start();
  }, [opacity, translateY, tokens.motion.duration.base]);

  const barColor = {
    info: tokens.color.semantic.info,
    success: tokens.color.semantic.success,
    warning: tokens.color.semantic.warning,
    danger: tokens.color.brand.danger,
  }[cfg.tone];

  return (
    <Animated.View
      style={[styles.toast, { opacity, transform: [{ translateY }] }]}>
      <View style={[styles.bar, { backgroundColor: barColor }]} />
      <View style={styles.body}>
        <Text variant="bodyMD" style={{ fontWeight: '700' }}>
          {cfg.title}
        </Text>
        {cfg.body && (
          <Text variant="bodySM" tone="secondary" style={styles.text}>
            {cfg.body}
          </Text>
        )}
      </View>
      {cfg.actionLabel && (
        <Pressable
          style={styles.action}
          onPress={() => {
            cfg.onAction?.();
            onDismiss();
          }}>
          <Text variant="button" tone="brand">
            {cfg.actionLabel}
          </Text>
        </Pressable>
      )}
    </Animated.View>
  );
};

export const useToast = (): ToastContextValue => {
  const ctx = useContext(ToastContext);
  if (!ctx) {
    throw new Error('useToast must be used inside <ToastProvider>');
  }
  return ctx;
};
