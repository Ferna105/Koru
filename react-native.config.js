const path = require('path');

module.exports = {
  project: {
    ios: {},
    android: {},
  },
  assets: ['./assets/fonts/'],
  dependencies: {
    // Módulo nativo local (no vive en node_modules): recorta el MP4 del salto
    // antes de compartirlo. Ver modules/koru-video-trim.
    'koru-video-trim': {
      root: path.resolve(__dirname, 'modules/koru-video-trim'),
    },
  },
};
