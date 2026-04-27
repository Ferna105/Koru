import React, { ReactNode } from 'react';
import { Modal as RNModal, Pressable, View } from 'react-native';
import { Text } from 'components/Text/text.component';
import { styles } from './modal.styles';

interface ModalProps {
  visible: boolean;
  onRequestClose?: () => void;
  title?: string;
  children?: ReactNode;
  actions?: ReactNode;
  /** Tap outside to dismiss. Defaults to on. */
  dismissOnBackdrop?: boolean;
}

export const Modal = ({
  visible,
  onRequestClose,
  title,
  children,
  actions,
  dismissOnBackdrop = true,
}: ModalProps) => (
  <RNModal
    visible={visible}
    transparent
    animationType="fade"
    onRequestClose={onRequestClose}
    statusBarTranslucent>
    <Pressable
      style={styles.scrim}
      onPress={dismissOnBackdrop ? onRequestClose : undefined}>
      <Pressable style={styles.modal} onPress={() => undefined}>
        {title && (
          <Text variant="displaySM" family="display" style={styles.title}>
            {title}
          </Text>
        )}
        {children && (
          <View style={styles.body}>
            {typeof children === 'string' ? (
              <Text variant="bodyMD" tone="secondary">
                {children}
              </Text>
            ) : (
              children
            )}
          </View>
        )}
        {actions && <View style={styles.actions}>{actions}</View>}
      </Pressable>
    </Pressable>
  </RNModal>
);
