import React, { FC, memo } from 'react';
import {
  Activity,
  AlarmClock,
  ArrowRight,
  BadgeCheck,
  BedDouble,
  Bell,
  BellRing,
  Brain,
  BrickWall,
  Calculator,
  Check,
  ChevronLeft,
  ChevronRight,
  CircleDot,
  Clock,
  Coffee,
  Dices,
  Disc,
  Truck,
  Swords,
  Flame,
  Folder,
  Gamepad2,
  Hand,
  HeartCrack,
  House,
  ImagePlus,
  Medal,
  Minus,
  Moon,
  Music,
  PartyPopper,
  Pencil,
  Play,
  Plus,
  Pointer,
  Quote,
  RotateCcw,
  ShieldCheck,
  SlidersHorizontal,
  Sparkles,
  Square,
  Star,
  Sun,
  Sunrise,
  Sunset,
  Sword,
  Trash2,
  Trophy,
  User,
  Vibrate,
  Volume2,
  X,
  Zap,
} from 'lucide-react-native';
import { AppIconProps } from '../../types';
import { Colors } from '../../theme/Colors';
import { ICON_STROKE_WIDTH, iconSizes } from './AppIconStyle';

// Single registry of every icon used in the app. Add new icons here so the
// whole app keeps one consistent icon set.
export const icons = Object.freeze({
  activity: Activity,
  alarmClock: AlarmClock,
  arrowRight: ArrowRight,
  badgeCheck: BadgeCheck,
  bedDouble: BedDouble,
  bell: Bell,
  bellRing: BellRing,
  brain: Brain,
  brickWall: BrickWall,
  calculator: Calculator,
  check: Check,
  chevronLeft: ChevronLeft,
  chevronRight: ChevronRight,
  circleDot: CircleDot,
  clock: Clock,
  coffee: Coffee,
  dices: Dices,
  disc: Disc,
  truck: Truck,
  swords: Swords,
  flame: Flame,
  folder: Folder,
  gamepad: Gamepad2,
  hand: Hand,
  heartCrack: HeartCrack,
  house: House,
  imagePlus: ImagePlus,
  medal: Medal,
  minus: Minus,
  moon: Moon,
  music: Music,
  partyPopper: PartyPopper,
  pencil: Pencil,
  play: Play,
  plus: Plus,
  pointer: Pointer,
  quote: Quote,
  rotateCcw: RotateCcw,
  shieldCheck: ShieldCheck,
  slidersHorizontal: SlidersHorizontal,
  sparkles: Sparkles,
  square: Square,
  star: Star,
  sun: Sun,
  sunrise: Sunrise,
  sunset: Sunset,
  sword: Sword,
  trash: Trash2,
  trophy: Trophy,
  user: User,
  vibrate: Vibrate,
  volume: Volume2,
  x: X,
  zap: Zap,
});

export type AppIconName = keyof typeof icons;

const AppIcon: FC<AppIconProps> = ({
  name,
  size = 'md',
  color = Colors.textMain,
  strokeWidth = ICON_STROKE_WIDTH,
  style,
  testID,
}) => {
  const Icon = icons[name];
  const iconSize = typeof size === 'number' ? size : iconSizes[size];

  return (
    <Icon
      size={iconSize}
      color={color}
      strokeWidth={strokeWidth}
      style={style}
      testID={testID}
    />
  );
};

export default memo(AppIcon);
