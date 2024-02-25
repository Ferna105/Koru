export type Coordinates = {
  type: string;
  coordinates: [number, number];
};

export type Person = {
  id: number;
  name: string;
  surname: string;
  email: string;
  stampCreated: null;
  stampUpdated: null;
};

export type Match = {
  id: number;
  address: string;
  coordinates: Coordinates;
  status: string;
  sport: string;
  missingPlayers: number;
  startDate: string;
  endDate: string | null;
  person: Person;
};
