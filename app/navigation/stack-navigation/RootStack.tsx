import React, { FC } from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Routes } from '../../constants';
import { RootStackParamList } from '../../types';

import OnboardingScreen from '../../modules/Onboarding/OnboardingScreen';
import HomeScreen from '../../modules/Home/HomeScreen';
import AlarmsScreen from '../../modules/Alarms/AlarmsList/AlarmsScreen';
import CreateAlarmScreen from '../../modules/Alarms/CreateAlarm/CreateAlarmScreen';
import AlarmRingingScreen from '../../modules/Alarms/AlarmRinging/AlarmRingingScreen';
import ChallengeScreen from '../../modules/Challenges/ChallengeScreen';
import GamesHubScreen from '../../modules/Games/GamesHubScreen';
import KnifeGameScreen from '../../modules/Games/KnifeGameScreen';
import HockeyGameScreen from '../../modules/Games/HockeyGameScreen';
import StackGameScreen from '../../modules/Games/StackGameScreen';
import PongGameScreen from '../../modules/Games/PongGameScreen';
import TruckGameScreen from '../../modules/Games/TruckGameScreen';
import DuelGameScreen from '../../modules/Games/DuelGameScreen';
import SuccessScreen from '../../modules/Result/Success/SuccessScreen';
import FailureScreen from '../../modules/Result/Failure/FailureScreen';

const Stack = createNativeStackNavigator<RootStackParamList>();

interface RootStackProps {
  initialRouteName?: typeof Routes.home | typeof Routes.onboarding;
}

const RootStack: FC<RootStackProps> = ({ initialRouteName = Routes.home }) => {
  return (
    <Stack.Navigator
      initialRouteName={initialRouteName}
      screenOptions={{
        headerShown: false,
        animation: 'slide_from_right',
      }}>
      <Stack.Screen
        name={Routes.onboarding}
        component={OnboardingScreen}
        options={{ animation: 'fade', gestureEnabled: false }}
      />
      <Stack.Screen name={Routes.home} component={HomeScreen} />
      <Stack.Screen name={Routes.alarms} component={AlarmsScreen} />
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
        name={Routes.gamesHub}
        component={GamesHubScreen}
        options={{ animation: 'slide_from_right' }}
      />
      <Stack.Screen
        name={Routes.knifeGame}
        component={KnifeGameScreen}
        options={{ animation: 'slide_from_bottom' }}
      />
      <Stack.Screen
        name={Routes.hockeyGame}
        component={HockeyGameScreen}
        options={{ animation: 'slide_from_bottom' }}
      />
      <Stack.Screen
        name={Routes.stackGame}
        component={StackGameScreen}
        options={{ animation: 'slide_from_bottom' }}
      />
      <Stack.Screen
        name={Routes.pongGame}
        component={PongGameScreen}
        options={{ animation: 'slide_from_bottom' }}
      />
      <Stack.Screen
        name={Routes.truckGame}
        component={TruckGameScreen}
        options={{ animation: 'slide_from_bottom' }}
      />
      <Stack.Screen
        name={Routes.duelGame}
        component={DuelGameScreen}
        options={{ animation: 'slide_from_bottom' }}
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

