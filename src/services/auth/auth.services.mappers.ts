import {
  AuthAuthenticateApiResponse,
  AuthRefreshTokenApiResponse,
} from './auth.api.interfaces';
import {
  AuthAuthenticateServiceResponse,
  AuthRefreshTokenServiceResponse,
} from './auth.services.interfaces';

export const mapAuthAuthenticateApiToService = (
  apiResponse: AuthAuthenticateApiResponse,
): AuthAuthenticateServiceResponse => {
  return {
    data: {
      authToken: apiResponse.access_token,
      refreshToken: apiResponse.refresh_token,
    },
    status: 'SUCCESS',
  };
};

export const mapAuthRefreshTokenApiToService = (
  apiResponse: AuthRefreshTokenApiResponse,
): AuthRefreshTokenServiceResponse => {
  console.log(apiResponse);
  return {
    data: {}, //TODO
    status: 'SUCCESS',
  };
};
