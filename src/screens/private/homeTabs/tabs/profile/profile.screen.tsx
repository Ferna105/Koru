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
import { UserContext } from 'contexts/user.context';
import { googleService } from 'services/google/google.services';
import { ProfileStackScreenProps } from 'navigation/types';
import { styles } from './profile.styles';

export const Profile = ({
  navigation,
}: ProfileStackScreenProps<'ProfileHome'>) => {
  const { setAuthToken } = useContext(AuthContext);
  const { setUser } = useContext(UserContext);

  const onLogout = async () => {
    await googleService.signOut();
    setUser(null);
    setAuthToken('');
  };

  return (
    <Container variant="base" noPadding>
      <TopBar title="Cuenta" />
      <View style={styles.content}>
        <View style={styles.list}>
          <ListItem
            leading={<Icon name="User" size="L" />}
            title="Mi perfil"
            subtitle="Tus datos de Google"
            trailing={<Icon name="ChevronRight" size="L" />}
            onPress={() => navigation.navigate('MyProfile')}
          />
          <Separator tone="subtle" />
          <ListItem
            leading={<Icon name="Info" size="L" />}
            title="Acerca de Koru"
            subtitle="Qué hace la app, versión y contacto"
            trailing={<Icon name="ChevronRight" size="L" />}
            onPress={() => navigation.navigate('About')}
          />
        </View>

        <Button variant="destructive" fullWidth onPress={onLogout}>
          Cerrar sesión
        </Button>
      </View>
    </Container>
  );
};
