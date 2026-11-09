import React, { FC, memo, useEffect, useState, useRef } from 'react';
import {
  Alert,
  ScrollView,
  TouchableOpacity,
  View,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import {
  AppText,
  CountdownDial,
  CustomHeader,
  SafeAreaContainer,
} from '../../components';
import { challengeScreenString, Routes } from '../../constants';
import { useAppDispatch, useAppSelector } from '../../hooks';
import {
  awardWakePoints,
  incrementStreak,
  applySnoozePenalty,
  completeProtocolItem,
} from '../../redux';
import { MathChallenge, RootStackParamList } from '../../types';
import { generateMathChallenge } from '../../utils';
import { styles } from './ChallengeScreenStyles';

type ChallengeNavProp = NativeStackNavigationProp<RootStackParamList>;

const TOTAL_SECONDS = 30;

const ChallengeScreen: FC = () => {
  const navigation = useNavigation<ChallengeNavProp>();
  const dispatch = useAppDispatch();
  const userStats = useAppSelector(state => state.gamification.userStats);

  const [remainingSeconds, setRemainingSeconds] = useState<number>(21);
  const [challenge] = useState<MathChallenge>(() =>
    generateMathChallenge(),
  );
  const [selectedOptionId, setSelectedOptionId] = useState<string | null>(null);

  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    timerRef.current = setInterval(() => {
      setRemainingSeconds(prev => {
        if (prev <= 1) {
          if (timerRef.current) clearInterval(timerRef.current);
          navigation.replace(Routes.failure, {
            reason: challengeScreenString.secondsLabel,
          });
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [navigation]);

  const handleSelectOption = (optionId: string, val: number) => {
    setSelectedOptionId(optionId);

    if (val === challenge.correctAnswer) {
      if (timerRef.current) clearInterval(timerRef.current);

      dispatch(awardWakePoints(25));
      dispatch(incrementStreak());
      dispatch(completeProtocolItem('wakeUp'));
      dispatch(completeProtocolItem('challenge'));

      setTimeout(() => {
        navigation.replace(Routes.success, {
          earnedXp: 25,
          streak: userStats.streak + 1,
        });
      }, 300);
    } else {
      Alert.alert(
        'Incorrect Answer',
        'Try again! The clock is ticking.',
        [{ text: 'Continue' }],
      );
    }
  };

  const handleEmergencySnooze = () => {
    Alert.alert(
      challengeScreenString.emergencySnooze,
      challengeScreenString.snoozeConfirm,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Snooze (-50 XP)',
          style: 'destructive',
          onPress: () => {
            if (timerRef.current) clearInterval(timerRef.current);
            dispatch(applySnoozePenalty(50));
            navigation.goBack();
          },
        },
      ],
    );
  };

  return (
    <SafeAreaContainer edges={['top', 'left', 'right', 'bottom']}>
      <CustomHeader
        title={challengeScreenString.headerTitle}
        showBack={true}
        onBackPress={() => navigation.goBack()}
      />

      <ScrollView
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}>
        {/* Countdown Dial */}
        <CountdownDial
          totalSeconds={TOTAL_SECONDS}
          remainingSeconds={remainingSeconds}
        />

        {/* Challenge Heading */}
        <View style={styles.challengeTitleBlock}>
          <AppText style={styles.challengeHeading}>
            {challengeScreenString.challengeHeading}
          </AppText>
          <AppText style={styles.challengeSubheading}>
            {challengeScreenString.challengeSubheading}
          </AppText>
        </View>

        {/* Gameplay Card */}
        <View style={styles.gameplayCard}>
          <View style={styles.gameplayHeaderRow}>
            <View style={styles.problemBadge}>
              <AppText>🧠</AppText>
              <AppText style={styles.problemBadgeText}>
                {challengeScreenString.problemBadge}
              </AppText>
            </View>
            <View style={styles.rapidBadge}>
              <AppText style={styles.rapidBadgeText}>
                {challengeScreenString.rapidBadge}
              </AppText>
            </View>
          </View>

          <View style={styles.equationBox}>
            <View style={styles.equationRow}>
              <AppText style={styles.equationText}>
                {`${challenge.num1} ${challenge.operator} ${challenge.num2}`}
              </AppText>
              <AppText style={styles.equationOperator}>=</AppText>
              <AppText style={styles.equationQuestionMark}>?</AppText>
            </View>
          </View>

          <View style={styles.instructionRow}>
            <AppText>👆</AppText>
            <AppText style={styles.instructionText}>
              {challengeScreenString.tapCorrectSum}
            </AppText>
          </View>
        </View>

        {/* 2x2 Option Targets */}
        <View style={styles.optionsGrid}>
          {challenge.options.map(option => {
            const isSelected = selectedOptionId === option.id;
            return (
              <TouchableOpacity
                key={option.id}
                onPress={() => handleSelectOption(option.id, option.value)}
                activeOpacity={0.8}
                style={[
                  styles.optionCard,
                  isSelected && styles.optionCardSelected,
                ]}
                accessible={true}
                accessibilityLabel={`Option ${option.letter}: ${option.value}`}
                accessibilityRole="button">
                <AppText
                  style={[
                    styles.optionLetter,
                    isSelected && styles.optionLetterSelected,
                  ]}>
                  {option.letter}
                </AppText>
                <AppText
                  style={[
                    styles.optionValue,
                    isSelected && styles.optionValueSelected,
                  ]}>
                  {option.value}
                </AppText>
                {isSelected ? (
                  <View style={styles.selectedBadge}>
                    <AppText style={styles.selectedBadgeText}>
                      {challengeScreenString.selectedText}
                    </AppText>
                  </View>
                ) : null}
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Rewards Ribbon */}
        <View style={styles.rewardDock}>
          <View style={styles.rewardLeft}>
            <AppText>🎖️</AppText>
            <AppText style={styles.rewardHeader}>
              {challengeScreenString.rewardHeader}
            </AppText>
          </View>

          <View style={styles.rewardBadgesRow}>
            <View style={styles.wpPill}>
              <AppText style={styles.wpPillText}>
                {challengeScreenString.rewardWp}
              </AppText>
            </View>
            <View style={styles.dayLockPill}>
              <AppText>🔥</AppText>
              <AppText style={styles.dayLockText}>
                {challengeScreenString.rewardStreak}
              </AppText>
            </View>
          </View>
        </View>

        {/* Emergency Snooze Button */}
        <TouchableOpacity
          onPress={handleEmergencySnooze}
          activeOpacity={0.8}
          style={styles.snoozeBtn}
          accessible={true}
          accessibilityLabel={challengeScreenString.emergencySnooze}
          accessibilityRole="button">
          <View style={styles.snoozeLeft}>
            <AppText>🌙</AppText>
            <AppText style={styles.snoozeText}>
              {challengeScreenString.emergencySnooze}
            </AppText>
          </View>

          <View style={styles.penaltyPill}>
            <AppText style={styles.penaltyPillText}>
              {challengeScreenString.snoozePenalty}
            </AppText>
          </View>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaContainer>
  );
};

export default memo(ChallengeScreen);
