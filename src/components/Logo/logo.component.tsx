import React from 'react';
import { View } from 'react-native';
import Svg, { Path, Circle } from 'react-native-svg';
import { useTheme } from 'design-system';
import { Text } from 'components/Text/text.component';
import { styles } from './logo.styles';

export type LogoVariant = 'spiral' | 'wordmark';

interface LogoProps {
  variant?: LogoVariant;
  /** Glyph height in px. Wordmark text scales from this. */
  size?: number;
  /** Stroke + glyph color. Defaults to text.primary token. */
  color?: string;
}

const KoruSpiral = ({ size, color }: { size: number; color: string }) => {
  const stroke = size * 0.085;
  return (
    <Svg width={size} height={size} viewBox="0 0 200 200" fill="none">
      <Path
        d="M100 28 C 142 28, 172 58, 172 100 C 172 142, 140 172, 100 172 C 64 172, 38 146, 38 110 C 38 80, 60 58, 90 58 C 116 58, 138 80, 138 106 C 138 128, 122 144, 100 144 C 82 144, 68 130, 68 112 C 68 98, 80 86, 94 86 C 106 86, 116 96, 116 108"
        stroke={color}
        strokeWidth={stroke}
        strokeLinecap="round"
        fill="none"
      />
      <Circle cx="116" cy="108" r={stroke * 0.65} fill={color} />
    </Svg>
  );
};

export const Logo = ({ variant = 'wordmark', size = 56, color }: LogoProps) => {
  const tokens = useTheme();
  const tint = color ?? tokens.color.text.primary;

  if (variant === 'spiral') {
    return <KoruSpiral size={size} color={tint} />;
  }

  return (
    <View style={[styles.wordmark, { gap: size * 0.28 }]}>
      <KoruSpiral size={size} color={tint} />
      <Text
        variant="displayXL"
        family="display"
        style={{
          fontSize: size * 0.78,
          lineHeight: size,
          letterSpacing: -size * 0.02,
          color: tint,
        }}>
        KORU
      </Text>
    </View>
  );
};
