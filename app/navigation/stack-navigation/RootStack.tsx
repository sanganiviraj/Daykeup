import React, { FC } from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Routes } from '../../constants';
import { RootStackParamList } from '../../types';

import HomeScreen from '../../modules/Home/HomeScreen';
import CreateAlarmScreen from '../../modules/Alarms/CreateAlarm/CreateAlarmScreen';
import AlarmRingingScreen from '../../modules/Alarms/AlarmRinging/AlarmRingingScreen';
import ChallengeScreen from '../../modules/Challenges/ChallengeScreen';
import SuccessScreen from '../../modules/Result/Success/SuccessScreen';
import FailureScreen from '../../modules/Result/Failure/FailureScreen';

const Stack = createNativeStackNavigator<RootStackParamList>();

const RootStack: FC = () => {
  return (
    <Stack.Navigator
      initialRouteName={Routes.home}
      screenOptions={{
        headerShown: false,
        animation: 'slide_from_right',
      }}>
      <Stack.Screen name={Routes.home} component={HomeScreen} />
      <Stack.Screen
        name={Routes.createAlarm}
        component={CreateAlarmScreen}
        options={{ animation: 'slide_from_bottom' }}
      />
      <Stack.Screen
        name={Routes.alarmRinging}
        component={AlarmRingingScreen}
        options={{ animation: 'fade' }}
      />
      <Stack.Screen
        name={Routes.challenge}
        component={ChallengeScreen}
        options={{ animation: 'slide_from_right' }}
      />
      <Stack.Screen
        name={Routes.success}
        component={SuccessScreen}
        options={{ animation: 'fade' }}
      />
      <Stack.Screen
        name={Routes.failure}
        component={FailureScreen}
        options={{ animation: 'fade' }}
      />
    </Stack.Navigator>
  );
};

export default RootStack;

