import React, { useEffect, useRef, useState } from 'react';
import { AppState, DeviceEventEmitter } from 'react-native';
import { Provider } from 'react-redux';
import {
  NavigationContainer,
  useNavigationContainerRef,
} from '@react-navigation/native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import {
  ensureTrackingStart,
  hydrateStats,
  setAlarms,
  store,
} from './app/redux';
import { RootStack } from './app/navigation';
import { AlarmService, StatsStorageService } from './app/services';
import { Routes } from './app/constants';
import { RootStackParamList } from './app/types';
import { toDateKey } from './app/utils';

function App(): React.JSX.Element {
  const navigationRef = useNavigationContainerRef<RootStackParamList>();
  const isNavReady = useRef<boolean>(false);
  const [initialRoute, setInitialRoute] = useState<
    typeof Routes.home | typeof Routes.onboarding | typeof Routes.permissions | null
  >(null);

  // First launch goes through onboarding. Anyone who already has alarms saved
  // (installed before onboarding existed) skips it.
  useEffect(() => {
    Promise.all([
      AlarmService.hasCompletedOnboarding(),
      AlarmService.getAllSavedAlarms(),
    ]).then(async ([completed, savedAlarms]) => {
      const hasSavedAlarms = !!savedAlarms && savedAlarms.length > 0;
      if (!completed && !hasSavedAlarms) {
        setInitialRoute(Routes.onboarding);
        return;
      }
      const needsSetup = await AlarmService.needsPermissionSetup();
      setInitialRoute(needsSetup ? Routes.permissions : Routes.home);
    });
  }, []);

  // Streak, points and wake history live on the device; load them, then save every change.
  useEffect(() => {
    let unsubscribe: (() => void) | undefined;
    StatsStorageService.load().then(saved => {
      if (saved) {
        store.dispatch(hydrateStats(saved));
      }
      store.dispatch(ensureTrackingStart(toDateKey()));

      let lastSaved = store.getState().gamification.userStats;
      StatsStorageService.save(lastSaved);
      unsubscribe = store.subscribe(() => {
        const current = store.getState().gamification.userStats;
        if (current !== lastSaved) {
          lastSaved = current;
          StatsStorageService.save(current);
        }
      });
    });
    return () => unsubscribe?.();
  }, []);

  useEffect(() => {
    // 1. Load all persisted alarms from disk into Redux and ensure exact alarms are registered in AlarmManager
    AlarmService.getAllSavedAlarms().then(savedAlarms => {
      if (savedAlarms && savedAlarms.length > 0) {
        store.dispatch(setAlarms(savedAlarms));
        savedAlarms.forEach(alarm => {
          if (alarm.enabled) {
            AlarmService.schedule(alarm);
          }
        });
      }
    });

    // 2. Real-time event listener for alarms triggering while app is active or in background
    const subscription = DeviceEventEmitter.addListener(
      'ON_ALARM_TRIGGERED',
      (event: { alarmId?: string }) => {
        if (navigationRef.isReady()) {
          navigationRef.navigate(Routes.alarmRinging, {
            alarmId: event?.alarmId,
          });
          AlarmService.clearInitialAlarm();
        }
      },
    );

    // 3. App returned to foreground (e.g. opened after unlock) while an alarm is still ringing
    const appStateSub = AppState.addEventListener('change', state => {
      if (state !== 'active') {
        return;
      }
      AlarmService.getInitialAlarm().then(alarmId => {
        if (
          alarmId &&
          navigationRef.isReady() &&
          navigationRef.getCurrentRoute()?.name !== Routes.alarmRinging
        ) {
          navigationRef.navigate(Routes.alarmRinging, { alarmId });
        }
      });
    });

    return () => {
      subscription.remove();
      appStateSub.remove();
    };
  }, [navigationRef]);

  const handleNavReady = () => {
    isNavReady.current = true;
    AlarmService.getInitialAlarm().then(alarmId => {
      if (alarmId && navigationRef.isReady()) {
        navigationRef.navigate(Routes.alarmRinging, { alarmId });
        AlarmService.clearInitialAlarm();
      }
    });
  };

  return (
    <Provider store={store}>
      <SafeAreaProvider>
        <NavigationContainer
          ref={navigationRef}
          onReady={handleNavReady}>
          {initialRoute ? <RootStack initialRouteName={initialRoute} /> : null}
        </NavigationContainer>
      </SafeAreaProvider>
    </Provider>
  );
}

export default App;
