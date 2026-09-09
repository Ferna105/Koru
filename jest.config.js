module.exports = {
  preset: 'react-native',
  // Las libs nativas necesitan sus mocks antes de importar App: desde
  // gesture-handler 2.x el módulo se resuelve con TurboModuleRegistry.getEnforcing,
  // que revienta en Node si no está el jestSetup de la librería.
  setupFiles: [
    './node_modules/react-native-gesture-handler/jestSetup.js',
    './jest.setup.js',
  ],
  moduleNameMapper: {
    '\\.svg$': '<rootDir>/__mocks__/svgMock.js',
  },
  // El preset solo transpila react-native y @react-native/*; el resto del
  // ecosistema publica ESM/TS sin compilar y hay que pasarlo por Babel igual.
  transformIgnorePatterns: [
    'node_modules/(?!(' +
      ['(jest-)?react-native', '@react-native(-community)?', '@react-navigation'].join(
        '|',
      ) +
      '|react-native-.*' +
      ')/)',
  ],
};
