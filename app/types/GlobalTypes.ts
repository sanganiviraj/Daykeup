import { ReactNode } from 'react';
import { StyleProp, TextStyle, ViewStyle } from 'react-native';

export type ChallengeType =
  | 'knife'
  | 'hockey'
  | 'stack'
  | 'pong'
  | 'truck'
  | 'duel'
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
  bestStreak: number;
  // Local date (YYYY-MM-DD) tracking began; days before it are never "missed".
  trackingSince?: string;
  // Local dates (YYYY-MM-DD) on which the wake-up challenge was completed.
  wakeHistory: Record<string, true>;
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
  adjustsFontSizeToFit?: boolean;
  minimumFontScale?: number;
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

export interface GameTimerBadgeProps {
  remainingSeconds: number;
}

export type RootStackParamList = {
  OnboardingScreen: undefined;
  PermissionsScreen: undefined;
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
  TruckGameScreen: { isWakeUpChallenge?: boolean; alarmId?: string } | undefined;
  DuelGameScreen: { isWakeUpChallenge?: boolean; alarmId?: string } | undefined;
  SuccessScreen: { earnedXp?: number; streak?: number } | undefined;
  FailureScreen: { reason?: string; alarmId?: string } | undefined;
  ProfileScreen: undefined;
};

type OnboardingIconName = import('../components/app-icon/AppIcon').AppIconName;

export type AgeBracket = '18-24' | '25-34' | '35-44' | '45+';
export type WakeStyle = 'heavySleeper' | 'snoozer' | 'momentum';
export type OnboardingMission = Extract<
  ChallengeType,
  'math' | 'memory' | 'knife' | 'hockey' | 'stack' | 'pong'
>;

export interface OnboardingState {
  name: string;
  ageBracket: AgeBracket;
  wakeStyle: WakeStyle;
  wakeMinutes: number; // minutes since midnight
  repeatDays: number[]; // 0: Mon ... 6: Sun
  mission: OnboardingMission;
  difficulty: ChallengeDifficulty;
  smartNotifications: boolean;
}

export interface OnboardingAgeOption {
  key: AgeBracket;
  label: string;
}

export interface OnboardingWakeStyleOption {
  key: WakeStyle;
  icon: OnboardingIconName;
  title: string;
  subtitle: string;
  difficulty: ChallengeDifficulty;
}

export interface OnboardingMissionOption {
  key: OnboardingMission;
  tag: string;
  sample: string;
}

export interface OnboardingFeatureOption {
  icon: OnboardingIconName;
  title: string;
  subtitle: string;
}

export interface OnboardingFooterConfig {
  title: string;
  icon: OnboardingIconName;
}

export interface AnimatedEntranceProps {
  children: ReactNode;
  delay?: number;
  offsetY?: number;
  duration?: number;
  style?: StyleProp<ViewStyle>;
}

export interface FloatingViewProps {
  children: ReactNode;
  amplitude?: number;
  duration?: number;
  style?: StyleProp<ViewStyle>;
}

export interface PulseDotProps {
  color?: string;
  size?: number;
}

export type InfoPillTone = 'amber' | 'purple' | 'white' | 'dark';

export interface InfoPillProps {
  text: string;
  icon?: OnboardingIconName;
  tone?: InfoPillTone;
  style?: StyleProp<ViewStyle>;
  testID?: string;
}

export interface OnboardingHeaderProps {
  step: number;
  totalSteps: number;
  onBackPress: () => void;
  onSkipPress: () => void;
}

export interface OnboardingFooterProps {
  title: string;
  iconName: OnboardingIconName;
  onPress: () => void;
  disabled?: boolean;
  testID?: string;
}

export interface SelectionCheckProps {
  selected: boolean;
  size?: number;
  style?: StyleProp<ViewStyle>;
}

export interface SelectableCardProps {
  selected: boolean;
  onPress: () => void;
  children: ReactNode;
  accessibilityLabel: string;
  accessibilityRole?: 'radio' | 'button' | 'checkbox';
  style?: StyleProp<ViewStyle>;
  contentStyle?: StyleProp<ViewStyle>;
  selectedBackgroundColor?: string;
  unselectedBackgroundColor?: string;
  selectedBorderColor?: string;
  unselectedBorderColor?: string;
  testID?: string;
}

export interface SegmentedControlProps {
  options: readonly string[];
  selectedIndex: number;
  onChange: (index: number) => void;
  testID?: string;
}

