import React, { useEffect, useRef } from 'react';
import { DeviceEventEmitter } from 'react-native';
import { Provider } from 'react-redux';
import {
  NavigationContainer,
  useNavigationContainerRef,
} from '@react-navigation/native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { setAlarms, store } from './app/redux';
import { RootStack } from './app/navigation';
import { AlarmService } from './app/services';
import { Routes } from './app/constants';
import { RootStackParamList } from './app/types';

function App(): React.JSX.Element {
  const navigationRef = useNavigationContainerRef<RootStackParamList>();
  const isNavReady = useRef<boolean>(false);

  useEffect(() => {
    // 1. Request notifications, exact alarm, and battery exemption permissions on app start
    AlarmService.checkAndRequestPermissions();

    // 2. Load all persisted alarms from disk into Redux and ensure exact alarms are registered in AlarmManager
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

    // 3. Real-time event listener for alarms triggering while app is active or in background
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

    return () => {
      subscription.remove();
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
          <RootStack />
        </NavigationContainer>
      </SafeAreaProvider>
    </Provider>
  );
}

export default App;
