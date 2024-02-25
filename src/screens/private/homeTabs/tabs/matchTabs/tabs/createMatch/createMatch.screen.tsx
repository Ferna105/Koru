import React, { useState } from 'react';
import { HomeTabSearchTabScreenProps } from 'navigation/types';
import { useServices } from 'services/services.hook';
import { Button, Container, TextInput } from 'components';
import { Alert, View } from 'react-native';
import { styles } from './createMatch.styles';

export const CreateMatch = ({}: HomeTabSearchTabScreenProps<'CreateMatch'>) => {
  const [radiusRange, setRadiusRange] = useState<string>('20000');
  const [sport, setSport] = useState<string>('FUTBOL');
  const [personId, setPersonId] = useState<string>('3');
  const [matchStart, setMatchStart] = useState<string>('24/05/2023 19:00');
  const [matchStartDate, setMatchStartDate] =
    useState<string>('05/03/2023 17:00');
  const [coordinates, setCoordinates] = useState<string>(
    '-32.95466913243046;-60.64163031768299',
  );
  const [address, setAddress] = useState<string>('HOTEL MOTELSA - (SALTO)');
  const [missingPlayers, setMissingPlayers] = useState<string>('2');

  const { matchesService } = useServices();

  const onPressCreateButton = () => {
    matchesService
      .create({
        sport: sport,
        coordinates: coordinates,
        matchStartDate: matchStartDate,
        address: address,
        matchStart: matchStart,
        missingPlayers: missingPlayers,
        personId: personId,
      })
      .then(result => {
        if (result.status === 'SUCCESS') {
          Alert.alert('Búsqueda creada');
        } else {
          Alert.alert('Falló la creación ');
        }
      });
  };

  return (
    <Container style={styles.container} scrollable>
      <View>
        <View style={styles.inputContainer}>
          <TextInput
            placeholder="Coordenadas"
            value={coordinates}
            onChangeText={setCoordinates}
          />
        </View>
        <View style={styles.inputContainer}>
          <TextInput
            placeholder="Fecha del partido"
            value={matchStart}
            onChangeText={setMatchStart}
          />
        </View>

        <View style={styles.inputContainer}>
          <TextInput
            placeholder="ID de persona"
            value={personId}
            onChangeText={setPersonId}
          />
        </View>

        <View style={styles.inputContainer}>
          <TextInput
            placeholder="Radio"
            value={radiusRange}
            onChangeText={setRadiusRange}
          />
        </View>

        <View style={styles.inputContainer}>
          <TextInput
            placeholder="Deporte"
            value={sport}
            onChangeText={setSport}
          />
        </View>

        <View style={styles.inputContainer}>
          <TextInput
            placeholder="Dirección"
            value={address}
            onChangeText={setAddress}
          />
        </View>

        <View style={styles.inputContainer}>
          <TextInput
            placeholder="Jugadores faltantes"
            value={missingPlayers}
            onChangeText={setMissingPlayers}
          />
        </View>

        <View style={styles.inputContainer}>
          <TextInput
            placeholder="Fecha de comienzo del partido"
            value={matchStartDate}
            onChangeText={setMatchStartDate}
          />
        </View>
      </View>
      <Button text="Crear" type="PRIMARY" onPress={onPressCreateButton} />
    </Container>
  );
};
