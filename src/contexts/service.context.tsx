import React, { createContext, PropsWithChildren, useContext } from 'react';
import axios, { AxiosInstance } from 'axios';
import { AuthContext } from './auth.context';

const client = axios.create();

const ServiceContext = createContext<AxiosInstance>(client);

const ServiceProvider: React.FC<PropsWithChildren> = ({ children }) => {
  const { setAuthToken, authToken } = useContext(AuthContext);

  client.interceptors.request.use(request => {
    if (!request.headers.Authorization) {
      request.headers.Authorization = `Bearer ${authToken}`;
    }

    return request;
  });

  client.interceptors.response.use(
    response => {
      return response;
    },
    error => {
      console.log({ interceptoError: error });
      /**
       * TODO: LOGOUT POR SESIÖN EXPIRADA
       */
      if (error?.response?.status === 401) {
        setAuthToken('');
      }
      return Promise.reject(error);
    },
  );

  return (
    <ServiceContext.Provider value={client}>{children}</ServiceContext.Provider>
  );
};

export { ServiceContext, ServiceProvider };
