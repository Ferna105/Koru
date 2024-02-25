import React, { useState } from 'react';
import { Button, Container, Text, TextInput } from 'components';
import { HomeTabSearchTabScreenProps } from 'navigation/types';
import { Alert, View } from 'react-native';
import { styles } from './searchMatch.styles';
import { useServices } from 'services/services.hook';
import { Match } from 'services/services.domain';

export const SearchMatch = ({}: HomeTabSearchTabScreenProps<'SearchMatch'>) => {
  const [radiusRange, setRadiusRange] = useState<string>('20000');
  const [sport, setSport] = useState<string>('FUTBOL');
  const [matchStartDate, setMatchStartDate] =
    useState<string>('05/05/2021 19:00');
  const [coordinates, setCoordinates] = useState<string>('');

  const [matches, setMatches] = useState<Array<Match>>([]);

  const { matchesService } = useServices();

  const onPressSearchButton = () => {
    matchesService
      .search({
        sport: sport,
        coordinates: coordinates,
        matchStartDate: matchStartDate,
        radiusRange: radiusRange,
      })
      .then(result => {
        if (result.status === 'SUCCESS') {
          if (result.data?.length) {
            setMatches(result.data);
          }
        } else {
          Alert.alert('Falló la búsqueda');
        }
      });
  };

  return (
    <Container style={styles.container}>
      <View>
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
            placeholder="Fecha de comienzo del partido"
            value={matchStartDate}
            onChangeText={setMatchStartDate}
          />
        </View>

        <View style={styles.inputContainer}>
          <TextInput
            placeholder="Coordenadas"
            value={coordinates}
            onChangeText={setCoordinates}
          />
        </View>
      </View>
      <View>
        {matches.map((match, index) => (
          <View key={index}>
            <Text>{match.address}</Text>
          </View>
        ))}
      </View>
      <Button text="Buscar" type="PRIMARY" onPress={onPressSearchButton} />
    </Container>
  );
};
