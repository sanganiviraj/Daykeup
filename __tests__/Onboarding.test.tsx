import React from 'react';
import ReactTestRenderer from 'react-test-renderer';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import OnboardingScreen from '../app/modules/Onboarding/OnboardingScreen';
import onboardingReducer, {
  selectWakeStyle,
  shiftWakeTime,
  toggleOnboardingDay,
} from '../app/redux/slices/onboarding-slice/OnboardingSlice';
import alarmReducer from '../app/redux/slices/alarm-slice/AlarmSlice';
import gamificationReducer from '../app/redux/slices/gamification-slice/GamificationSlice';
import { Routes, onboardingString } from '../app/constants';
import { formatTime12, getTodayDayIndex, minutesToTime12 } from '../app/utils';

const mockReset = jest.fn();

jest.mock('@react-navigation/native', () => ({
  useNavigation: () => ({ reset: mockReset }),
}));

jest.mock('react-native-linear-gradient', () => {
  const { View } = require('react-native');
  return { __esModule: true, default: View };
});

jest.mock('react-native-safe-area-context', () => {
  const { View } = require('react-native');
  return { SafeAreaView: View };
});

jest.mock('../app/services', () => ({
  AlarmService: {
    schedule: jest.fn(() => Promise.resolve(true)),
    saveAllAlarms: jest.fn(() => Promise.resolve(true)),
    markOnboardingCompleted: jest.fn(() => Promise.resolve(true)),
  },
}));

const { AlarmService } = jest.requireMock('../app/services');

const buildStore = () =>
  configureStore({
    reducer: {
      alarm: alarmReducer,
      gamification: gamificationReducer,
      onboarding: onboardingReducer,
    },
  });

describe('onboarding slice', () => {
  const initial = onboardingReducer(undefined, { type: 'init' });

  it('wraps the wake time past midnight in both directions', () => {
    const lateNight = { ...initial, wakeMinutes: 23 * 60 + 50 };
    expect(onboardingReducer(lateNight, shiftWakeTime(1)).wakeMinutes).toBe(5);

    const justAfterMidnight = { ...initial, wakeMinutes: 5 };
    expect(onboardingReducer(justAfterMidnight, shiftWakeTime(-1)).wakeMinutes).toBe(
      23 * 60 + 50,
    );
  });

  it('repeats on today only by default', () => {
    expect(initial.repeatDays).toEqual([getTodayDayIndex()]);
  });

  it('toggles repeat days and keeps them sorted', () => {
    const base = { ...initial, repeatDays: [1, 3] };
    expect(onboardingReducer(base, toggleOnboardingDay(0)).repeatDays).toEqual([0, 1, 3]);
    expect(onboardingReducer(base, toggleOnboardingDay(3)).repeatDays).toEqual([1]);
  });

  it('suggests a challenge intensity from the wake style', () => {
    const state = onboardingReducer(initial, selectWakeStyle('heavySleeper'));
    expect(state.wakeStyle).toBe('heavySleeper');
    expect(state.difficulty).toBe('hard');
  });
});

describe('time helpers', () => {
  it('formats minutes since midnight as 12-hour time', () => {
    expect(formatTime12(minutesToTime12(6 * 60 + 30))).toBe('06:30 AM');
    expect(formatTime12(minutesToTime12(0))).toBe('12:00 AM');
    expect(formatTime12(minutesToTime12(12 * 60))).toBe('12:00 PM');
    expect(formatTime12(minutesToTime12(23 * 60 + 15))).toBe('11:15 PM');
  });

  it('wraps negative minutes to the previous day', () => {
    // 6:30 AM minus 7h45m of sleep -> 10:45 PM
    expect(formatTime12(minutesToTime12(6 * 60 + 30 - (7 * 60 + 45)))).toBe('10:45 PM');
  });
});

describe('OnboardingScreen', () => {
  beforeEach(() => {
    jest.useFakeTimers();
    jest.clearAllMocks();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  const renderScreen = () => {
    const store = buildStore();
    let tree: ReactTestRenderer.ReactTestRenderer | undefined;
    ReactTestRenderer.act(() => {
      tree = ReactTestRenderer.create(
        <Provider store={store}>
          <OnboardingScreen />
        </Provider>,
      );
    });
    return { store, root: tree!.root };
  };

  const advance = (ms: number) =>
    ReactTestRenderer.act(() => {
      jest.advanceTimersByTime(ms);
    });

  // A step change is two animations: the old step exits, then (after React
  // commits the new step) the new one enters.
  const completeTransition = () => {
    advance(1000);
    advance(1000);
  };

  it('starts on the welcome step and advances with the CTA', () => {
    const { root } = renderScreen();
    expect(root.findAllByProps({ testID: 'onboarding-step-welcome' }).length).toBeGreaterThan(0);

    ReactTestRenderer.act(() => {
      root.findByProps({ testID: 'onboarding-cta' }).props.onPress();
    });
    completeTransition();

    expect(root.findAllByProps({ testID: 'onboarding-step-rhythm' }).length).toBeGreaterThan(0);
  });

  it('skip finishes onboarding without creating an alarm', () => {
    const { store, root } = renderScreen();

    ReactTestRenderer.act(() => {
      root.findByProps({ testID: 'onboarding-skip' }).props.onPress();
    });

    expect(AlarmService.markOnboardingCompleted).toHaveBeenCalled();
    expect(AlarmService.schedule).not.toHaveBeenCalled();
    expect(store.getState().alarm.alarms).toHaveLength(0);
    expect(mockReset).toHaveBeenCalledWith({ index: 0, routes: [{ name: Routes.home }] });
  });

  it('creates and schedules an alarm from the chosen answers on the last step', () => {
    const { store, root } = renderScreen();

    // Walk through all five steps.
    for (let i = 0; i < 4; i += 1) {
      ReactTestRenderer.act(() => {
        root.findByProps({ testID: 'onboarding-cta' }).props.onPress();
      });
      completeTransition();
    }

    expect(root.findAllByProps({ testID: 'onboarding-step-ready' }).length).toBeGreaterThan(0);

    ReactTestRenderer.act(() => {
      root.findByProps({ testID: 'onboarding-cta' }).props.onPress();
    });
    expect(root.findByProps({ testID: 'onboarding-cta' }).props.title).toBe(
      onboardingString.readyLaunching,
    );
    advance(1000);

    const [alarm] = store.getState().alarm.alarms;
    expect(alarm).toMatchObject({
      hour: '06',
      minute: '30',
      period: 'AM',
      repeatDays: [getTodayDayIndex()],
      challengeType: 'math',
      difficulty: 'medium',
      enabled: true,
    });
    expect(AlarmService.schedule).toHaveBeenCalledWith(alarm);
    expect(AlarmService.markOnboardingCompleted).toHaveBeenCalled();
    expect(mockReset).toHaveBeenCalledWith({ index: 0, routes: [{ name: Routes.home }] });
  });
});
