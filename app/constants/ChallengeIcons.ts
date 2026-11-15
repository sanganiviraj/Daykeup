import type { AppIconName } from '../components/app-icon/AppIcon';
import { ChallengeType } from '../types';
import { createAlarmString } from './Strings';

export const challengeIcons: Readonly<Record<ChallengeType, AppIconName>> =
  Object.freeze({
    knife: 'sword',
    hockey: 'disc',
    stack: 'brickWall',
    pong: 'circleDot',
    math: 'calculator',
    memory: 'brain',
    pattern: 'activity',
    reaction: 'zap',
    mystery: 'dices',
  });

export const challengeNames: Readonly<Record<ChallengeType, string>> =
  Object.freeze({
    knife: createAlarmString.challengeKnife,
    hockey: createAlarmString.challengeHockey,
    stack: createAlarmString.challengeStack,
    pong: createAlarmString.challengePong,
    math: createAlarmString.challengeMath,
    memory: createAlarmString.challengeMemory,
    pattern: createAlarmString.challengePattern,
    reaction: createAlarmString.challengeReaction,
    mystery: createAlarmString.challengeMystery,
  });
