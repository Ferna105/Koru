import { ServiceResponse } from 'services/services.interfaces';

export interface AuthAuthenticateServiceParams {
  username?: string;
  password?: string;
  idToken?: string;
}

export interface AuthAuthenticateServiceResponse extends ServiceResponse {
  data?: { authToken: string; refreshToken: string };
}

export interface AuthRefreshTokenServiceParams {} //TODO

export interface AuthRefreshTokenServiceResponse extends ServiceResponse {
  data?: any; //TODO
}
