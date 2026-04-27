import React, { ReactNode } from 'react';
import { View } from 'react-native';
import { Text } from 'components/Text/text.component';
import { styles } from './table.styles';

export interface TableColumn<T> {
  key: keyof T & string;
  label: string;
  /** Flex weight in the row layout. Defaults to 1. */
  flex?: number;
  /** Optional cell renderer; falls back to String(value). */
  render?: (row: T) => ReactNode;
}

interface TableProps<T> {
  columns: TableColumn<T>[];
  rows: T[];
  /** Render zebra striping on even rows. Defaults to off. */
  zebra?: boolean;
}

export function Table<T extends object>({
  columns,
  rows,
  zebra = false,
}: TableProps<T>) {
  return (
    <View style={styles.base}>
      <View style={styles.head}>
        {columns.map(c => (
          <View key={c.key} style={[styles.cell, { flex: c.flex ?? 1 }]}>
            <Text variant="overline" tone="tertiary">
              {c.label}
            </Text>
          </View>
        ))}
      </View>
      {rows.map((row, i) => (
        <View
          key={i}
          style={[
            styles.row,
            zebra && i % 2 === 1 ? styles.zebra : null,
            i === rows.length - 1 ? { borderBottomWidth: 0 } : null,
          ]}>
          {columns.map(c => (
            <View key={c.key} style={[styles.cell, { flex: c.flex ?? 1 }]}>
              {c.render ? (
                c.render(row)
              ) : (
                <Text variant="bodyMD">{String(row[c.key] ?? '')}</Text>
              )}
            </View>
          ))}
        </View>
      ))}
    </View>
  );
}
