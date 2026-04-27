// Koru Design System — single source of truth.
// Ported from the Claude Design hand-off bundle (combat variation, dark only).

export const tokens = {
  color: {
    bg: {
      base: '#0A0A0B',
      surface: '#141416',
      elevated: '#1C1C1F',
      sunken: '#050506',
      overlay: 'rgba(0,0,0,0.72)',
    },
    brand: {
      primary: '#F2C200',
      primaryHover: '#FFD21A',
      primaryPressed: '#D9AE00',
      primaryDim: '#3A2E00',
      danger: '#E1352D',
      dangerHover: '#F04A42',
      dangerPressed: '#B5251F',
      dangerDim: '#3D0E0C',
    },
    semantic: {
      success: '#3FBF7F',
      warning: '#F2A30F',
      info: '#4F8FF7',
    },
    text: {
      primary: '#F5F5F4',
      secondary: '#A8A8A6',
      tertiary: '#6E6E6C',
      disabled: '#3F3F3D',
      onBrand: '#0A0A0B',
      onDanger: '#FFFFFF',
      link: '#F2C200',
    },
    border: {
      subtle: '#1F1F22',
      default: '#2A2A2E',
      strong: '#3A3A3F',
      focus: '#F2C200',
    },
    white: '#FFFFFF',
    black: '#000000',
    transparent: 'transparent',
  },

  spacing: {
    none: 0,
    xxs: 2,
    xs: 4,
    sm: 8,
    md: 12,
    lg: 16,
    xl: 20,
    '2xl': 24,
    '3xl': 32,
    '4xl': 40,
    '5xl': 48,
    '6xl': 64,
    '7xl': 80,
  },

  radius: {
    none: 0,
    xs: 4,
    sm: 8,
    md: 12,
    lg: 16,
    xl: 20,
    '2xl': 28,
    full: 9999,
  },

  font: {
    // PostScript names (what the OS exposes once TTFs are linked via
    // react-native-asset). The bundle uses Expo aliases; we don't.
    family: {
      display: 'Archivo-Black',
      body: 'Manrope-Regular',
      mono: 'JetBrainsMono-Medium',
    },
    weight: {
      regular: '400',
      medium: '500',
      semibold: '600',
      bold: '700',
      heavy: '800',
      black: '900',
    },
  },

  type: {
    displayXL: {
      fontSize: 56,
      lineHeight: 60,
      letterSpacing: -1.5,
      fontWeight: '900',
      family: 'display',
    },
    displayLG: {
      fontSize: 44,
      lineHeight: 48,
      letterSpacing: -1.2,
      fontWeight: '900',
      family: 'display',
    },
    displayMD: {
      fontSize: 36,
      lineHeight: 40,
      letterSpacing: -0.8,
      fontWeight: '800',
      family: 'display',
    },
    displaySM: {
      fontSize: 28,
      lineHeight: 32,
      letterSpacing: -0.5,
      fontWeight: '800',
      family: 'display',
    },

    headingLG: {
      fontSize: 24,
      lineHeight: 30,
      letterSpacing: -0.3,
      fontWeight: '700',
      family: 'body',
    },
    headingMD: {
      fontSize: 20,
      lineHeight: 26,
      letterSpacing: -0.2,
      fontWeight: '700',
      family: 'body',
    },
    headingSM: {
      fontSize: 17,
      lineHeight: 22,
      letterSpacing: -0.1,
      fontWeight: '700',
      family: 'body',
    },

    bodyLG: {
      fontSize: 17,
      lineHeight: 26,
      letterSpacing: 0,
      fontWeight: '400',
      family: 'body',
    },
    bodyMD: {
      fontSize: 15,
      lineHeight: 22,
      letterSpacing: 0,
      fontWeight: '400',
      family: 'body',
    },
    bodySM: {
      fontSize: 13,
      lineHeight: 18,
      letterSpacing: 0.1,
      fontWeight: '400',
      family: 'body',
    },

    label: {
      fontSize: 13,
      lineHeight: 16,
      letterSpacing: 0.4,
      fontWeight: '600',
      family: 'body',
    },
    caption: {
      fontSize: 11,
      lineHeight: 14,
      letterSpacing: 0.3,
      fontWeight: '500',
      family: 'body',
    },
    overline: {
      fontSize: 11,
      lineHeight: 14,
      letterSpacing: 1.5,
      fontWeight: '700',
      family: 'body',
      textTransform: 'uppercase',
    },
    button: {
      fontSize: 15,
      lineHeight: 20,
      letterSpacing: 0.2,
      fontWeight: '700',
      family: 'body',
    },

    monoLG: {
      fontSize: 18,
      lineHeight: 24,
      letterSpacing: 0,
      fontWeight: '500',
      family: 'mono',
    },
    monoMD: {
      fontSize: 14,
      lineHeight: 20,
      letterSpacing: 0,
      fontWeight: '500',
      family: 'mono',
    },
  },

  elevation: {
    none: {
      shadowColor: 'transparent',
      shadowOpacity: 0,
      shadowRadius: 0,
      shadowOffset: { width: 0, height: 0 },
      elevation: 0,
    },
    sm: {
      shadowColor: '#000',
      shadowOpacity: 0.32,
      shadowRadius: 6,
      shadowOffset: { width: 0, height: 2 },
      elevation: 2,
    },
    md: {
      shadowColor: '#000',
      shadowOpacity: 0.42,
      shadowRadius: 14,
      shadowOffset: { width: 0, height: 6 },
      elevation: 6,
    },
    lg: {
      shadowColor: '#000',
      shadowOpacity: 0.55,
      shadowRadius: 28,
      shadowOffset: { width: 0, height: 14 },
      elevation: 14,
    },
    glow: {
      shadowColor: '#F2C200',
      shadowOpacity: 0.45,
      shadowRadius: 24,
      shadowOffset: { width: 0, height: 0 },
      elevation: 0,
    },
  },

  motion: {
    duration: { fast: 120, base: 200, slow: 320, deliberate: 480 },
    // RN Easing.bezier(...) takes 4 numbers; tuples here, not CSS strings.
    easing: {
      standard: [0.2, 0, 0, 1],
      enter: [0, 0, 0, 1],
      exit: [0.4, 0, 1, 1],
    },
  },

  layout: {
    screenPadding: 20,
    maxContentWidth: 480,
    bottomNavHeight: 64,
    topBarHeight: 56,
    minHitSlop: 44,
  },

  opacity: {
    disabled: 0.4,
    pressed: 0.85,
    overlay: 0.72,
  },
} as const;

export type Tokens = typeof tokens;

export type TypeVariant = keyof Tokens['type'];
export type FontFamily = keyof Tokens['font']['family'];
export type ColorBg = keyof Tokens['color']['bg'];
export type ColorText = keyof Tokens['color']['text'];
export type ColorBorder = keyof Tokens['color']['border'];
export type Spacing = keyof Tokens['spacing'];
export type Radius = keyof Tokens['radius'];
export type Elevation = keyof Tokens['elevation'];
