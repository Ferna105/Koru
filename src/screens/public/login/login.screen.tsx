import React, { useContext, useState } from 'react';
import { Container, Text, TextInput } from 'components';
import { Alert, View } from 'react-native';
import { styles } from './login.styles';

// import { GoogleSignin } from '@react-native-google-signin/google-signin';
import { AuthContext } from 'contexts/auth.context';
import { Separator } from 'components/Separator/separator.component';
import { Sizing } from 'utils/sizing';
import { Button } from 'components';
import { useServices } from 'services/services.hook';
import { RootStackScreenProps } from 'navigation/types';

export const Login = ({}: RootStackScreenProps<'Login'>) => {
  const { setAuthToken } = useContext(AuthContext);
  const { authService } = useServices();

  const [username, setUsername] = useState<string>('matias');
  const [password, setPassword] = useState<string>('zapillon');

  // GoogleSignin.configure({
  //   webClientId:
  //     '325980594852-ar53h789aia7pubkrmjr4td26m6b28c2.apps.googleusercontent.com',
  // });

  const onPressLogin = async () => {
    const authResponse = await authService.authenticate({
      username: username,
      password: password,
    });
    if (authResponse.status === 'SUCCESS') {
      console.log({ token: authResponse.data?.authToken });
      setAuthToken(authResponse.data?.authToken ?? '');
    } else {
      Alert.alert('Error al loguearse con credenciales');
    }
  };

  const onPressGoogleBtn = async () => {
    // try {
    //   const { idToken } = await GoogleSignin.signIn();
    //   if (!idToken) {
    //     return;
    //   }
    //   const authResponse = await authService.authenticate({ idToken: idToken });
    //   if (authResponse.status === 'SUCCESS') {
    //     console.log({ token: authResponse.data?.authToken });
    //     setAuthToken(authResponse.data?.authToken ?? '');
    //   } else {
    //     Alert.alert('Error al loguearse con Google');
    //   }
    // } catch (error) {
    //   console.log(error);
    // }
  };

  return (
    <Container style={styles.container}>
      <Text
        fontSize="XXL"
        color="text"
        style={{ marginBottom: Sizing.M }}
        fontWeight="bold">
        Iniciar sesión
      </Text>
      <View style={styles.inputContainer}>
        <TextInput
          autoCapitalize="none"
          value={username}
          autoCorrect={false}
          autoComplete="off"
          onChangeText={setUsername}
          placeholder="Usuario"
        />
      </View>
      <View style={styles.inputContainer}>
        <TextInput
          value={password}
          onChangeText={setPassword}
          placeholder="Contraseña"
          autoCorrect={false}
          autoComplete="off"
          autoCapitalize="none"
          passwordRules={'asd'}
          secureTextEntry
        />
      </View>
      <Button onPress={onPressLogin} text="Iniciar sesión" type="PRIMARY" />
      <Separator />
      <Button
        onPress={onPressGoogleBtn}
        text="Iniciar sesión con Google"
        type="SECONDARY"
        icon="Google"
      />
    </Container>
  );
};
