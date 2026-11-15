import React, { FC, memo, useEffect, useState, useRef } from 'react';
import {
  Alert,
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
  CustomHeader,
  SafeAreaContainer,
} from '../../components';
import KnifeThrowerGame from '../../components/games/knife-thrower/KnifeThrowerGame';
import AirHockeyGame from '../../components/games/air-hockey/AirHockeyGame';
import StackTowerGame from '../../components/games/stack-tower/StackTowerGame';
import CurvePongGame from '../../components/games/curve-pong/CurvePongGame';
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
        'math',
      ];
      return candidates[Math.floor(Math.random() * candidates.length)];
    }
    return rawChallengeType;
  });

  const [remainingSeconds, setRemainingSeconds] = useState<number>(30);
  const [challenge] = useState<MathChallenge>(() =>
    generateMathChallenge(),
  );
  const [selectedOptionId, setSelectedOptionId] = useState<string | null>(null);

  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (challengeType === 'math') {
      timerRef.current = setInterval(() => {
        setRemainingSeconds(prev => {
          if (prev <= 1) {
            if (timerRef.current) clearInterval(timerRef.current);
            navigation.replace(Routes.failure, {
              reason: challengeScreenString.timeUpReason,
            });
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [navigation, challengeType]);

  const handleGameSuccess = () => {
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
        <KnifeThrowerGame
          totalKnives={7}
          initialKnivesCount={1}
          isAlarmMode={true}
          onSuccess={handleGameSuccess}
          onFailure={handleGameFailure}
          onExit={handleEmergencySnooze}
        />
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
        <AirHockeyGame
          targetScore={2}
          isAlarmMode={true}
          onSuccess={handleGameSuccess}
          onFailure={handleGameFailure}
          onExit={handleEmergencySnooze}
        />
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
        <StackTowerGame
          targetHeight={10}
          isAlarmMode={true}
          onSuccess={handleGameSuccess}
          onFailure={handleGameFailure}
          onExit={handleEmergencySnooze}
        />
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
        <CurvePongGame
          targetScore={2}
          isAlarmMode={true}
          onSuccess={handleGameSuccess}
          onFailure={handleGameFailure}
          onExit={handleEmergencySnooze}
        />
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
