import React, { useContext } from 'react';
import { Button, Container } from 'components';
import { AuthContext } from 'contexts/auth.context';
import { HomeTabScreenProps } from 'navigation/types';
import { styles } from './profile.styles';

export const Profile = ({}: HomeTabScreenProps<'Profile'>) => {
  const { setAuthToken } = useContext(AuthContext);
  const onLogout = () => setAuthToken('');

  return (
    <Container style={styles.container}>
      <Button text="Cerrar sesión" type="PRIMARY" onPress={onLogout} />
    </Container>
  );
};
