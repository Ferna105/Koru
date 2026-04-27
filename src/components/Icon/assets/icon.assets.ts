import { FunctionComponent } from 'react';
import { SvgProps } from 'react-native-svg';
import { lineIcons } from '../Icons';

interface SvgIcon {
  default: FunctionComponent<SvgProps>;
}

// Brand asset (file-loaded via react-native-svg-transformer).
export const Google = require('./google.svg') as SvgIcon;

// Inline JSX line icons from the Koru design system.
export const {
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Plus,
  Star,
  StarFilled,
  Home,
  List,
  Chart,
  User,
  Play,
  Record,
  Stop,
  Search,
  Trash,
  Share,
  Check,
  X,
  Info,
  Alert,
  Timer,
  Filter,
  Settings,
  Dumbbell,
} = lineIcons;
