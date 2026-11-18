import React, { FC, memo, useEffect, useState, useRef } from 'react';
import {
  Alert,
  AppState,
  ScrollView,
  TouchableOpacity,
  View,
} from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import {
  AppIcon,
  AppText,
  CountdownDial,
  GameTimerBadge,
  CustomHeader,
  SafeAreaContainer,
} from '../../components';
import KnifeThrowerGame from '../../components/games/knife-thrower/KnifeThrowerGame';
import AirHockeyGame from '../../components/games/air-hockey/AirHockeyGame';
import StackTowerGame from '../../components/games/stack-tower/StackTowerGame';
import CurvePongGame from '../../components/games/curve-pong/CurvePongGame';
import MonsterTruckGame from '../../components/games/monster-truck/MonsterTruckGame';
import ShadowDuelGame from '../../components/games/shadow-duel/ShadowDuelGame';
import {
  challengeScreenString,
  commonString,
  gamesString,
  Routes,
} from '../../constants';
import { useAppDispatch, useAppSelector } from '../../hooks';
import { AlarmService } from '../../services';
import {
  awardWakePoints,
  incrementStreak,
  applySnoozePenalty,
  completeProtocolItem,
} from '../../redux';
import { ChallengeType, MathChallenge, RootStackParamList } from '../../types';
import { generateMathChallenge } from '../../utils';
import { Colors } from '../../theme/Colors';
import { styles } from './ChallengeScreenStyles';

type ChallengeNavProp = NativeStackNavigationProp<RootStackParamList>;
type ChallengeRouteProp = RouteProp<RootStackParamList, 'ChallengeScreen'>;

const TOTAL_SECONDS = 30;

const ChallengeScreen: FC = () => {
  const navigation = useNavigation<ChallengeNavProp>();
  const route = useRoute<ChallengeRouteProp>();
  const dispatch = useAppDispatch();
  const userStats = useAppSelector(state => state.gamification.userStats);
  const alarms = useAppSelector(state => state.alarm.alarms);

  const currentAlarm =
    alarms.find(a => a.id === route.params?.alarmId) || alarms[0];
  const rawChallengeType = currentAlarm?.challengeType || 'knife';

  const [challengeType] = useState<ChallengeType>(() => {
    if (rawChallengeType === 'mystery') {
      const candidates: ChallengeType[] = [
        'knife',
        'hockey',
        'stack',
        'pong',
        'truck',
        'duel',
        'math',
      ];
      return candidates[Math.floor(Math.random() * candidates.length)];
    }
    return rawChallengeType;
  });

  const [remainingSeconds, setRemainingSeconds] = useState<number>(TOTAL_SECONDS);
  const [challenge] = useState<MathChallenge>(() =>
    generateMathChallenge(),
  );
  const [selectedOptionId, setSelectedOptionId] = useState<string | null>(null);

  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  // True once the challenge has ended for good (won, snoozed or timed out).
  const finishedRef = useRef<boolean>(false);
  const soundUri = currentAlarm?.soundUri;
  const vibrate = currentAlarm?.vibrationEnabled !== false;

  // The alarm stays silent while the player has their 30 seconds to win.
  // Any other way of leaving the screen (back, app switch) brings the sound back.
  useEffect(() => {
    AlarmService.pauseAlarmSound();

    const appStateSub = AppState.addEventListener('change', nextState => {
      if (finishedRef.current) return;
      if (nextState === 'active') {
        AlarmService.pauseAlarmSound();
      } else {
        AlarmService.resumeAlarmSound(soundUri, vibrate);
      }
    });

    return () => {
      appStateSub.remove();
      if (!finishedRef.current) {
        AlarmService.resumeAlarmSound(soundUri, vibrate);
      }
    };
  }, [soundUri, vibrate]);

  useEffect(() => {
    timerRef.current = setInterval(() => {
      setRemainingSeconds(prev => Math.max(0, prev - 1));
    }, 1000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  // Out of time: the alarm rings again until the challenge is won.
  useEffect(() => {
    if (remainingSeconds > 0 || finishedRef.current) return;
    finishedRef.current = true;
    if (timerRef.current) clearInterval(timerRef.current);
    AlarmService.resumeAlarmSound(soundUri, vibrate);
    navigation.replace(Routes.failure, {
      reason: challengeScreenString.timeUpReason,
      alarmId: currentAlarm?.id,
    });
  }, [remainingSeconds, navigation, soundUri, vibrate, currentAlarm?.id]);

  const handleGameSuccess = () => {
    if (finishedRef.current) return;
    finishedRef.current = true;
    if (timerRef.current) clearInterval(timerRef.current);
    dispatch(awardWakePoints(50));
    dispatch(incrementStreak());
    dispatch(completeProtocolItem('wakeUp'));
    dispatch(completeProtocolItem('challenge'));
    AlarmService.stopAlarmSound();

    setTimeout(() => {
      navigation.replace(Routes.success, {
        earnedXp: 50,
        streak: userStats.streak + 1,
      });
    }, 300);
  };

  const handleGameFailure = () => {
    Alert.alert(
      challengeScreenString.gameMissedTitle,
      challengeScreenString.gameMissedMsg,
      [{ text: challengeScreenString.tryAgainBtn }],
    );
  };

  const handleSelectOption = (optionId: string, val: number) => {
    setSelectedOptionId(optionId);

    if (val === challenge.correctAnswer) {
      handleGameSuccess();
    } else {
      Alert.alert(
        challengeScreenString.wrongAnswerTitle,
        challengeScreenString.wrongAnswerMsg,
        [{ text: challengeScreenString.tryAgainBtn }],
      );
    }
  };

  const handleEmergencySnooze = () => {
    Alert.alert(
      challengeScreenString.emergencySnooze,
      challengeScreenString.snoozeConfirm,
      [
        { text: commonString.cancel, style: 'cancel' },
        {
          text: challengeScreenString.snoozeConfirmBtn,
          style: 'destructive',
          onPress: () => {
            finishedRef.current = true;
            if (timerRef.current) clearInterval(timerRef.current);
            AlarmService.stopAlarmSound();
            dispatch(applySnoozePenalty(50));
            navigation.goBack();
          },
        },
      ],
    );
  };

  // If Knife Thrower Wake-up Quest
  if (challengeType === 'knife') {
    return (
      <SafeAreaContainer edges={['top', 'left', 'right', 'bottom']}>
        <CustomHeader
          title={gamesString.knifeCardTitle}
          showBack={true}
          onBackPress={handleEmergencySnooze}
        />
        <View style={styles.gameStage}>
          <KnifeThrowerGame
            totalKnives={7}
            initialKnivesCount={1}
            isAlarmMode={true}
            onSuccess={handleGameSuccess}
            onFailure={handleGameFailure}
            onExit={handleEmergencySnooze}
          />
          <GameTimerBadge remainingSeconds={remainingSeconds} />
        </View>
      </SafeAreaContainer>
    );
  }

  // If Air Hockey Wake-up Quest
  if (challengeType === 'hockey') {
    return (
      <SafeAreaContainer edges={['top', 'left', 'right', 'bottom']}>
        <CustomHeader
          title={gamesString.hockeyCardTitle}
          showBack={true}
          onBackPress={handleEmergencySnooze}
        />
        <View style={styles.gameStage}>
          <AirHockeyGame
            targetScore={2}
            isAlarmMode={true}
            onSuccess={handleGameSuccess}
            onFailure={handleGameFailure}
            onExit={handleEmergencySnooze}
          />
          <GameTimerBadge remainingSeconds={remainingSeconds} />
        </View>
      </SafeAreaContainer>
    );
  }

  // If Stack Tower Wake-up Quest
  if (challengeType === 'stack') {
    return (
      <SafeAreaContainer edges={['top', 'left', 'right', 'bottom']}>
        <CustomHeader
          title={gamesString.stackCardTitle}
          showBack={true}
          onBackPress={handleEmergencySnooze}
        />
        <View style={styles.gameStage}>
          <StackTowerGame
            targetHeight={10}
            isAlarmMode={true}
            onSuccess={handleGameSuccess}
            onFailure={handleGameFailure}
            onExit={handleEmergencySnooze}
          />
          <GameTimerBadge remainingSeconds={remainingSeconds} />
        </View>
      </SafeAreaContainer>
    );
  }

  // If Curve Pong Wake-up Quest
  if (challengeType === 'pong') {
    return (
      <SafeAreaContainer edges={['top', 'left', 'right', 'bottom']}>
        <CustomHeader
          title={gamesString.pongCardTitle}
          showBack={true}
          onBackPress={handleEmergencySnooze}
        />
        <View style={styles.gameStage}>
          <CurvePongGame
            targetScore={2}
            isAlarmMode={true}
            onSuccess={handleGameSuccess}
            onFailure={handleGameFailure}
            onExit={handleEmergencySnooze}
          />
          <GameTimerBadge remainingSeconds={remainingSeconds} />
        </View>
      </SafeAreaContainer>
    );
  }

  // If Monster Truck Wake-up Quest
  if (challengeType === 'truck') {
    return (
      <SafeAreaContainer edges={['top', 'left', 'right', 'bottom']}>
        <CustomHeader
          title={gamesString.truckCardTitle}
          showBack={true}
          onBackPress={handleEmergencySnooze}
        />
        <View style={styles.gameStage}>
          <MonsterTruckGame
            targetDistance={120}
            isAlarmMode={true}
            onSuccess={handleGameSuccess}
            onExit={handleEmergencySnooze}
          />
          <GameTimerBadge remainingSeconds={remainingSeconds} />
        </View>
      </SafeAreaContainer>
    );
  }

  // If Shadow Duel Wake-up Quest
  if (challengeType === 'duel') {
    return (
      <SafeAreaContainer edges={['top', 'left', 'right', 'bottom']}>
        <CustomHeader
          title={gamesString.duelCardTitle}
          showBack={true}
          onBackPress={handleEmergencySnooze}
        />
        <View style={styles.gameStage}>
          <ShadowDuelGame
            enemyHp={70}
            isAlarmMode={true}
            onSuccess={handleGameSuccess}
            onExit={handleEmergencySnooze}
          />
          <GameTimerBadge remainingSeconds={remainingSeconds} />
        </View>
      </SafeAreaContainer>
    );
  }

  // Default Math speed challenge
  return (
    <SafeAreaContainer
      edges={['top', 'left', 'right', 'bottom']}
      backgroundColor={Colors.creamBackground}>
      <CustomHeader
        title={challengeScreenString.headerTitle}
        showBack={true}
        showAvatar={false}
        onBackPress={handleEmergencySnooze}
      />

      <ScrollView
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}>
        <CountdownDial
          totalSeconds={TOTAL_SECONDS}
          remainingSeconds={remainingSeconds}
        />

        <AppText style={styles.challengeHeading}>
          {challengeScreenString.challengeHeading}
        </AppText>

        {/* Equation */}
        <View style={styles.equationBox}>
          <AppText style={styles.equationText}>
            {`${challenge.num1} ${challenge.operator} ${challenge.num2} = ?`}
          </AppText>
          <AppText style={styles.instructionText}>
            {challengeScreenString.tapCorrectSum}
          </AppText>
        </View>

        {/* 2x2 Answer Grid */}
        <View style={styles.optionsGrid}>
          {challenge.options.map(option => {
            const isSelected = selectedOptionId === option.id;
            return (
              <TouchableOpacity
                key={option.id}
                onPress={() => handleSelectOption(option.id, option.value)}
                activeOpacity={0.7}
                style={[
                  styles.optionCard,
                  isSelected && styles.optionCardSelected,
                ]}
                accessible={true}
                accessibilityLabel={`${option.value}`}
                accessibilityRole="button">
                <AppText
                  style={[
                    styles.optionValue,
                    isSelected && styles.optionValueSelected,
                  ]}>
                  {option.value}
                </AppText>
              </TouchableOpacity>
            );
          })}
        </View>

        <View style={styles.rewardRow}>
          <AppIcon name="flame" size="sm" color={Colors.brandOrange} />
          <AppText style={styles.rewardText}>
            {challengeScreenString.rewardNote}
          </AppText>
        </View>

        {/* Snooze */}
        <TouchableOpacity
          onPress={handleEmergencySnooze}
          activeOpacity={0.7}
          style={styles.snoozeBtn}
          accessible={true}
          accessibilityLabel={challengeScreenString.emergencySnooze}
          accessibilityRole="button">
          <AppIcon name="moon" size="sm" color={Colors.textSecondary} />
          <AppText style={styles.snoozeText}>
            {challengeScreenString.emergencySnooze}
          </AppText>
          <AppText style={styles.penaltyText}>
            {challengeScreenString.snoozePenalty}
          </AppText>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaContainer>
  );
};

export default memo(ChallengeScreen);
