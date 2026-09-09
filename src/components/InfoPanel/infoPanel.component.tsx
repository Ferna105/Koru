import React from 'react';
import { View, ViewStyle } from 'react-native';
import { Card } from '../Card/card.component';
import { Text } from '../Text/text.component';
import { styles } from './infoPanel.styles';

interface InfoPanelProps {
  /** Cada string es una línea del título; se apilan sin separación extra. */
  title: string[];
  /** Un párrafo por string. */
  body: string[];
  /** Frase de cierre, resaltada con el filete de marca. */
  closing?: string;
  style?: ViewStyle;
}

/**
 * Bloque de texto explicativo: título en tipografía display, cuerpo secundario
 * y un cierre destacado. Sin interacción — es contenido, no un acceso.
 */
export const InfoPanel = ({ title, body, closing, style }: InfoPanelProps) => (
  <Card variant="default" style={[styles.card, ...(style ? [style] : [])]}>
    <View style={styles.title}>
      {title.map(line => (
        <Text key={line} variant="displaySM" tone="brand">
          {line}
        </Text>
      ))}
    </View>

    <View style={styles.body}>
      {body.map(paragraph => (
        <Text key={paragraph} variant="bodySM" tone="secondary">
          {paragraph}
        </Text>
      ))}
    </View>

    {closing ? (
      <View style={styles.closing}>
        <View style={styles.accent} />
        <Text variant="headingSM">{closing}</Text>
      </View>
    ) : null}
  </Card>
);
