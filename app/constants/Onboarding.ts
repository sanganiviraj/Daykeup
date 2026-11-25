import {
  AgeBracket,
  ChallengeDifficulty,
  OnboardingAgeOption,
  OnboardingFeatureOption,
  OnboardingFooterConfig,
  OnboardingMissionOption,
  OnboardingState,
  OnboardingWakeStyleOption,
} from '../types';
import { getTodayDayIndex } from '../utils/GlobalFunctions';
import { createAlarmString, onboardingString } from './Strings';

export const ONBOARDING_TOTAL_STEPS = 5;
export const ONBOARDING_LAST_STEP = ONBOARDING_TOTAL_STEPS - 1;

export const WAKE_STEP_MINUTES = 15;
export const TARGET_SLEEP_MINUTES = 7 * 60 + 45;

export const defaultOnboardingState: Readonly<OnboardingState> = Object.freeze({
  name: '',
  ageBracket: '18-24' as AgeBracket,
  wakeStyle: 'snoozer',
  wakeMinutes: 6 * 60 + 30,
  repeatDays: [getTodayDayIndex()],
  mission: 'math',
  difficulty: 'medium',
  smartNotifications: true,
});

export const onboardingAgeOptions: ReadonlyArray<OnboardingAgeOption> =
  Object.freeze([
    { key: '18-24', label: onboardingString.age1824 },
    { key: '25-34', label: onboardingString.age2534 },
    { key: '35-44', label: onboardingString.age3544 },
    { key: '45+', label: onboardingString.age45Plus },
  ]);

export const onboardingWakeStyleOptions: ReadonlyArray<OnboardingWakeStyleOption> =
  Object.freeze([
    {
      key: 'heavySleeper',
      icon: 'bedDouble',
      title: onboardingString.heavySleeperTitle,
      subtitle: onboardingString.heavySleeperSub,
      difficulty: 'hard',
    },
    {
      key: 'snoozer',
      icon: 'alarmClock',
      title: onboardingString.snoozerTitle,
      subtitle: onboardingString.snoozerSub,
      difficulty: 'medium',
    },
    {
      key: 'momentum',
      icon: 'coffee',
      title: onboardingString.momentumTitle,
      subtitle: onboardingString.momentumSub,
      difficulty: 'easy',
    },
  ]);

export const onboardingMissionOptions: ReadonlyArray<OnboardingMissionOption> =
  Object.freeze([
    { key: 'math', tag: onboardingString.tagMath, sample: createAlarmString.subMath },
    { key: 'memory', tag: onboardingString.tagMemory, sample: createAlarmString.memorySample },
    { key: 'knife', tag: onboardingString.tagKnife, sample: createAlarmString.subKnife },
    { key: 'hockey', tag: onboardingString.tagHockey, sample: createAlarmString.subHockey },
    { key: 'stack', tag: onboardingString.tagStack, sample: createAlarmString.subStack },
    { key: 'pong', tag: onboardingString.tagPong, sample: createAlarmString.subPong },
  ]);

export const onboardingDifficultyOrder: ReadonlyArray<ChallengeDifficulty> =
  Object.freeze(['easy', 'medium', 'hard']);

export const onboardingDifficultyLabels: ReadonlyArray<string> = Object.freeze([
  onboardingString.intensityGentle,
  onboardingString.intensityMedium,
  onboardingString.intensityUnstoppable,
]);

export const onboardingDifficultyHints: Readonly<Record<ChallengeDifficulty, string>> =
  Object.freeze({
    easy: onboardingString.hintEasy,
    medium: onboardingString.hintMedium,
    hard: onboardingString.hintHard,
  });

export const onboardingDifficultyNames: Readonly<Record<ChallengeDifficulty, string>> =
  Object.freeze({
    easy: createAlarmString.easy,
    medium: createAlarmString.medium,
    hard: createAlarmString.hard,
  });

export const onboardingFeatures: ReadonlyArray<OnboardingFeatureOption> =
  Object.freeze([
    {
      icon: 'zap',
      title: onboardingString.featureMissionsTitle,
      subtitle: onboardingString.featureMissionsSub,
    },
    {
      icon: 'flame',
      title: onboardingString.featureStreakTitle,
      subtitle: onboardingString.featureStreakSub,
    },
    {
      icon: 'sunrise',
      title: onboardingString.featureCircadianTitle,
      subtitle: onboardingString.featureCircadianSub,
    },
  ]);

// One entry per step: the primary call-to-action shown in the shared footer.
export const onboardingFooters: ReadonlyArray<OnboardingFooterConfig> =
  Object.freeze([
    { title: onboardingString.welcomeCta, icon: 'arrowRight' },
    { title: onboardingString.rhythmCta, icon: 'arrowRight' },
    { title: onboardingString.timeCta, icon: 'arrowRight' },
    { title: onboardingString.missionCta, icon: 'arrowRight' },
    { title: onboardingString.readyCta, icon: 'sparkles' },
  ]);
