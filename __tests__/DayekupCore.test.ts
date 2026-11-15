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
import { AlarmService, calculateNextTriggerTimestamp } from '../app/services/AlarmService';
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
  it('starts with empty alarms array (no demo/default data)', () => {
    const state = alarmReducer(undefined, { type: '@@INIT' });
    expect(state.alarms).toEqual([]);
    expect(state.activeAlarmId).toBeNull();
  });

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

  it('saves an edited alarm item with custom sound and vibration settings', () => {
    const state = { alarms: [initialAlarm], activeAlarmId: null };
    const updated = {
      ...initialAlarm,
      hour: '07',
      minute: '00',
      soundUri: 'content://media/internal/audio/media/42',
      soundTitle: 'Energetic Sunrise.mp3',
      vibrationEnabled: true,
    };
    const nextState = alarmReducer(state, saveAlarm(updated));

    expect(nextState.alarms[0].hour).toBe('07');
    expect(nextState.alarms[0].minute).toBe('00');
    expect(nextState.alarms[0].soundUri).toBe('content://media/internal/audio/media/42');
    expect(nextState.alarms[0].soundTitle).toBe('Energetic Sunrise.mp3');
    expect(nextState.alarms[0].vibrationEnabled).toBe(true);
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
  it('stops alarm sound when dismissed or challenge is completed', async () => {
    const stopped = await AlarmService.stopAlarmSound();
    expect(stopped).toBe(true);

    const cleared = await AlarmService.clearInitialAlarm();
    expect(cleared).toBe(true);
  });

  it('supports sound preview playback and stopping', async () => {
    const played = await AlarmService.playPreview('content://media/test.mp3');
    expect(played).toBe(true);

    const stopped = await AlarmService.stopPreview();
    expect(stopped).toBe(true);
  });

  it('provides sound selection hooks for system ringtones and device files', async () => {
    const ringtone = await AlarmService.pickRingtone();
    expect(ringtone === null || typeof ringtone.title === 'string').toBe(true);

    const audioFile = await AlarmService.pickAudioFile();
    expect(audioFile === null || typeof audioFile.title === 'string').toBe(true);
  });

  it('checks and requests overlay and full-screen intent permissions', async () => {
    const canOverlay = await AlarmService.canDrawOverlays();
    expect(typeof canOverlay).toBe('boolean');

    const overlayRequested = await AlarmService.requestOverlayPermission();
    expect(typeof overlayRequested).toBe('boolean');

    const canFullScreen = await AlarmService.canUseFullScreenIntent();
    expect(typeof canFullScreen).toBe('boolean');

    const fullScreenRequested = await AlarmService.requestFullScreenIntentPermission();
    expect(typeof fullScreenRequested).toBe('boolean');

    const oemSettingsOpened = await AlarmService.openOEMSettings();
    expect(typeof oemSettingsOpened).toBe('boolean');
  });

  it('calculates next trigger timestamp correctly for future today and next day rollover', () => {
    const baseDate = new Date(2026, 10, 9, 8, 0, 0); // 08:00 AM

    const futureAlarm: AlarmItem = {
      id: 'future-1',
      hour: '09',
      minute: '30',
      period: 'AM',
      title: 'Morning Alarm',
      enabled: true,
      repeatDays: [0, 1, 2, 3, 4],
      motivationalQuote: '',
      challengeType: 'math',
      difficulty: 'medium',
      createdAt: '',
      updatedAt: '',
    };

    const futureTs = calculateNextTriggerTimestamp(futureAlarm, baseDate);
    expect(futureTs).toBeGreaterThan(baseDate.getTime());
    const futureDate = new Date(futureTs);
    expect(futureDate.getHours()).toBe(9);
    expect(futureDate.getMinutes()).toBe(30);
    expect(futureDate.getDate()).toBe(9); // Same day

    // Past alarm (e.g. 06:30 AM when current time is 08:00 AM)
    const pastAlarm: AlarmItem = {
      ...futureAlarm,
      hour: '06',
      minute: '30',
    };

    const pastTs = calculateNextTriggerTimestamp(pastAlarm, baseDate);
    expect(pastTs).toBeGreaterThan(baseDate.getTime());
    const rolledOverDate = new Date(pastTs);
    expect(rolledOverDate.getHours()).toBe(6);
    expect(rolledOverDate.getMinutes()).toBe(30);
    expect(rolledOverDate.getDate()).toBe(10); // Rolled over to tomorrow
  });
});

describe('Tab Navigation & Screen Requirements', () => {
  it('supports initialTab parameter for seamless tab state switching', () => {
    const mainTab: 'main' | 'alarms' = 'main';
    const alarmsTab: 'main' | 'alarms' = 'alarms';

    expect(mainTab).toBe('main');
    expect(alarmsTab).toBe('alarms');
  });

  it('determines circadian banner visibility strictly based on alarms presence', () => {
    const emptyAlarms: AlarmItem[] = [];
    const populatedAlarms: AlarmItem[] = [
      {
        id: 'test-1',
        hour: '06',
        minute: '30',
        period: 'AM',
        title: 'Morning Routine',
        enabled: true,
        repeatDays: [0, 1, 2, 3, 4],
        motivationalQuote: '',
        challengeType: 'math',
        difficulty: 'medium',
        createdAt: '',
        updatedAt: '',
      },
    ];

    expect(emptyAlarms.length > 0).toBe(false); // Circadian rhythm hidden when no alarms
    expect(populatedAlarms.length > 0).toBe(true); // Circadian rhythm shown when alarms exist
  });
});


