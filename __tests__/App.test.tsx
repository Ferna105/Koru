/**
 * @format
 */

import 'react-native';
import React from 'react';
import App from '../App';

// Note: import explicitly to use the types shipped with jest.
import {it} from '@jest/globals';

// Note: test renderer must be required after react-native.
import {act, create} from 'react-test-renderer';

it('renders correctly', async () => {
  // `act` async: AuthProvider/UserProvider hidratan desde AsyncStorage en un
  // efecto, y sin esperarlo el estado se actualiza con el entorno ya destruido.
  await act(async () => {
    create(<App />);
  });
});
