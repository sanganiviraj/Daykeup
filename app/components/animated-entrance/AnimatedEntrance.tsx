import React, { FC, memo, useEffect, useRef } from 'react';
import { Animated, Easing } from 'react-native';
import { AnimatedEntranceProps } from '../../types';
import { verticalScale } from '../../theme/Metrics';
import { styles } from './AnimatedEntranceStyle';

// Fades + slides its children up on mount. Stagger siblings with `delay`.
const AnimatedEntrance: FC<AnimatedEntranceProps> = ({
  children,
  delay = 0,
  offsetY = 24,
  duration = 520,
  style,
}) => {
  const progress = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const animation = Animated.timing(progress, {
      toValue: 1,
      duration,
      delay,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: true,
    });
    animation.start();
    return () => animation.stop();
  }, [progress, delay, duration]);

  const translateY = progress.interpolate({
    inputRange: [0, 1],
    outputRange: [verticalScale(offsetY), 0],
  });

  return (
    <Animated.View
      style={[styles.container, style, { opacity: progress, transform: [{ translateY }] }]}>
      {children}
    </Animated.View>
  );
};

export default memo(AnimatedEntrance);
