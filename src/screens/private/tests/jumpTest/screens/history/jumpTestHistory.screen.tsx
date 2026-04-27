import React, { useCallback, useState } from 'react';
import {
  View,
  StyleSheet,
  FlatList,
  Alert,
  RefreshControl,
  Pressable,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import {
  Button,
  Card,
  Container,
  Empty,
  Icon,
  ListItem,
  Text,
  TopBar,
} from 'components';
import { useTheme, tokens } from 'design-system';
import { JumpTestStackScreenProps } from 'navigation/types';
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
  if (sameDay) {
    return `hoy ${hh}:${mm}`;
  }
  if (isYesterday) {
    return `ayer ${hh}:${mm}`;
  }
  const dd = String(d.getDate()).padStart(2, '0');
  const mo = String(d.getMonth() + 1).padStart(2, '0');
  return `${dd}/${mo} ${hh}:${mm}`;
};

const ItemSeparator = () => <View style={styles.separatorGap} />;

const BestCard = ({ record }: { record: JumpRecord }) => (
  <Card variant="elevated" style={styles.bestCard}>
    <Text variant="overline" tone="brand">
      Récord personal
    </Text>
    <View style={styles.bestRow}>
      <Text variant="displayXL" tone="brand" family="display">
        {record.heightCm.toFixed(1)}
      </Text>
      <Text variant="headingMD" tone="secondary" style={styles.bestUnit}>
        cm
      </Text>
    </View>
    <Text variant="monoMD" tone="secondary">
      {formatRelative(record.createdAt)} · {record.airtimeMs} ms
    </Text>
  </Card>
);

export const JumpTestHistory = ({
  navigation,
}: JumpTestStackScreenProps<'JumpTestHistory'>) => {
  const t = useTheme();
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
      `¿Querés borrar el salto de ${record.heightCm.toFixed(
        1,
      )} cm? Esta acción no se puede deshacer.`,
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
  const goBack = () => navigation.goBack();

  const backButton = (
    <Pressable hitSlop={t.layout.minHitSlop} onPress={goBack}>
      <Icon name="ChevronLeft" size="L" />
    </Pressable>
  );

  if (records === null) {
    return (
      <Container variant="base" noPadding>
        <TopBar title="Historial" leading={backButton} />
      </Container>
    );
  }

  if (records.length === 0) {
    return (
      <Container variant="base" noPadding>
        <TopBar title="Historial" leading={backButton} />
        <Empty
          icon={
            <Icon name="Dumbbell" size="XXXL" color={t.color.brand.primary} />
          }
          title="Aún no hay tests"
          body="Hacé tu primer salto para empezar a medirte."
          action={
            <Button variant="primary" onPress={goExplanation}>
              Nuevo salto
            </Button>
          }
        />
      </Container>
    );
  }

  const best = records.reduce(
    (acc, r) => (r.heightCm > acc.heightCm ? r : acc),
    records[0],
  );

  return (
    <Container variant="base" noPadding>
      <TopBar title="Historial" leading={backButton} />
      <FlatList
        data={records}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.listContent}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onPullRefresh}
            tintColor={t.color.text.primary}
          />
        }
        ListHeaderComponent={<BestCard record={best} />}
        ItemSeparatorComponent={ItemSeparator}
        renderItem={({ item }) => (
          <ListItem
            leading={
              <Icon name="Timer" size="L" color={t.color.brand.primary} />
            }
            title={`${item.heightCm.toFixed(1)} cm`}
            subtitle={`${formatRelative(item.createdAt)} · airtime ${
              item.airtimeMs
            } ms`}
            trailing={
              <Icon
                name="ChevronRight"
                size="L"
                color={t.color.text.tertiary}
              />
            }
            onPress={() => onItemPress(item)}
            onLongPress={() => onItemLongPress(item)}
          />
        )}
      />
      <View style={styles.footer}>
        <Button variant="primary" iconLeft="Plus" onPress={goExplanation}>
          Nuevo salto
        </Button>
      </View>
    </Container>
  );
};

const styles = StyleSheet.create({
  listContent: {
    padding: tokens.layout.screenPadding,
    paddingBottom: 120,
    gap: tokens.spacing.sm,
  },
  separatorGap: {
    height: tokens.spacing.sm,
  },
  bestCard: {
    marginBottom: tokens.spacing.lg,
    gap: tokens.spacing.xs,
  },
  bestRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
  },
  bestUnit: {
    marginLeft: tokens.spacing.xs,
    marginBottom: tokens.spacing.sm,
  },
  footer: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    padding: tokens.layout.screenPadding,
    paddingBottom: tokens.spacing['2xl'],
  },
});
