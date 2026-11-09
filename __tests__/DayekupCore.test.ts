import { generateMathChallenge } from '../app/utils';
import alarmReducer, {
  toggleAlarm,
  saveAlarm,
  deleteAlarm,
} from '../app/redux/slices/alarm-slice/AlarmSlice';
import gamificationReducer, {
  awardWakePoints,
  incrementStreak,
  applySnoozePenalty,
  completeProtocolItem,
} from '../app/redux/slices/gamification-slice/GamificationSlice';
import { AlarmService } from '../app/services';
import { AlarmItem } from '../app/types';

describe('Math Challenge Engine', () => {
  it('generates a valid math challenge with 4 unique options and exactly one correct answer', () => {
    const challenge = generateMathChallenge();

    expect(challenge.options).toHaveLength(4);
    expect(challenge.correctAnswer).toBe(challenge.num1 + challenge.num2);

    const matchingOptions = challenge.options.filter(
      opt => opt.value === challenge.correctAnswer,
    );
    expect(matchingOptions).toHaveLength(1);

    const uniqueValues = new Set(challenge.options.map(opt => opt.value));
    expect(uniqueValues.size).toBe(4);
  });
});

describe('Alarm Redux Slice', () => {
  const initialAlarm: AlarmItem = {
    id: 'test-alarm-1',
    hour: '06',
    minute: '30',
    period: 'AM',
    title: 'Morning Wake Up',
    enabled: true,
    repeatDays: [0, 1, 2, 3, 4],
    motivationalImage: '',
    motivationalQuote: 'Rise and conquer',
    challengeType: 'math',
    difficulty: 'medium',
    snoozePenalty: true,
    createdAt: '',
    updatedAt: '',
  };

  it('toggles alarm enabled state', () => {
    const state = { alarms: [initialAlarm], activeAlarmId: null };
    const nextState = alarmReducer(state, toggleAlarm('test-alarm-1'));

    expect(nextState.alarms[0].enabled).toBe(false);
  });

  it('saves an edited alarm item', () => {
    const state = { alarms: [initialAlarm], activeAlarmId: null };
    const updated = { ...initialAlarm, hour: '07', minute: '00' };
    const nextState = alarmReducer(state, saveAlarm(updated));

    expect(nextState.alarms[0].hour).toBe('07');
    expect(nextState.alarms[0].minute).toBe('00');
  });

  it('deletes an alarm item', () => {
    const state = { alarms: [initialAlarm], activeAlarmId: null };
    const nextState = alarmReducer(state, deleteAlarm('test-alarm-1'));

    expect(nextState.alarms).toHaveLength(0);
  });
});

describe('Gamification Redux Slice', () => {
  const initialUserState = {
    userStats: {
      name: 'Viraj',
      level: 14,
      xp: 1240,
      wakePoints: 1240,
      streak: 7,
      wakeUpCompleted: false,
      challengeCompleted: false,
      morningGoalCompleted: false,
    },
  };

  it('awards wake points and levels up appropriately', () => {
    const nextState = gamificationReducer(initialUserState, awardWakePoints(200));

    expect(nextState.userStats.wakePoints).toBe(1440);
    expect(nextState.userStats.xp).toBe(1440);
    expect(nextState.userStats.level).toBe(15);
  });

  it('increments streak upon challenge solve', () => {
    const nextState = gamificationReducer(initialUserState, incrementStreak());

    expect(nextState.userStats.streak).toBe(8);
  });

  it('deducts penalty upon emergency snooze', () => {
    const nextState = gamificationReducer(initialUserState, applySnoozePenalty(50));

    expect(nextState.userStats.wakePoints).toBe(1190);
  });

  it('completes protocol items', () => {
    const nextState = gamificationReducer(
      initialUserState,
      completeProtocolItem('morningGoal'),
    );

    expect(nextState.userStats.morningGoalCompleted).toBe(true);
  });
});

describe('AlarmService Integration', () => {
  it('schedules and cancels alarms through platform abstraction', async () => {
    const mockAlarm: AlarmItem = {
      id: 'alarm-unit-test',
      hour: '06',
      minute: '30',
      period: 'AM',
      title: 'Morning Wake Up',
      enabled: true,
      repeatDays: [0, 1, 2, 3, 4],
      motivationalImage: '',
      motivationalQuote: '',
      challengeType: 'math',
      difficulty: 'medium',
      snoozePenalty: true,
      createdAt: '',
      updatedAt: '',
    };

    const scheduled = await AlarmService.schedule(mockAlarm);
    expect(scheduled).toBe(true);

    const cancelled = await AlarmService.cancel(mockAlarm.id);
    expect(cancelled).toBe(true);
  });
});

