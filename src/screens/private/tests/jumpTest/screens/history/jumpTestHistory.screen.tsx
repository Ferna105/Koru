import React, { useCallback, useState } from 'react';
import {
  View,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Alert,
  RefreshControl,
} from 'react-native';
import { useFocusEffect, useTheme } from '@react-navigation/native';
import { Button, Text } from 'components';
import { JumpTestStackScreenProps } from 'navigation/types';
import { Sizing } from 'utils/sizing';
import { ITheme } from 'utils/colors';
import { JumpRecord } from '../../jumpTest.types';
import { testsService } from 'services/tests/tests.services';

const formatRelative = (iso: string): string => {
  const d = new Date(iso);
  const now = new Date();
  const sameDay =
    d.getFullYear() === now.getFullYear() &&
    d.getMonth() === now.getMonth() &&
    d.getDate() === now.getDate();
  const yesterday = new Date(now);
  yesterday.setDate(now.getDate() - 1);
  const isYesterday =
    d.getFullYear() === yesterday.getFullYear() &&
    d.getMonth() === yesterday.getMonth() &&
    d.getDate() === yesterday.getDate();

  const hh = String(d.getHours()).padStart(2, '0');
  const mm = String(d.getMinutes()).padStart(2, '0');
  if (sameDay) return `hoy ${hh}:${mm}`;
  if (isYesterday) return `ayer ${hh}:${mm}`;
  const dd = String(d.getDate()).padStart(2, '0');
  const mo = String(d.getMonth() + 1).padStart(2, '0');
  return `${dd}/${mo} ${hh}:${mm}`;
};

export const JumpTestHistory = ({
  navigation,
}: JumpTestStackScreenProps<'JumpTestHistory'>) => {
  const { colors }: ITheme = useTheme();
  const [records, setRecords] = useState<JumpRecord[] | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  const reload = useCallback(async () => {
    const list = await testsService.loadJumpHistory();
    setRecords(list);
  }, []);

  useFocusEffect(
    useCallback(() => {
      reload();
    }, [reload]),
  );

  const onPullRefresh = async () => {
    setRefreshing(true);
    try {
      await reload();
    } finally {
      setRefreshing(false);
    }
  };

  const onItemPress = (record: JumpRecord) => {
    navigation.navigate('JumpTestResult', {
      videoUri: record.videoUri,
      startMs: record.startMs,
      endMs: record.endMs,
      heightCm: record.heightCm,
      recordId: record.id,
    });
  };

  const onItemLongPress = (record: JumpRecord) => {
    Alert.alert(
      'Borrar este test',
      `¿Querés borrar el salto de ${record.heightCm.toFixed(1)} cm? Esta acción no se puede deshacer.`,
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Borrar',
          style: 'destructive',
          onPress: async () => {
            await testsService.deleteJumpRecord(record.id);
            await reload();
          },
        },
      ],
    );
  };

  const goExplanation = () => navigation.navigate('JumpTestExplanation');

  if (records === null) {
    return (
      <View
        style={[styles.screen, styles.center, { backgroundColor: colors.background }]}
      />
    );
  }

  if (records.length === 0) {
    return (
      <View style={[styles.screen, { backgroundColor: colors.background }]}>
        <View style={styles.empty}>
          <Text fontSize="XL" fontWeight="bold" style={styles.centerText}>
            {'Aún no hiciste\nningún salto'}
          </Text>
          <Text fontSize="S" style={[styles.centerText, styles.subtitle]}>
            Filmá tu pisada en primer plano y medí tu altura de salto
          </Text>
          <Button type="PRIMARY" text="EMPEZAR" onPress={goExplanation} />
        </View>
      </View>
    );
  }

  const best = records.reduce((acc, r) => (r.heightCm > acc.heightCm ? r : acc), records[0]);

  return (
    <View style={[styles.screen, { backgroundColor: colors.background }]}>
      <FlatList
        data={records}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.listContent}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onPullRefresh}
            tintColor={colors.text}
          />
        }
        ListHeaderComponent={
          <BestCard record={best} cardColor={colors.card} />
        }
        ItemSeparatorComponent={() => <View style={{ height: Sizing.S }} />}
        renderItem={({ item }) => (
          <RecordCard
            record={item}
            cardColor={colors.card}
            primaryColor={colors.primary}
            onPress={() => onItemPress(item)}
            onLongPress={() => onItemLongPress(item)}
          />
        )}
      />
      <View style={styles.footer}>
        <Button type="PRIMARY" text="NUEVO SALTO" onPress={goExplanation} />
      </View>
    </View>
  );
};

const BestCard = ({
  record,
  cardColor,
}: {
  record: JumpRecord;
  cardColor: string;
}) => {
  return (
    <View style={[styles.bestCard, { backgroundColor: cardColor }]}>
      <Text
        fontSize="XS"
        fontWeight="bold"
        color="background"
        style={styles.bestLabel}>
        RÉCORD PERSONAL
      </Text>
      <View style={styles.bestRow}>
        <Text style={styles.bestNumber} fontWeight="bold" color="background">
          {record.heightCm.toFixed(1)}
        </Text>
        <Text
          fontSize="XL"
          fontWeight="bold"
          color="background"
          style={styles.bestUnit}>
          cm
        </Text>
      </View>
      <Text fontSize="S" fontWeight="bold" color="background" style={{ opacity: 0.85 }}>
        {formatRelative(record.createdAt)} · {record.airtimeMs} ms
      </Text>
    </View>
  );
};

const RecordCard = ({
  record,
  cardColor,
  onPress,
  onLongPress,
}: {
  record: JumpRecord;
  cardColor: string;
  primaryColor: string;
  onPress: () => void;
  onLongPress: () => void;
}) => {
  return (
    <TouchableOpacity
      activeOpacity={0.85}
      onPress={onPress}
      onLongPress={onLongPress}
      delayLongPress={350}
      style={[styles.itemCard, { borderLeftColor: cardColor }]}>
      <View style={styles.itemLeft}>
        <Text style={styles.itemHeight} fontWeight="bold">
          {record.heightCm.toFixed(1)}
        </Text>
        <Text fontSize="M" fontWeight="bold" style={styles.itemUnit}>
          cm
        </Text>
      </View>
      <View style={styles.itemRight}>
        <Text fontSize="S" fontWeight="bold">
          {formatRelative(record.createdAt)}
        </Text>
        <Text fontSize="XS" style={styles.itemAirtime}>
          Airtime {record.airtimeMs} ms
        </Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  center: { justifyContent: 'center', alignItems: 'center' },
  centerText: { textAlign: 'center' },
  subtitle: { opacity: 0.6 },
  empty: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: Sizing.L,
    paddingHorizontal: Sizing.M,
  },
  listContent: {
    padding: Sizing.M,
    paddingBottom: 100,
  },
  bestCard: {
    borderRadius: Sizing.XS,
    padding: Sizing.M,
    marginBottom: Sizing.M,
    gap: Sizing.XXS,
  },
  bestLabel: {
    letterSpacing: 2,
    opacity: 0.85,
  },
  bestRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
  },
  bestNumber: {
    fontSize: 64,
    lineHeight: 70,
  },
  bestUnit: {
    marginLeft: Sizing.XXS,
    marginBottom: Sizing.XXS,
    opacity: 0.85,
  },
  itemCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1a1a1a',
    borderLeftWidth: 4,
    borderRadius: Sizing.XXS,
    padding: Sizing.M,
    gap: Sizing.M,
  },
  itemLeft: {
    flexDirection: 'row',
    alignItems: 'flex-end',
  },
  itemHeight: {
    fontSize: 36,
    lineHeight: 38,
    color: '#FFFFFF',
  },
  itemUnit: {
    marginLeft: Sizing.XXXS,
    opacity: 0.7,
  },
  itemRight: {
    flex: 1,
    alignItems: 'flex-end',
    gap: 2,
  },
  itemAirtime: {
    opacity: 0.6,
  },
  footer: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    padding: Sizing.M,
    paddingBottom: Sizing.L,
  },
});
