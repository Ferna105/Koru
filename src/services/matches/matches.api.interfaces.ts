export interface MatchesSearchApiResponse {
  _embedded: {
    matches: Array<{
      id: number;
      address: string;
      coordinates: {
        type: string;
        coordinates: [number, number];
      };
      startDate: string;
      endDate: null;
      person: {
        id: number;
        name: string;
        surname: string;
        email: string;
        stampCreated: null;
        stampUpdated: null;
      };
      missingPlayers: number;
      status: string;
      sport: string;
      _links: {
        self: {
          href: string;
        };
        matches: {
          href: string;
        };
      };
    }>;
  };
  _links: {
    self: {
      href: string;
    };
  };
}

export interface MatchesCreateApiResponse {} //TODO
