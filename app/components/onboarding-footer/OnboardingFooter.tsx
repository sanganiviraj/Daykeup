import React, { FC, memo, useEffect, useRef } from 'react';
import { Animated, Easing, Pressable, View } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import AppText from '../app-text/AppText';
import AppIcon from '../app-icon/AppIcon';
import { OnboardingFooterProps } from '../../types';
import { Colors } from '../../theme/Colors';
import { horizontalScale, moderateScale } from '../../theme/Metrics';
import { GRADIENT_END, GRADIENT_START, styles } from './OnboardingFooterStyle';

// Primary call-to-action: gradient pill with a press-scale and a nudging arrow.
const OnboardingFooter: FC<OnboardingFooterProps> = ({
  title,
  iconName,
  onPress,
  disabled = false,
  testID,
}) => {
  const scale = useRef(new Animated.Value(1)).current;
  const nudge = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(nudge, {
          toValue: 1,
          duration: 700,
          easing: Easing.inOut(Easing.quad),
          useNativeDriver: true,
        }),
        Animated.timing(nudge, {
          toValue: 0,
          duration: 700,
          easing: Easing.inOut(Easing.quad),
          useNativeDriver: true,
        }),
      ]),
    );
    loop.start();
    return () => loop.stop();
  }, [nudge]);

  const handlePressIn = () => {
    Animated.spring(scale, {
      toValue: 0.97,
      speed: 40,
      bounciness: 0,
      useNativeDriver: true,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scale, {
      toValue: 1,
      speed: 40,
      bounciness: 8,
      useNativeDriver: true,
    }).start();
  };

  const translateX = nudge.interpolate({
    inputRange: [0, 1],
    outputRange: [0, horizontalScale(4)],
  });

  return (
    <View style={styles.container}>
      <Pressable
        onPress={onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        disabled={disabled}
        accessible
        accessibilityRole="button"
        accessibilityLabel={title}
        accessibilityState={{ disabled }}
        testID={testID}>
        <Animated.View
          style={[styles.shadow, disabled && styles.disabled, { transform: [{ scale }] }]}>
          <LinearGradient
            colors={[Colors.primaryContainer, Colors.primary]}
            start={GRADIENT_START}
            end={GRADIENT_END}
            style={styles.button}>
            <AppText style={styles.title}>{title}</AppText>
            <Animated.View style={{ transform: [{ translateX }] }}>
              <AppIcon name={iconName} size={moderateScale(18)} color={Colors.white} />
            </Animated.View>
          </LinearGradient>
        </Animated.View>
      </Pressable>
    </View>
  );
};

export default memo(OnboardingFooter);
