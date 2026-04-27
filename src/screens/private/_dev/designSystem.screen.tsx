import React, { useState } from 'react';
import { View } from 'react-native';
import {
  Badge,
  BottomNav,
  Button,
  Card,
  Container,
  Empty,
  Icon,
  ListItem,
  Modal,
  RecordButton,
  Separator,
  Sheet,
  Tabs,
  Table,
  TestCard,
  Text,
  TextInput,
  Timeline,
  ToastProvider,
  TopBar,
  useToast,
} from 'components';
import { tokens, useTheme } from 'design-system';

const Section = ({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) => (
  <View style={{ gap: 12, marginBottom: 32 }}>
    <Text variant="overline" tone="brand">
      {title}
    </Text>
    {children}
  </View>
);

const DesignSystemBody = () => {
  const t = useTheme();
  const toast = useToast();
  const [tab, setTab] = useState('one');
  const [seg, setSeg] = useState('a');
  const [modalOpen, setModalOpen] = useState(false);
  const [sheetOpen, setSheetOpen] = useState(false);
  const [marker, setMarker] = useState(0.42);

  return (
    <Container scrollable>
      <Text variant="displayLG" family="display">
        Design System
      </Text>
      <Text
        variant="bodyMD"
        tone="secondary"
        style={{ marginBottom: 24, marginTop: 4 }}>
        Visual smoke test — every component once.
      </Text>

      <Section title="Typography">
        <Text variant="displayXL" family="display">
          Display XL
        </Text>
        <Text variant="displayMD" family="display">
          Display MD
        </Text>
        <Text variant="headingLG">Heading LG</Text>
        <Text variant="bodyLG">Body LG. Manrope Regular.</Text>
        <Text variant="bodyMD" tone="secondary">
          Body MD secondary.
        </Text>
        <Text variant="caption" tone="tertiary">
          Caption tertiary.
        </Text>
        <Text variant="monoLG" family="mono" tone="brand">
          1234.56 ms
        </Text>
      </Section>

      <Section title="Buttons">
        <Button variant="primary" iconLeft="Plus">
          Crear test
        </Button>
        <Button variant="secondary" iconLeft="Filter">
          Filtrar
        </Button>
        <Button variant="destructive">Eliminar</Button>
        <Button variant="ghost">Ghost</Button>
        <Button variant="link" fullWidth={false}>
          Link
        </Button>
        <Button variant="primary" loading>
          Loading
        </Button>
        <Button variant="primary" disabled>
          Disabled
        </Button>
        <View style={{ flexDirection: 'row', gap: 8 }}>
          <Button variant="primary" size="sm" fullWidth={false}>
            sm
          </Button>
          <Button variant="primary" size="md" fullWidth={false}>
            md
          </Button>
          <Button variant="primary" size="lg" fullWidth={false}>
            lg
          </Button>
        </View>
      </Section>

      <Section title="Inputs">
        <TextInput
          label="Email"
          placeholder="you@koru.app"
          iconLeft="User"
          hint="We never share it."
        />
        <TextInput
          label="Codigo"
          mono
          placeholder="000-000"
          state="error"
          error="Codigo invalido."
        />
        <TextInput label="Disabled" state="disabled" value="—" />
      </Section>

      <Section title="Cards">
        <Card variant="default">
          <Text variant="headingSM">Default</Text>
          <Text variant="bodyMD" tone="secondary">
            Surface 141416 + subtle border.
          </Text>
        </Card>
        <Card variant="elevated">
          <Text variant="headingSM">Elevated</Text>
          <Text variant="bodyMD" tone="secondary">
            Drops shadow + bg.elevated.
          </Text>
        </Card>
        <Card variant="outlined">
          <Text variant="headingSM">Outlined</Text>
          <Text variant="bodyMD" tone="secondary">
            Transparent + default border.
          </Text>
        </Card>
        <TestCard
          title="Salto vertical"
          subtitle="Best del mes"
          value="47"
          unit="cm"
          accent="gold"
          starred
        />
        <TestCard
          title="Sprint"
          subtitle="20 m"
          value="3.12"
          unit="s"
          status="Personal best"
        />
      </Section>

      <Section title="Top bars">
        <TopBar
          title="Inicio"
          variant="gold"
          leading={<Icon name="ChevronLeft" color={t.color.text.onBrand} />}
          trailing={<Icon name="Settings" color={t.color.text.onBrand} />}
        />
        <TopBar title="Tests" variant="dark" />
        <TopBar title="Cuenta" variant="ghost" />
      </Section>

      <Section title="Bottom nav">
        <BottomNav
          activeId="home"
          onSelect={() => undefined}
          items={[
            { id: 'home', label: 'INICIO', icon: 'Home' },
            { id: 'tests', label: 'TESTS', icon: 'List' },
            { id: 'me', label: 'CUENTA', icon: 'User' },
          ]}
        />
      </Section>

      <Section title="Tabs">
        <Tabs
          tabs={[
            { id: 'one', label: 'Recientes', count: 12 },
            { id: 'two', label: 'Mejores', count: 4 },
            { id: 'three', label: 'Todos' },
          ]}
          activeId={tab}
          onChange={setTab}
        />
        <View style={{ marginTop: 16 }}>
          <Tabs
            variant="segmented"
            tabs={[
              { id: 'a', label: 'Mes' },
              { id: 'b', label: 'Año' },
            ]}
            activeId={seg}
            onChange={setSeg}
          />
        </View>
      </Section>

      <Section title="Badges">
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
          <Badge tone="gold">Gold</Badge>
          <Badge tone="danger">Danger</Badge>
          <Badge tone="success" dot>
            Live
          </Badge>
          <Badge tone="warning">Warning</Badge>
          <Badge tone="info">Info</Badge>
          <Badge tone="neutral">Neutral</Badge>
        </View>
      </Section>

      <Section title="List + table">
        <ListItem
          leading={<Icon name="Timer" color={t.color.brand.primary} />}
          title="Test 12 abr"
          subtitle="13:42 · 412 ms airtime"
          trailing={<Text variant="monoMD">47 cm</Text>}
        />
        <ListItem
          leading={<Icon name="Timer" color={t.color.brand.primary} />}
          title="Test 11 abr"
          subtitle="11:08"
          trailing={<Text variant="monoMD">42 cm</Text>}
        />
        <View style={{ height: 12 }} />
        <Table
          columns={[
            { key: 'set', label: 'Set', flex: 0.6 },
            { key: 'reps', label: 'Reps', flex: 0.6 },
            { key: 'load', label: 'Carga' },
          ]}
          rows={[
            { set: '1', reps: '8', load: '60 kg' },
            { set: '2', reps: '6', load: '70 kg' },
            { set: '3', reps: '4', load: '80 kg' },
          ]}
          zebra
        />
      </Section>

      <Section title="Record + timeline">
        <View style={{ alignItems: 'center', gap: 12 }}>
          <RecordButton state="idle" />
          <RecordButton state="recording" />
          <RecordButton state="paused" />
        </View>
        <Timeline marker={marker} />
        <View style={{ flexDirection: 'row', gap: 8 }}>
          <Button
            variant="ghost"
            size="sm"
            iconLeft="ChevronLeft"
            fullWidth={false}
            onPress={() => setMarker(m => Math.max(0, m - 0.05))}>
            Back
          </Button>
          <Button
            variant="ghost"
            size="sm"
            iconRight="ChevronRight"
            fullWidth={false}
            onPress={() => setMarker(m => Math.min(1, m + 0.05))}>
            Fwd
          </Button>
        </View>
      </Section>

      <Section title="Empty">
        <Empty
          icon={
            <Icon name="Dumbbell" size="XXXL" color={t.color.brand.primary} />
          }
          title="Sin tests"
          body="Hace tu primer salto para verlo aca."
          action={<Button variant="primary">Empezar</Button>}
        />
      </Section>

      <Section title="Overlays">
        <Button variant="secondary" onPress={() => setModalOpen(true)}>
          Abrir modal
        </Button>
        <Button variant="secondary" onPress={() => setSheetOpen(true)}>
          Abrir sheet
        </Button>
        <Button
          variant="secondary"
          onPress={() =>
            toast.show({
              tone: 'success',
              title: 'Guardado',
              body: 'Tu test se guardo en el historial.',
              actionLabel: 'Ver',
            })
          }>
          Toast success
        </Button>
        <Button
          variant="secondary"
          onPress={() =>
            toast.show({
              tone: 'danger',
              title: 'Error',
              body: 'No pudimos guardar el video.',
            })
          }>
          Toast danger
        </Button>
      </Section>

      <Separator tone="default" />

      <Text variant="caption" tone="tertiary" style={{ textAlign: 'center' }}>
        Tokens: {Object.keys(tokens.color.bg).length} bg ·{' '}
        {Object.keys(tokens.type).length} type variants
      </Text>

      <Modal
        visible={modalOpen}
        onRequestClose={() => setModalOpen(false)}
        title="Eliminar test?"
        actions={
          <>
            <Button
              variant="ghost"
              fullWidth={false}
              onPress={() => setModalOpen(false)}>
              Cancelar
            </Button>
            <Button
              variant="destructive"
              fullWidth={false}
              onPress={() => setModalOpen(false)}>
              Eliminar
            </Button>
          </>
        }>
        Esta accion no se puede deshacer. El video tambien se borrara del
        dispositivo.
      </Modal>

      <Sheet
        visible={sheetOpen}
        onRequestClose={() => setSheetOpen(false)}
        title="Compartir"
        actions={
          <Button
            fullWidth
            variant="primary"
            iconLeft="Share"
            onPress={() => setSheetOpen(false)}>
            Compartir video
          </Button>
        }>
        <Text variant="bodyMD" tone="secondary">
          Elegi como compartir el resultado de tu salto.
        </Text>
      </Sheet>

      <View style={{ height: 80 }} />
    </Container>
  );
};

export const DesignSystemScreen = () => (
  <ToastProvider>
    <DesignSystemBody />
  </ToastProvider>
);

export default DesignSystemScreen;
