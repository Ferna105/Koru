import React, { useCallback, useMemo, useState } from 'react';
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
import {
  getJumpType,
  JUMP_TYPES,
  JumpTypeDefinition,
} from '../../jumpTest.catalog';
import { formatAirtimeMs } from '../../jumpTest.physics';
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
      {formatRelative(record.createdAt)} · {formatAirtimeMs(record.airtimeMs)}{' '}
      ms
    </Text>
  </Card>
);

/**
 * Récord de un tipo de salto puntual, para el historial general. Los 5 saltos
 * no son comparables entre sí, así que en vez de un único "mejor de todos" se
 * muestra el récord de cada uno y cada card entra a su propio historial.
 */
const JumpRecordCard = ({
  jump,
  record,
  onPress,
}: {
  jump: JumpTypeDefinition;
  record: JumpRecord;
  onPress: () => void;
}) => {
  const t = useTheme();
  return (
    <Card variant="elevated" style={styles.recordCard} onPress={onPress}>
      <View style={styles.recordHead}>
        <Text variant="headingSM" family="display" style={styles.recordTitle}>
          {jump.title.toUpperCase()}
        </Text>
        <Icon name="ChevronRight" size="L" color={t.color.text.tertiary} />
      </View>
      <View style={styles.bestRow}>
        <Text variant="displayMD" tone="brand" family="display">
          {record.heightCm.toFixed(1)}
        </Text>
        <Text variant="bodyMD" tone="secondary" style={styles.recordUnit}>
          cm
        </Text>
      </View>
      <Text variant="monoMD" tone="secondary">
        {formatRelative(record.createdAt)} · {formatAirtimeMs(record.airtimeMs)}{' '}
        ms
      </Text>
    </Card>
  );
};

export const JumpTestHistory = ({
  route,
  navigation,
}: JumpTestStackScreenProps<'JumpTestHistory'>) => {
  const t = useTheme();
  // Sin `jumpType` (por ejemplo entrando desde Inicio) listamos todos los saltos.
  const jumpType = route.params?.jumpType;
  const jump = jumpType ? getJumpType(jumpType) : null;
  const [records, setRecords] = useState<JumpRecord[] | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  const reload = useCallback(async () => {
    const list = await testsService.loadJumpHistory(jumpType);
    setRecords(list);
  }, [jumpType]);

  useFocusEffect(
    useCallback(() => {
      reload();
    }, [reload]),
  );

  // Récord de cada tipo de salto que tenga al menos un test (sólo aplica al
  // historial general; en el de un salto puntual alcanza con BestCard).
  const bestByJumpType = useMemo(() => {
    if (jump || !records) {
      return [];
    }
    const rows: Array<{ jump: JumpTypeDefinition; record: JumpRecord }> = [];
    JUMP_TYPES.forEach(definition => {
      let best: JumpRecord | null = null;
      records.forEach(record => {
        if (record.jumpType !== definition.id) {
          return;
        }
        if (!best || record.heightCm > best.heightCm) {
          best = record;
        }
      });
      if (best) {
        rows.push({ jump: definition, record: best });
      }
    });
    return rows;
  }, [jump, records]);

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
      jumpType: record.jumpType,
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

  // Sin tipo de salto seleccionado no hay consigna que explicar: mandamos al
  // catálogo de tests para que el atleta elija cuál quiere hacer.
  const goExplanation = () =>
    jumpType
      ? navigation.navigate('JumpTestExplanation', { jumpType })
      : navigation.navigate('HomeTabs', { screen: 'Tests' });
  const goBack = () => navigation.goBack();
  const title = jump ? jump.title : 'Historial';

  const backButton = (
    <Pressable hitSlop={t.layout.minHitSlop} onPress={goBack}>
      <Icon name="ChevronLeft" size="L" />
    </Pressable>
  );

  if (records === null) {
    return (
      <Container variant="base" noPadding>
        <TopBar title={title} leading={backButton} />
      </Container>
    );
  }

  if (records.length === 0) {
    return (
      <Container variant="base" noPadding>
        <TopBar title={title} leading={backButton} />
        <View style={styles.emptyBody}>
          <Empty
            icon={
              <Icon name="Dumbbell" size="XXXL" color={t.color.brand.primary} />
            }
            title="Aún no hay tests"
            body={
              jump
                ? `Todavía no registraste ningún ${jump.title.toLowerCase()}.`
                : 'Hacé tu primer salto para empezar a medirte.'
            }
          />
        </View>
        <View style={styles.emptyFooter}>
          <Button variant="primary" iconLeft="Plus" onPress={goExplanation}>
            Nuevo salto
          </Button>
        </View>
      </Container>
    );
  }

  const best = records.reduce(
    (acc, r) => (r.heightCm > acc.heightCm ? r : acc),
    records[0],
  );

  const listHeader = jump ? (
    <BestCard record={best} />
  ) : (
    <View style={styles.recordsBlock}>
      <Text variant="overline" tone="tertiary">
        Tus récords
      </Text>
      <View style={styles.recordsList}>
        {bestByJumpType.map(row => (
          <JumpRecordCard
            key={row.jump.id}
            jump={row.jump}
            record={row.record}
            // `push` y no `navigate`: así el historial del salto se apila sobre
            // el general y volver atrás trae de vuelta el listado completo.
            onPress={() =>
              navigation.push('JumpTestHistory', { jumpType: row.jump.id })
            }
          />
        ))}
      </View>
      <Text variant="overline" tone="tertiary" style={styles.listLabel}>
        Todos los saltos
      </Text>
    </View>
  );

  return (
    <Container variant="base" noPadding>
      <TopBar title={title} leading={backButton} />
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
        ListHeaderComponent={listHeader}
        ItemSeparatorComponent={ItemSeparator}
        renderItem={({ item }) => (
          <ListItem
            leading={
              <Icon name="Timer" size="L" color={t.color.brand.primary} />
            }
            title={`${item.heightCm.toFixed(1)} cm`}
            subtitle={
              jump
                ? `${formatRelative(
                    item.createdAt,
                  )} · airtime ${formatAirtimeMs(item.airtimeMs)} ms`
                : `${getJumpType(item.jumpType).title} · ${formatRelative(
                    item.createdAt,
                  )}`
            }
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
  recordsBlock: {
    gap: tokens.spacing.sm,
    marginBottom: tokens.spacing.lg,
  },
  recordsList: {
    gap: tokens.spacing.sm,
  },
  recordCard: {
    gap: tokens.spacing.xxs,
  },
  recordHead: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: tokens.spacing.sm,
  },
  recordTitle: {
    flex: 1,
  },
  recordUnit: {
    marginLeft: tokens.spacing.xs,
    marginBottom: tokens.spacing.xs,
  },
  listLabel: {
    marginTop: tokens.spacing.sm,
  },
  emptyBody: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: tokens.layout.screenPadding,
  },
  emptyFooter: {
    padding: tokens.layout.screenPadding,
    paddingBottom: tokens.spacing['2xl'],
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
