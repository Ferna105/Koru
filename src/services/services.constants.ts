const API_URL = 'http://localhost:8080';

const API_V1 = {
  auth: {
    authenticate: API_URL + '/api/v1/auth/authenticate',
    refreshToken: API_URL + '/api/v1/auth/refreshToken',
  },
  matches: {
    create: API_URL + '/api/v1/matches',
    search: API_URL + '/api/v1/matches/search',
  },
};

export const services = { API_V1 };
