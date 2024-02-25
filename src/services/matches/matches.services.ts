import { services } from '../services.constants';
import { useContext } from 'react';
import { ServiceContext } from 'contexts/service.context';
import {
  MatchesCreateApiResponse,
  MatchesSearchApiResponse,
} from './matches.api.interfaces';
import {
  MatchesCreateServiceParams,
  MatchesCreateServiceResponse,
  MatchesSearchServiceParams,
  MatchesSearchServiceResponse,
} from './matches.services.interfaces';
import {
  mapMatchesCreateApiToService,
  mapMatchesSearchApiToService,
} from './matches.services.mappers';

export const useMatchesService = () => {
  const client = useContext(ServiceContext);

  const search = async ({
    radiusRange,
    sport,
    matchStartDate,
    coordinates,
  }: MatchesSearchServiceParams): Promise<MatchesSearchServiceResponse> => {
    const queryString = `?radiusRange=${radiusRange}&sport=${sport}&matchStartDate=${matchStartDate}&coordinates=${coordinates}`;

    try {
      const response = await client.get<MatchesSearchApiResponse>(
        services.API_V1.matches.search + queryString,
      );

      return mapMatchesSearchApiToService(response.data);
    } catch (error) {
      return { status: 'ERROR', error };
    }
  };

  const create = async ({
    address,
    coordinates,
    matchStart,
    matchStartDate,
    missingPlayers,
    personId,
    sport,
  }: MatchesCreateServiceParams): Promise<MatchesCreateServiceResponse> => {
    try {
      const response = await client.post<MatchesCreateApiResponse>(
        services.API_V1.matches.create,
        {
          coordinates: {
            type: 'Point',
            coordinates: coordinates.split(';').map(coordinate => +coordinate),
          },
          matchStart: matchStart,
          personId: personId,
          sport: sport,
          address: address,
          missingPlayers: missingPlayers,
          matchStartDate: matchStartDate,
        },
      );

      return mapMatchesCreateApiToService(response.data);
    } catch (error) {
      return { status: 'ERROR', error };
    }
  };

  return { search, create };
};
