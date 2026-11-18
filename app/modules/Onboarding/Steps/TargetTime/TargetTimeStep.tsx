import React, { FC, memo, useCallback, useEffect, useRef } from 'react';
import { Animated, TouchableOpacity, View } from 'react-native';
import {
  AnimatedEntrance,
  AppIcon,
  AppText,
  SelectableCard,
} from '../../../../components';
import {
  commonString,
  onboardingString,
  TARGET_SLEEP_MINUTES,
} from '../../../../constants';
import { useAppDispatch, useAppSelector } from '../../../../hooks';
import { shiftWakeTime, toggleOnboardingDay } from '../../../../redux';
import { formatRepeatDays, formatTime12, minutesToTime12 } from '../../../../utils';
import { Colors } from '../../../../theme/Colors';
import { moderateScale } from '../../../../theme/Metrics';
import { commonStyles } from '../../OnboardingCommonStyles';
import { SUNRISE_BARS, styles } from './TargetTimeStepStyles';

const TargetTimeStep: FC = () => {
  const dispatch = useAppDispatch();
  const { wakeMinutes, repeatDays } = useAppSelector(state => state.onboarding);
  const bump = useRef(new Animated.Value(1)).current;
  const isFirstRender = useRef(true);

  // Small "pop" on the clock digits every time the time changes.
  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    bump.setValue(1.08);
    Animated.spring(bump, { toValue: 1, friction: 5, tension: 160, useNativeDriver: true }).start();
  }, [wakeMinutes, bump]);

  const handleShift = useCallback(
    (direction: 1 | -1) => dispatch(shiftWakeTime(direction)),
    [dispatch],
  );
  const handleDayPress = useCallback(
    (index: number) => dispatch(toggleOnboardingDay(index)),
    [dispatch],
  );

  const wake = minutesToTime12(wakeMinutes);
  const bedtime = formatTime12(minutesToTime12(wakeMinutes - TARGET_SLEEP_MINUTES));
  const wakeLabel = formatTime12(wake);

  return (
    <View style={commonStyles.stepContainer} testID="onboarding-step-time">
      <AnimatedEntrance style={commonStyles.titleBlock}>
        <AppText
          style={commonStyles.title}
          accessibilityRole="header"
          numberOfLines={1}
          adjustsFontSizeToFit
          minimumFontScale={0.75}>
          {onboardingString.timeTitle}
        </AppText>
        <AppText style={commonStyles.subtitle}>{onboardingString.timeSubtitle}</AppText>
      </AnimatedEntrance>

      <AnimatedEntrance delay={120}>
        <View style={styles.clockCard}>
          <View style={styles.clockRow}>
            <TouchableOpacity
              style={[styles.stepper, styles.stepperMinus]}
              onPress={() => handleShift(-1)}
              activeOpacity={0.7}
              accessibilityRole="button"
              accessibilityLabel={onboardingString.decreaseTimeAria}
              testID="onboarding-time-minus">
              <AppIcon name="minus" size={moderateScale(22)} color={Colors.primary} strokeWidth={2.5} />
            </TouchableOpacity>

            <Animated.View
              style={styles.timeBlock}
              accessible
              accessibilityRole="text"
              accessibilityLabel={`${onboardingString.targetWakeLabel} ${wakeLabel}`}
              accessibilityLiveRegion="polite">
              <Animated.View style={[styles.timeRow, { transform: [{ scale: bump }] }]}>
                <AppText style={styles.timeText} testID="onboarding-time-display">
                  {`${wake.hour}:${wake.minute}`}
                </AppText>
                <AppText style={styles.periodText}>{wake.period}</AppText>
              </Animated.View>
              <AppText style={styles.timeCaption}>{onboardingString.targetWakeLabel}</AppText>
            </Animated.View>

            <TouchableOpacity
              style={[styles.stepper, styles.stepperPlus]}
              onPress={() => handleShift(1)}
              activeOpacity={0.7}
              accessibilityRole="button"
              accessibilityLabel={onboardingString.increaseTimeAria}
              testID="onboarding-time-plus">
              <AppIcon name="plus" size={moderateScale(22)} color={Colors.primary} strokeWidth={2.5} />
            </TouchableOpacity>
          </View>

          <View style={styles.restBadge}>
            <AppIcon name="moon" size={moderateScale(15)} color={Colors.brandPurple} />
            <AppText style={styles.restText}>
              <AppText style={styles.restStrong}>{onboardingString.restDuration}</AppText>
              {onboardingString.restText}
              <AppText style={styles.restStrong}>{bedtime}</AppText>
            </AppText>
          </View>

          <View style={styles.sunriseRow}>
            {SUNRISE_BARS.map((bar, index) => (
              <AnimatedEntrance
                key={bar.key}
                delay={320 + index * 90}
                offsetY={6}
                style={[styles.sunriseBar, bar.style]}>
                <View />
              </AnimatedEntrance>
            ))}
          </View>
        </View>
      </AnimatedEntrance>

      <AnimatedEntrance delay={240}>
        <View style={styles.repeatCard}>
          <View style={commonStyles.sectionHeader}>
            <AppText style={styles.repeatTitle}>{onboardingString.repeatTitle}</AppText>
            <AppText style={commonStyles.sectionHint}>{formatRepeatDays(repeatDays)}</AppText>
          </View>
          <View style={styles.dayRow}>
            {onboardingString.shortDayLetters.map((letter, index) => {
              const selected = repeatDays.includes(index);
              return (
                <SelectableCard
                  key={`${letter}-${index}`}
                  selected={selected}
                  onPress={() => handleDayPress(index)}
                  accessibilityRole="checkbox"
                  accessibilityLabel={commonString.shortDayNames[index]}
                  style={styles.dayChip}
                  contentStyle={styles.dayChipContent}
                  selectedBackgroundColor={Colors.primaryContainer}
                  unselectedBackgroundColor={Colors.onboardingSurfaceLow}
                  unselectedBorderColor={Colors.onboardingSurfaceLow}
                  testID={`onboarding-day-${index}`}>
                  <AppText style={[styles.dayText, selected && styles.dayTextSelected]}>
                    {letter}
                  </AppText>
                </SelectableCard>
              );
            })}
          </View>
        </View>
      </AnimatedEntrance>

      <AnimatedEntrance delay={340}>
        <View style={styles.insight}>
          <View style={styles.insightIcon}>
            <AppIcon name="badgeCheck" size={moderateScale(18)} color={Colors.white} />
          </View>
          <AppText style={styles.insightText}>
            {onboardingString.timeInsightPrefix}
            <AppText style={styles.insightStrong}>{wakeLabel}</AppText>
            {onboardingString.timeInsightSuffix}
          </AppText>
        </View>
      </AnimatedEntrance>
    </View>
  );
};

export default memo(TargetTimeStep);
