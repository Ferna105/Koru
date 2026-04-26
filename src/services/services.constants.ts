const API_URL = 'http://localhost:8080';

const API_V1 = {
  auth: {
    authenticate: API_URL + '/api/v1/auth/authenticate',
    refreshToken: API_URL + '/api/v1/auth/refreshToken',
  },
};

export const services = { API_V1 };
