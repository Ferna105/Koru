import React, { useContext } from 'react';
import { Image, Pressable, ScrollView, View } from 'react-native';
import {
  Card,
  Container,
  Empty,
  Icon,
  Separator,
  Text,
  TopBar,
} from 'components';
import { useTheme } from 'design-system';
import { UserContext } from 'contexts/user.context';
import { ProfileStackScreenProps } from 'navigation/types';
import { styles } from './myProfile.styles';

const initialsOf = (name: string | null, email: string): string => {
  const source = name?.trim() || email;
  const parts = source.split(/[\s.@]+/).filter(Boolean);
  return parts
    .slice(0, 2)
    .map(p => p[0]?.toUpperCase() ?? '')
    .join('');
};

const Field = ({ label, value }: { label: string; value?: string | null }) => (
  <View style={styles.field}>
    <Text variant="overline" tone="tertiary">
      {label}
    </Text>
    <Text variant="bodyMD">{value?.trim() ? value : '—'}</Text>
  </View>
);

export const MyProfile = ({
  navigation,
}: ProfileStackScreenProps<'MyProfile'>) => {
  const t = useTheme();
  const { user } = useContext(UserContext);

  const backButton = (
    <Pressable
      hitSlop={t.layout.minHitSlop}
      onPress={() => navigation.goBack()}>
      <Icon name="ChevronLeft" size="L" />
    </Pressable>
  );

  return (
    <Container variant="base" noPadding>
      <TopBar title="Mi perfil" leading={backButton} />
      {user ? (
        <ScrollView
          contentContainerStyle={styles.content}
          showsVerticalScrollIndicator={false}>
          <Card variant="elevated" style={styles.identity}>
            {user.photo ? (
              <Image source={{ uri: user.photo }} style={styles.avatar} />
            ) : (
              <View
                style={[
                  styles.avatar,
                  styles.avatarFallback,
                  { backgroundColor: t.color.brand.primaryDim },
                ]}>
                <Text variant="headingMD" tone="brand">
                  {initialsOf(user.name, user.email)}
                </Text>
              </View>
            )}
            <View style={styles.identityText}>
              <Text variant="headingMD">{user.name ?? user.email}</Text>
              <Text variant="bodySM" tone="secondary">
                {user.email}
              </Text>
            </View>
          </Card>

          <Card variant="default" style={styles.fields}>
            <Field label="Nombre" value={user.givenName} />
            <Separator tone="subtle" />
            <Field label="Apellido" value={user.familyName} />
            <Separator tone="subtle" />
            <Field label="Email" value={user.email} />
          </Card>

          <Text variant="caption" tone="tertiary">
            Estos datos vienen de tu cuenta de Google y no se pueden editar
            desde Koru.
          </Text>
        </ScrollView>
      ) : (
        <View style={styles.empty}>
          <Empty
            icon={<Icon name="User" size="XXXL" />}
            title="Sin datos"
            body="Volvé a iniciar sesión con Google para cargar tu perfil."
          />
        </View>
      )}
    </Container>
  );
};
