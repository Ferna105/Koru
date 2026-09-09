import React, { useContext, useState } from 'react';
import { Alert, View } from 'react-native';
import { Button, Container, Logo, Text } from 'components';
import { AuthContext } from 'contexts/auth.context';
import { UserContext } from 'contexts/user.context';
import { googleService } from 'services/google/google.services';
import { RootStackScreenProps } from 'navigation/types';
import { styles } from './login.styles';

export const Login = ({}: RootStackScreenProps<'Login'>) => {
  const { setAuthToken } = useContext(AuthContext);
  const { setUser } = useContext(UserContext);
  const [loading, setLoading] = useState(false);

  const onPressGoogleBtn = async () => {
    setLoading(true);
    const result = await googleService.signIn();
    setLoading(false);

    switch (result.status) {
      case 'SUCCESS':
        setUser(result.profile);
        // Sin backend todavía: el id de Google hace de marca de sesión para el
        // gate de `AuthContext` (cualquier string no vacío = logueado).
        setAuthToken(result.profile.id);
        break;
      case 'CANCELLED':
        break;
      case 'NOT_CONFIGURED':
        Alert.alert(
          'Google Sign-In sin configurar',
          'Faltan los client IDs en config/google.config.ts. Ver GOOGLE_SIGNIN_SETUP.md.',
        );
        break;
      default:
        Alert.alert(
          'No pudimos iniciar sesión',
          'Revisá tu conexión y volvé a intentar.',
        );
    }
  };

  return (
    <Container variant="base" style={styles.container}>
      <View style={styles.brand}>
        <Logo size={64} />
        <Text variant="bodyMD" tone="secondary" style={styles.tagline}>
          Medí. Entrená. Repetí.
        </Text>
      </View>

      <View style={styles.form}>
        <Text variant="headingLG" style={styles.heading}>
          Iniciar sesión
        </Text>
        <Text variant="bodyMD" tone="secondary" style={styles.helper}>
          Entrá con tu cuenta de Google para guardar tus tests y ver tu
          historial.
        </Text>

        <Button
          variant="secondary"
          iconLeft="Google"
          loading={loading}
          onPress={onPressGoogleBtn}>
          Continuar con Google
        </Button>
      </View>
    </Container>
  );
};
