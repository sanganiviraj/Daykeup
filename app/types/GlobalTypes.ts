import { ReactNode } from 'react';
import { StyleProp, TextStyle, ViewStyle } from 'react-native';

export type ChallengeType =
  | 'knife'
  | 'hockey'
  | 'stack'
  | 'pong'
  | 'math'
  | 'memory'
  | 'pattern'
  | 'reaction'
  | 'mystery';
export type ChallengeDifficulty = 'easy' | 'medium' | 'hard';

export interface AlarmItem {
  id: string;
  hour: string;
  minute: string;
  period: 'AM' | 'PM';
  title: string;
  label?: string;
  enabled: boolean;
  repeatDays: number[]; // 0: Mon, 1: Tue, 2: Wed, 3: Thu, 4: Fri, 5: Sat, 6: Sun
  motivationalImage?: string;
  motivationalQuote: string;
  challengeType: ChallengeType;
  difficulty: ChallengeDifficulty;
  soundUri?: string;
  soundTitle?: string;
  vibrationEnabled?: boolean;
  snoozePenalty?: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface MathOption {
  id: string;
  letter: 'A' | 'B' | 'C' | 'D';
  value: number;
}

export interface MathChallenge {
  id: string;
  num1: number;
  num2: number;
  operator: '+' | '-' | '×';
  question: string;
  options: MathOption[];
  correctAnswer: number;
  timeLimit: number;
}

export interface UserStats {
  name: string;
  level: number;
  xp: number;
  wakePoints: number;
  streak: number;
  wakeUpCompleted: boolean;
  challengeCompleted: boolean;
  morningGoalCompleted: boolean;
}

export interface AlarmCardProps {
  alarm: AlarmItem;
  onPress: () => void;
  onToggle: () => void;
}

export type AppIconSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | number;

export interface AppIconProps {
  name: import('../components/app-icon/AppIcon').AppIconName;
  size?: AppIconSize;
  color?: string;
  strokeWidth?: number;
  style?: StyleProp<ViewStyle>;
  testID?: string;
}

export interface AppTextProps {
  children?: ReactNode;
  style?: StyleProp<TextStyle>;
  numberOfLines?: number;
  accessible?: boolean;
  accessibilityLabel?: string;
  accessibilityRole?: 'header' | 'text' | 'link' | 'none';
  testID?: string;
}

export interface CustomButtonProps {
  title: string;
  onPress: () => void;
  style?: StyleProp<ViewStyle>;
  titleTextStyle?: StyleProp<TextStyle>;
  disabled?: boolean;
  accessible?: boolean;
  accessibilityLabel?: string;
  accessibilityRole?: 'button';
  testID?: string;
  icon?: ReactNode;
}

export interface SafeAreaContainerProps {
  children: ReactNode;
  edges?: ('top' | 'bottom' | 'left' | 'right')[];
  style?: StyleProp<ViewStyle>;
  backgroundColor?: string;
  isDark?: boolean;
}

export interface SwipeToWakeProps {
  onSwipeComplete: () => void;
  style?: StyleProp<ViewStyle>;
  testID?: string;
}

export interface CountdownDialProps {
  totalSeconds: number;
  remainingSeconds: number;
  size?: number;
}

export type RootStackParamList = {
  HomeScreen: { initialTab?: 'main' | 'alarms' } | undefined;
  AlarmsScreen: undefined;
  CreateAlarmScreen: { alarmId?: string } | undefined;
  AlarmRingingScreen: { alarmId?: string } | undefined;
  ChallengeScreen: { alarmId?: string } | undefined;
  GamesHubScreen: undefined;
  KnifeGameScreen: { isWakeUpChallenge?: boolean; alarmId?: string } | undefined;
  HockeyGameScreen: { isWakeUpChallenge?: boolean; alarmId?: string } | undefined;
  StackGameScreen: { isWakeUpChallenge?: boolean; alarmId?: string } | undefined;
  PongGameScreen: { isWakeUpChallenge?: boolean; alarmId?: string } | undefined;
  SuccessScreen: { earnedXp?: number; streak?: number } | undefined;
  FailureScreen: { reason?: string } | undefined;
};

