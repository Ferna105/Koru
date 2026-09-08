import React from 'react';
import { Alert, Linking, Pressable, ScrollView, View } from 'react-native';
import {
  Card,
  Container,
  Icon,
  ListItem,
  Logo,
  Text,
  TopBar,
} from 'components';
import { useTheme } from 'design-system';
import {
  APP_BUILD,
  APP_DESCRIPTION,
  APP_FEATURES,
  APP_VERSION,
  CONTACT_INSTAGRAM_APP_URL,
  CONTACT_INSTAGRAM_HANDLE,
  CONTACT_INSTAGRAM_URL,
} from 'config/app.config';
import { ProfileStackScreenProps } from 'navigation/types';
import { styles } from './about.styles';

// Intenta el deep link nativo (abre el perfil dentro de la app de Instagram) y
// cae a la URL web si Instagram no está instalado.
const openInstagram = async () => {
  try {
    await Linking.openURL(CONTACT_INSTAGRAM_APP_URL);
  } catch {
    try {
      await Linking.openURL(CONTACT_INSTAGRAM_URL);
    } catch {
      Alert.alert('No pudimos abrir Instagram');
    }
  }
};

export const About = ({ navigation }: ProfileStackScreenProps<'About'>) => {
  const t = useTheme();

  const backButton = (
    <Pressable
      hitSlop={t.layout.minHitSlop}
      onPress={() => navigation.goBack()}>
      <Icon name="ChevronLeft" size="L" />
    </Pressable>
  );

  return (
    <Container variant="base" noPadding>
      <TopBar title="Acerca de Koru" leading={backButton} />
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}>
        <View style={styles.brand}>
          <Logo size={56} />
          <Text variant="bodySM" tone="tertiary">
            Versión {APP_VERSION} ({APP_BUILD})
          </Text>
        </View>

        <Text variant="bodyMD" tone="secondary">
          {APP_DESCRIPTION}
        </Text>

        <Card variant="default" style={styles.features}>
          {APP_FEATURES.map(feature => (
            <View key={feature.text} style={styles.feature}>
              <Icon
                name={feature.icon}
                size="L"
                color={t.color.brand.primary}
              />
              <Text variant="bodySM" style={styles.featureText}>
                {feature.text}
              </Text>
            </View>
          ))}
        </Card>

        <View style={styles.contact}>
          <Text variant="overline" tone="tertiary">
            Contacto
          </Text>
          <Card variant="elevated">
            <ListItem
              leading={<Icon name="Instagram" size="L" />}
              title={`@${CONTACT_INSTAGRAM_HANDLE}`}
              subtitle="Escribinos por Instagram"
              trailing={<Icon name="ChevronRight" size="L" />}
              onPress={openInstagram}
            />
          </Card>
        </View>
      </ScrollView>
    </Container>
  );
};
