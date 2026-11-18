import React, { FC, memo, useEffect, useRef } from 'react';
import { Animated, Easing, View } from 'react-native';
import { PulseDotProps } from '../../types';
import { Colors } from '../../theme/Colors';
import { moderateScale } from '../../theme/Metrics';
import { styles } from './PulseDotStyle';

const PulseDot: FC<PulseDotProps> = ({ color = Colors.primaryContainer, size = 6 }) => {
  const pulse = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const loop = Animated.loop(
      Animated.timing(pulse, {
        toValue: 1,
        duration: 1400,
        easing: Easing.out(Easing.quad),
        useNativeDriver: true,
      }),
    );
    loop.start();
    return () => loop.stop();
  }, [pulse]);

  const dotSize = moderateScale(size);
  const ringScale = pulse.interpolate({ inputRange: [0, 1], outputRange: [1, 2.6] });
  const ringOpacity = pulse.interpolate({ inputRange: [0, 1], outputRange: [0.6, 0] });

  return (
    <View style={{ width: dotSize, height: dotSize }}>
      <Animated.View
        style={[
          styles.dot,
          {
            width: dotSize,
            height: dotSize,
            borderRadius: dotSize / 2,
            backgroundColor: color,
            opacity: ringOpacity,
            transform: [{ scale: ringScale }],
          },
        ]}
      />
      <View
        style={[
          styles.dot,
          { width: dotSize, height: dotSize, borderRadius: dotSize / 2, backgroundColor: color },
        ]}
      />
    </View>
  );
};

export default memo(PulseDot);
