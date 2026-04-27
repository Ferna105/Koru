import React from 'react';
import { View } from 'react-native';
import { styles } from './timeline.styles';

interface TimelineProps {
  /** Marker position 0..1 along the track. */
  marker?: number;
  /** Number of ticks to render. Major every 5th. */
  ticks?: number;
}

export const Timeline = ({ marker = 0, ticks = 41 }: TimelineProps) => {
  const clamped = Math.min(1, Math.max(0, marker));
  return (
    <View style={styles.base}>
      <View style={styles.track}>
        {Array.from({ length: ticks }, (_, i) => (
          <View
            key={i}
            style={[styles.tick, i % 5 === 0 ? styles.tickMajor : null]}
          />
        ))}
        <View style={[styles.marker, { left: `${clamped * 100}%` }]}>
          <View style={[styles.markerCap, { top: -4 }]} />
          <View style={[styles.markerCap, { bottom: -4 }]} />
        </View>
      </View>
    </View>
  );
};
