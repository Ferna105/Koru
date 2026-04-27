// Line icon set ported from the Claude Design hand-off bundle
// (koru/project/components.jsx:284-319). All 24px @ stroke 1.75 by default.
// Each export matches the SvgIcon shape `{ default: FunctionComponent<SvgProps> }`
// so it can plug directly into the existing icon.assets.ts pattern.

import React, { FunctionComponent } from 'react';
import Svg, { Circle, Path, Rect, SvgProps } from 'react-native-svg';

const Ico: FunctionComponent<SvgProps & { children: React.ReactNode }> = ({
  width = 24,
  height = 24,
  stroke = 'currentColor',
  strokeWidth = 1.75,
  fill = 'none',
  children,
  ...rest
}) => (
  <Svg
    width={width}
    height={height}
    viewBox="0 0 24 24"
    fill={fill}
    stroke={stroke}
    strokeWidth={strokeWidth}
    strokeLinecap="round"
    strokeLinejoin="round"
    {...rest}>
    {children}
  </Svg>
);

const ChevronDown: FunctionComponent<SvgProps> = props => (
  <Ico {...props}>
    <Path d="m6 9 6 6 6-6" />
  </Ico>
);

const ChevronLeft: FunctionComponent<SvgProps> = props => (
  <Ico {...props}>
    <Path d="m15 18-6-6 6-6" />
  </Ico>
);

const ChevronRight: FunctionComponent<SvgProps> = props => (
  <Ico {...props}>
    <Path d="m9 18 6-6-6-6" />
  </Ico>
);

const Plus: FunctionComponent<SvgProps> = props => (
  <Ico {...props}>
    <Path d="M12 5v14M5 12h14" />
  </Ico>
);

const Star: FunctionComponent<SvgProps> = props => (
  <Ico {...props}>
    <Path d="M12 3l2.7 5.5 6 .9-4.4 4.3 1 6.1L12 17l-5.4 2.8 1-6.1L3.3 9.4l6-.9z" />
  </Ico>
);

// Filled star — fill follows the stroke color (so a single `color` prop drives both).
const StarFilled: FunctionComponent<SvgProps> = props => (
  <Ico fill={(props.stroke as string) ?? 'currentColor'} {...props}>
    <Path d="M12 3l2.7 5.5 6 .9-4.4 4.3 1 6.1L12 17l-5.4 2.8 1-6.1L3.3 9.4l6-.9z" />
  </Ico>
);

const Home: FunctionComponent<SvgProps> = props => (
  <Ico {...props}>
    <Path d="M3 12l9-9 9 9" />
    <Path d="M5 10v10h14V10" />
  </Ico>
);

const List: FunctionComponent<SvgProps> = props => (
  <Ico {...props}>
    <Path d="M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01" />
  </Ico>
);

const Chart: FunctionComponent<SvgProps> = props => (
  <Ico {...props}>
    <Path d="M3 3v18h18" />
    <Path d="M7 14l4-4 3 3 5-7" />
  </Ico>
);

const User: FunctionComponent<SvgProps> = props => (
  <Ico {...props}>
    <Circle cx={12} cy={8} r={4} />
    <Path d="M4 21c0-4 4-7 8-7s8 3 8 7" />
  </Ico>
);

const Play: FunctionComponent<SvgProps> = props => (
  <Ico fill={(props.stroke as string) ?? 'currentColor'} {...props}>
    <Path d="M6 4l14 8-14 8z" />
  </Ico>
);

const Record: FunctionComponent<SvgProps> = props => (
  <Ico {...props}>
    <Circle
      cx={12}
      cy={12}
      r={6}
      fill={(props.stroke as string) ?? 'currentColor'}
    />
  </Ico>
);

const Stop: FunctionComponent<SvgProps> = props => (
  <Ico {...props}>
    <Rect
      x={6}
      y={6}
      width={12}
      height={12}
      rx={1}
      fill={(props.stroke as string) ?? 'currentColor'}
    />
  </Ico>
);

const Search: FunctionComponent<SvgProps> = props => (
  <Ico {...props}>
    <Circle cx={11} cy={11} r={7} />
    <Path d="m20 20-3-3" />
  </Ico>
);

const Trash: FunctionComponent<SvgProps> = props => (
  <Ico {...props}>
    <Path d="M3 6h18M8 6V4h8v2M6 6l1 14h10l1-14" />
  </Ico>
);

const Share: FunctionComponent<SvgProps> = props => (
  <Ico {...props}>
    <Path d="M4 12v8h16v-8M16 6l-4-4-4 4M12 2v14" />
  </Ico>
);

const Check: FunctionComponent<SvgProps> = props => (
  <Ico {...props}>
    <Path d="m5 12 5 5L20 7" />
  </Ico>
);

const X: FunctionComponent<SvgProps> = props => (
  <Ico {...props}>
    <Path d="M6 6l12 12M18 6 6 18" />
  </Ico>
);

const Info: FunctionComponent<SvgProps> = props => (
  <Ico {...props}>
    <Circle cx={12} cy={12} r={9} />
    <Path d="M12 8v.01M12 11v5" />
  </Ico>
);

const Alert: FunctionComponent<SvgProps> = props => (
  <Ico {...props}>
    <Path d="M12 3 2 21h20Z" />
    <Path d="M12 10v5M12 18v.01" />
  </Ico>
);

const Timer: FunctionComponent<SvgProps> = props => (
  <Ico {...props}>
    <Circle cx={12} cy={13} r={8} />
    <Path d="M12 9v4l2 2M9 2h6" />
  </Ico>
);

const Filter: FunctionComponent<SvgProps> = props => (
  <Ico {...props}>
    <Path d="M3 5h18l-7 9v6l-4-2v-4Z" />
  </Ico>
);

const Settings: FunctionComponent<SvgProps> = props => (
  <Ico {...props}>
    <Circle cx={12} cy={12} r={3} />
    <Path d="M19 12a7 7 0 0 0-.1-1.2l2-1.5-2-3.4-2.3.9a7 7 0 0 0-2-1.2L14 3h-4l-.5 2.6a7 7 0 0 0-2 1.2L5.1 6 3 9.4l2 1.5a7 7 0 0 0 0 2.4l-2 1.5 2 3.4 2.3-.9a7 7 0 0 0 2 1.2L10 21h4l.5-2.6a7 7 0 0 0 2-1.2l2.4.9 2-3.4-2-1.5c0-.4.1-.8.1-1.2Z" />
  </Ico>
);

const Dumbbell: FunctionComponent<SvgProps> = props => (
  <Ico {...props}>
    <Path d="M2 12h2M22 12h-2M5 7v10M19 7v10M5 12h14" />
  </Ico>
);

// Wrap in `{ default }` so they match the SvgIcon shape used by icon.assets.ts.
const wrap = (C: FunctionComponent<SvgProps>) => ({ default: C });

export const lineIcons = {
  ChevronDown: wrap(ChevronDown),
  ChevronLeft: wrap(ChevronLeft),
  ChevronRight: wrap(ChevronRight),
  Plus: wrap(Plus),
  Star: wrap(Star),
  StarFilled: wrap(StarFilled),
  Home: wrap(Home),
  List: wrap(List),
  Chart: wrap(Chart),
  User: wrap(User),
  Play: wrap(Play),
  Record: wrap(Record),
  Stop: wrap(Stop),
  Search: wrap(Search),
  Trash: wrap(Trash),
  Share: wrap(Share),
  Check: wrap(Check),
  X: wrap(X),
  Info: wrap(Info),
  Alert: wrap(Alert),
  Timer: wrap(Timer),
  Filter: wrap(Filter),
  Settings: wrap(Settings),
  Dumbbell: wrap(Dumbbell),
};
