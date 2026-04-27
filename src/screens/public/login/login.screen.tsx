import React, { useContext, useState } from 'react';
import { Alert, View } from 'react-native';
import {
  Button,
  Container,
  Logo,
  Separator,
  Text,
  TextInput,
} from 'components';
import { AuthContext } from 'contexts/auth.context';
import { useServices } from 'services/services.hook';
import { RootStackScreenProps } from 'navigation/types';
import { styles } from './login.styles';

export const Login = ({}: RootStackScreenProps<'Login'>) => {
  const { setAuthToken } = useContext(AuthContext);
  const { authService } = useServices();

  const [username, setUsername] = useState<string>('matias');
  const [password, setPassword] = useState<string>('zapillon');

  const onPressLogin = async () => {
    const authResponse = await authService.authenticate({
      username: username,
      password: password,
    });
    if (authResponse.status === 'SUCCESS') {
      setAuthToken(authResponse.data?.authToken ?? '');
    } else {
      Alert.alert('Error al loguearse con credenciales');
    }
  };

  const onPressGoogleBtn = async () => {
    setAuthToken('TEST');
  };

  return (
    <Container variant="base" style={styles.container}>
      <View style={styles.brand}>
        <Logo size={64} />
        <Text variant="bodyMD" tone="secondary" style={styles.tagline}>
          Mide. Entrena. Repetí.
        </Text>
      </View>

      <View style={styles.form}>
        <Text variant="headingLG" style={styles.heading}>
          Iniciar sesión
        </Text>

        <View style={styles.field}>
          <TextInput
            label="Usuario"
            iconLeft="User"
            autoCapitalize="none"
            value={username}
            autoCorrect={false}
            autoComplete="off"
            onChangeText={setUsername}
            placeholder="Tu usuario"
          />
        </View>
        <View style={styles.field}>
          <TextInput
            label="Contraseña"
            value={password}
            onChangeText={setPassword}
            placeholder="Tu contraseña"
            autoCorrect={false}
            autoComplete="off"
            autoCapitalize="none"
            secureTextEntry
          />
        </View>

        <Button variant="primary" iconLeft="User" onPress={onPressLogin}>
          Iniciar sesión
        </Button>

        <View style={styles.separator}>
          <Separator tone="subtle" />
        </View>

        <Button
          variant="secondary"
          iconLeft="Google"
          onPress={onPressGoogleBtn}>
          Continuar con Google
        </Button>
      </View>
    </Container>
  );
};
