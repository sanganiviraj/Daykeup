import React, { FC, memo, useRef, useState } from 'react';
import {
  Animated,
  PanResponder,
  View,
  LayoutChangeEvent,
} from 'react-native';
import AppText from '../app-text/AppText';
import { SwipeToWakeProps } from '../../types';
import { alarmRingingString } from '../../constants';
import { styles } from './SwipeToWakeStyle';
import { verticalScale } from '../../theme/Metrics';

const SwipeToWake: FC<SwipeToWakeProps> = ({
  onSwipeComplete,
  style,
  testID = 'swipe-to-wake',
}) => {
  const [trackWidth, setTrackWidth] = useState<number>(0);
  const knobWidth = verticalScale(56);
  const padding = 4;
  const maxDrag = Math.max(0, trackWidth - knobWidth - padding * 2);

  const pan = useRef(new Animated.Value(0)).current;

  const onLayout = (e: LayoutChangeEvent) => {
    setTrackWidth(e.nativeEvent.layout.width);
  };

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onPanResponderMove: (_, gestureState) => {
        if (gestureState.dx > 0) {
          const clamped = Math.min(gestureState.dx, maxDrag > 0 ? maxDrag : 250);
          pan.setValue(clamped);
        }
      },
      onPanResponderRelease: (_, gestureState) => {
        const threshold = maxDrag > 0 ? maxDrag * 0.85 : 200;
        if (gestureState.dx >= threshold) {
          Animated.timing(pan, {
            toValue: maxDrag > 0 ? maxDrag : 250,
            duration: 150,
            useNativeDriver: false,
          }).start(() => {
            onSwipeComplete();
          });
        } else {
          Animated.spring(pan, {
            toValue: 0,
            friction: 5,
            tension: 40,
            useNativeDriver: false,
          }).start();
        }
      },
    }),
  ).current;

  return (
    <View style={[styles.container, style]} testID={testID}>
      <View style={styles.track} onLayout={onLayout}>
        <Animated.View
          style={[
            styles.progressFill,
            {
              width: pan.interpolate({
                inputRange: [0, Math.max(1, maxDrag)],
                outputRange: [0, trackWidth],
                extrapolate: 'clamp',
              }),
            },
          ]}
        />

        <View style={styles.trackTextContainer} pointerEvents="none">
          <AppText style={styles.trackText}>
            {alarmRingingString.swipeToConquer}
          </AppText>
        </View>

        <Animated.View
          {...panResponder.panHandlers}
          style={[
            styles.knob,
            {
              transform: [{ translateX: pan }],
            },
          ]}>
          <AppText style={styles.knobArrow}>➔</AppText>
        </Animated.View>
      </View>

      <View style={styles.hintTextContainer}>
        <AppText style={styles.hintText}>
          {alarmRingingString.swipeHint}
          <AppText style={styles.hintHighlight}>
            {alarmRingingString.swipeHintXp}
          </AppText>
        </AppText>
      </View>
    </View>
  );
};

export default memo(SwipeToWake);

