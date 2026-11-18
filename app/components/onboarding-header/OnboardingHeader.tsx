import React, { FC, memo, useEffect, useMemo, useRef } from 'react';
import { Animated, Easing, TouchableOpacity, View } from 'react-native';
import AppText from '../app-text/AppText';
import AppIcon from '../app-icon/AppIcon';
import { OnboardingHeaderProps } from '../../types';
import { onboardingString } from '../../constants';
import { Colors } from '../../theme/Colors';
import { moderateScale } from '../../theme/Metrics';
import { HIT_SLOP, styles } from './OnboardingHeaderStyle';

const OnboardingHeader: FC<OnboardingHeaderProps> = ({
  step,
  totalSteps,
  onBackPress,
  onSkipPress,
}) => {
  const progress = useRef(new Animated.Value(0)).current;

  // Fills the segments one after another whenever the step changes.
  useEffect(() => {
    Animated.timing(progress, {
      toValue: step + 1,
      duration: 520,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: false,
    }).start();
  }, [step, progress]);

  const segments = useMemo(
    () => Array.from({ length: totalSteps }, (_, index) => index),
    [totalSteps],
  );
  const isFirst = step === 0;
  const isLast = step === totalSteps - 1;

  return (
    <View style={styles.container}>
      <View style={styles.topRow}>
        {isFirst ? (
          <View style={styles.brandPill}>
            <AppIcon name="flame" size={moderateScale(14)} color={Colors.primaryContainer} />
            <AppText style={styles.brandText}>{onboardingString.brandName}</AppText>
          </View>
        ) : (
          <TouchableOpacity
            style={styles.backButton}
            onPress={onBackPress}
            hitSlop={HIT_SLOP}
            accessibilityRole="button"
            accessibilityLabel={onboardingString.backAria}
            testID="onboarding-back">
            <AppIcon name="chevronLeft" size={moderateScale(22)} color={Colors.onboardingBody} />
          </TouchableOpacity>
        )}
        {isLast ? null : (
          <TouchableOpacity
            style={styles.skipButton}
            onPress={onSkipPress}
            hitSlop={HIT_SLOP}
            accessibilityRole="button"
            accessibilityLabel={onboardingString.skipAria}
            testID="onboarding-skip">
            <AppText style={styles.skipText}>{onboardingString.skip}</AppText>
          </TouchableOpacity>
        )}
      </View>

      <View
        style={styles.progressRow}
        accessible
        accessibilityRole="progressbar"
        accessibilityLabel={onboardingString.progressAria}
        accessibilityValue={{ min: 1, max: totalSteps, now: step + 1 }}>
        {segments.map(index => {
          const width = progress.interpolate({
            inputRange: [index, index + 1],
            outputRange: ['0%', '100%'],
            extrapolate: 'clamp',
          });
          return (
            <View key={index} style={styles.segmentTrack}>
              <Animated.View style={[styles.segmentFill, { width }]} />
            </View>
          );
        })}
      </View>
    </View>
  );
};

export default memo(OnboardingHeader);
