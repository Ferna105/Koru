import React, { useContext } from 'react';
import { View } from 'react-native';
import {
  Button,
  Container,
  Icon,
  ListItem,
  Separator,
  TopBar,
} from 'components';
import { AuthContext } from 'contexts/auth.context';
import { HomeTabScreenProps } from 'navigation/types';
import { styles } from './profile.styles';

export const Profile = ({}: HomeTabScreenProps<'Profile'>) => {
  const { setAuthToken } = useContext(AuthContext);
  const onLogout = () => setAuthToken('');

  return (
    <Container variant="base" noPadding>
      <TopBar title="Cuenta" />
      <View style={styles.content}>
        <View style={styles.list}>
          <ListItem
            leading={<Icon name="User" size="L" />}
            title="Mi perfil"
            subtitle="Datos personales y preferencias"
            trailing={<Icon name="ChevronRight" size="L" />}
          />
          <Separator tone="subtle" />
          <ListItem
            leading={<Icon name="Settings" size="L" />}
            title="Ajustes"
            subtitle="Notificaciones, unidades, idioma"
            trailing={<Icon name="ChevronRight" size="L" />}
          />
          <Separator tone="subtle" />
          <ListItem
            leading={<Icon name="Info" size="L" />}
            title="Acerca de Koru"
            subtitle="Versión, créditos y privacidad"
            trailing={<Icon name="ChevronRight" size="L" />}
          />
        </View>

        <Button variant="destructive" fullWidth onPress={onLogout}>
          Cerrar sesión
        </Button>
      </View>
    </Container>
  );
};
