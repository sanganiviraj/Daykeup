import React, { FC, memo, useCallback, useEffect, useRef, useState } from 'react';
import {
  Animated,
  BackHandler,
  Easing,
  Keyboard,
  KeyboardAvoidingView,
  ScrollView,
  View,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import LinearGradient from 'react-native-linear-gradient';
import { OnboardingFooter, OnboardingHeader, SafeAreaContainer } from '../../components';
import {
  createAlarmString,
  onboardingFooters,
  onboardingString,
  ONBOARDING_LAST_STEP,
  ONBOARDING_TOTAL_STEPS,
  Routes,
} from '../../constants';
import { useAppDispatch, useAppSelector } from '../../hooks';
import { saveAlarm, setUserName } from '../../redux';
import { AlarmService } from '../../services';
import { AlarmItem, RootStackParamList } from '../../types';
import { Colors } from '../../theme/Colors';
import { globalMetrics, horizontalScale } from '../../theme/Metrics';
import { minutesToTime12 } from '../../utils';
import WelcomeStep from './Steps/Welcome/WelcomeStep';
import RhythmStep from './Steps/Rhythm/RhythmStep';
import TargetTimeStep from './Steps/TargetTime/TargetTimeStep';
import MissionStep from './Steps/Mission/MissionStep';
import ReadyStep from './Steps/Ready/ReadyStep';
import { BACKDROP_GRADIENT, styles } from './OnboardingScreenStyles';

type OnboardingNavProp = NativeStackNavigationProp<RootStackParamList>;

const STEP_SHIFT = horizontalScale(32);
const LAUNCH_DELAY_MS = 900;

const steps: ReadonlyArray<FC> = [WelcomeStep, RhythmStep, TargetTimeStep, MissionStep, ReadyStep];

const OnboardingScreen: FC = () => {
  const navigation = useNavigation<OnboardingNavProp>();
  const dispatch = useAppDispatch();
  const profile = useAppSelector(state => state.onboarding);
  const existingAlarms = useAppSelector(state => state.alarm.alarms);

  const [step, setStep] = useState(0);
  const [isLaunching, setIsLaunching] = useState(false);

  const opacity = useRef(new Animated.Value(1)).current;
  const translateX = useRef(new Animated.Value(0)).current;
  const direction = useRef<1 | -1>(1);
  const isTransitioning = useRef(false);
  const isFirstRender = useRef(true);
  const launchTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Slide + fade the new step in after the old one has faded out.
  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    translateX.setValue(direction.current * STEP_SHIFT);
    Animated.parallel([
      Animated.timing(opacity, {
        toValue: 1,
        duration: 320,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
      Animated.timing(translateX, {
        toValue: 0,
        duration: 360,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
    ]).start(() => {
      isTransitioning.current = false;
    });
  }, [step, opacity, translateX]);

  useEffect(
    () => () => {
      if (launchTimer.current) {
        clearTimeout(launchTimer.current);
      }
    },
    [],
  );

  const goTo = useCallback(
    (next: number) => {
      if (isTransitioning.current || next < 0 || next > ONBOARDING_LAST_STEP) {
        return;
      }
      isTransitioning.current = true;
      direction.current = next > step ? 1 : -1;
      Keyboard.dismiss();
      Animated.parallel([
        Animated.timing(opacity, {
          toValue: 0,
          duration: 160,
          easing: Easing.in(Easing.quad),
          useNativeDriver: true,
        }),
        Animated.timing(translateX, {
          toValue: -direction.current * STEP_SHIFT,
          duration: 160,
          easing: Easing.in(Easing.quad),
          useNativeDriver: true,
        }),
      ]).start(() => setStep(next));
    },
    [step, opacity, translateX],
  );

  const finish = useCallback(
    (createAlarm: boolean) => {
      const trimmedName = profile.name.trim();
      if (trimmedName) {
        dispatch(setUserName(trimmedName));
      }

      if (createAlarm) {
        const { hour, minute, period } = minutesToTime12(profile.wakeMinutes);
        const now = new Date().toISOString();
        const alarm: AlarmItem = {
          id: `alarm-${Date.now()}`,
          title: createAlarmString.defaultAlarmName,
          label: createAlarmString.defaultAlarmName,
          hour,
          minute,
          period,
          enabled: true,
          repeatDays: profile.repeatDays,
          challengeType: profile.mission,
          difficulty: profile.difficulty,
          vibrationEnabled: true,
          motivationalQuote: createAlarmString.defaultQuote,
          createdAt: now,
          updatedAt: now,
        };
        dispatch(saveAlarm(alarm));
        AlarmService.schedule(alarm);
        AlarmService.saveAllAlarms([alarm, ...existingAlarms]);
      }

      AlarmService.markOnboardingCompleted();
      navigation.reset({ index: 0, routes: [{ name: Routes.home }] });
    },
    [dispatch, existingAlarms, navigation, profile],
  );

  const handleNext = useCallback(() => {
    if (step < ONBOARDING_LAST_STEP) {
      goTo(step + 1);
      return;
    }
    if (isLaunching) {
      return;
    }
    setIsLaunching(true);
    launchTimer.current = setTimeout(() => finish(true), LAUNCH_DELAY_MS);
  }, [step, goTo, isLaunching, finish]);

  const handleBack = useCallback(() => goTo(step - 1), [goTo, step]);
  const handleSkip = useCallback(() => finish(false), [finish]);

  // Android hardware back walks back through the steps instead of leaving the app.
  useEffect(() => {
    const subscription = BackHandler.addEventListener('hardwareBackPress', () => {
      if (isLaunching) {
        return true;
      }
      if (step > 0) {
        goTo(step - 1);
        return true;
      }
      return false;
    });
    return () => subscription.remove();
  }, [step, goTo, isLaunching]);

  const StepComponent = steps[step];
  const footer = onboardingFooters[step];
  const isLastStep = step === ONBOARDING_LAST_STEP;

  return (
    <SafeAreaContainer
      edges={['top', 'left', 'right', 'bottom']}
      backgroundColor={Colors.onboardingBg}>
      <LinearGradient
        colors={BACKDROP_GRADIENT}
        style={styles.backdrop}
        pointerEvents="none"
      />
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={globalMetrics.isIos ? 'padding' : undefined}>
        <OnboardingHeader
          step={step}
          totalSteps={ONBOARDING_TOTAL_STEPS}
          onBackPress={handleBack}
          onSkipPress={handleSkip}
        />
        <Animated.View
          style={[styles.flex, { opacity, transform: [{ translateX }] }]}
          testID={`onboarding-step-${step}`}>
          <ScrollView
            key={step}
            style={styles.flex}
            contentContainerStyle={styles.content}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}>
            <StepComponent />
          </ScrollView>
        </Animated.View>
        <View>
          <OnboardingFooter
            title={isLastStep && isLaunching ? onboardingString.readyLaunching : footer.title}
            iconName={footer.icon}
            onPress={handleNext}
            disabled={isLaunching}
            testID="onboarding-cta"
          />
        </View>
      </KeyboardAvoidingView>
    </SafeAreaContainer>
  );
};

export default memo(OnboardingScreen);
