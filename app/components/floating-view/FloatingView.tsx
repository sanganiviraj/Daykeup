import React, { FC, memo, useEffect, useRef } from 'react';
import { Animated, Easing } from 'react-native';
import { FloatingViewProps } from '../../types';
import { verticalScale } from '../../theme/Metrics';
import { styles } from './FloatingViewStyle';

// Gently bobs its children up and down forever (used for mascots).
const FloatingView: FC<FloatingViewProps> = ({
  children,
  amplitude = 6,
  duration = 1800,
  style,
}) => {
  const float = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(float, {
          toValue: 1,
          duration,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
        Animated.timing(float, {
          toValue: 0,
          duration,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
      ]),
    );
    loop.start();
    return () => loop.stop();
  }, [float, duration]);

  const translateY = float.interpolate({
    inputRange: [0, 1],
    outputRange: [0, -verticalScale(amplitude)],
  });

  return (
    <Animated.View style={[styles.container, style, { transform: [{ translateY }] }]}>
      {children}
    </Animated.View>
  );
};

export default memo(FloatingView);
