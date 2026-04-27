import { ColorValue } from 'react-native';
import { Sizing } from 'utils/sizing';

export enum Icons {
  // Brand
  Google = 'Google',
  // Navigation / chevrons
  ChevronDown = 'ChevronDown',
  ChevronLeft = 'ChevronLeft',
  ChevronRight = 'ChevronRight',
  // Actions
  Plus = 'Plus',
  Search = 'Search',
  Trash = 'Trash',
  Share = 'Share',
  Check = 'Check',
  X = 'X',
  Filter = 'Filter',
  Settings = 'Settings',
  // Status / info
  Star = 'Star',
  StarFilled = 'StarFilled',
  Info = 'Info',
  Alert = 'Alert',
  Timer = 'Timer',
  // Tabs / sections
  Home = 'Home',
  List = 'List',
  Chart = 'Chart',
  User = 'User',
  // Playback / record
  Play = 'Play',
  Record = 'Record',
  Stop = 'Stop',
  // Sport
  Dumbbell = 'Dumbbell',
}

export interface IconProps {
  name: keyof typeof Icons;
  size?: keyof typeof Sizing;
  color?: ColorValue;
  strokeWidth?: number;
}
