import React, { ReactNode } from 'react';
import { Modal as RNModal, Pressable, View } from 'react-native';
import { Text } from 'components/Text/text.component';
import { styles } from 'components/Modal/modal.styles';

interface SheetProps {
  visible: boolean;
  onRequestClose?: () => void;
  title?: string;
  children?: ReactNode;
  actions?: ReactNode;
}

/**
 * Bottom sheet variant of Modal — same scrim, but the panel docks at the bottom
 * with a drag handle. The user dismisses by tapping the scrim; we don't ship a
 * gesture-driven drag-to-dismiss in v1 (the design system doesn't depend on it).
 */
export const Sheet = ({
  visible,
  onRequestClose,
  title,
  children,
  actions,
}: SheetProps) => (
  <RNModal
    visible={visible}
    transparent
    animationType="slide"
    onRequestClose={onRequestClose}
    statusBarTranslucent>
    <Pressable style={styles.sheetScrim} onPress={onRequestClose}>
      <Pressable style={styles.sheet} onPress={() => undefined}>
        <View style={styles.handle} />
        {title && (
          <Text variant="displaySM" family="display" style={styles.sheetTitle}>
            {title}
          </Text>
        )}
        {children && <View style={{ marginBottom: 20 }}>{children}</View>}
        {actions && <View style={styles.actions}>{actions}</View>}
      </Pressable>
    </Pressable>
  </RNModal>
);
