import React, { FC, memo } from 'react';
import {
  Activity,
  AlarmClock,
  ArrowRight,
  Bell,
  Brain,
  BrickWall,
  Calculator,
  Check,
  ChevronLeft,
  ChevronRight,
  CircleDot,
  Clock,
  Dices,
  Disc,
  Flame,
  Folder,
  Gamepad2,
  Hand,
  HeartCrack,
  House,
  ImagePlus,
  Minus,
  Moon,
  Music,
  PartyPopper,
  Pencil,
  Play,
  Plus,
  Pointer,
  RotateCcw,
  Sparkles,
  Square,
  Sun,
  Sword,
  Trash2,
  Trophy,
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
  bell: Bell,
  brain: Brain,
  brickWall: BrickWall,
  calculator: Calculator,
  check: Check,
  chevronLeft: ChevronLeft,
  chevronRight: ChevronRight,
  circleDot: CircleDot,
  clock: Clock,
  dices: Dices,
  disc: Disc,
  flame: Flame,
  folder: Folder,
  gamepad: Gamepad2,
  hand: Hand,
  heartCrack: HeartCrack,
  house: House,
  imagePlus: ImagePlus,
  minus: Minus,
  moon: Moon,
  music: Music,
  partyPopper: PartyPopper,
  pencil: Pencil,
  play: Play,
  plus: Plus,
  pointer: Pointer,
  rotateCcw: RotateCcw,
  sparkles: Sparkles,
  square: Square,
  sun: Sun,
  sword: Sword,
  trash: Trash2,
  trophy: Trophy,
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
