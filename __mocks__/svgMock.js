/**
 * Los .svg los transforma react-native-svg-transformer, que es un transformer
 * de Metro y no corre bajo Jest: sin este mapeo el import devuelve undefined y
 * <Icon> falla con "Element type is invalid".
 */
const React = require('react');

const SvgMock = React.forwardRef((props, ref) =>
  React.createElement('SvgMock', { ...props, ref }),
);
SvgMock.displayName = 'SvgMock';

module.exports = SvgMock;
module.exports.default = SvgMock;
module.exports.ReactComponent = SvgMock;
