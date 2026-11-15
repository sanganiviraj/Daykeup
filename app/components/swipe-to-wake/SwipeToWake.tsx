import React, { FC, memo, useRef, useState } from 'react';
import {
  Animated,
  PanResponder,
  View,
  LayoutChangeEvent,
} from 'react-native';
import AppText from '../app-text/AppText';
import AppIcon from '../app-icon/AppIcon';
import { Colors } from '../../theme/Colors';
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

  // The responder is created once, so read live values through refs
  // instead of the stale closure from the first render.
  const maxDragRef = useRef<number>(0);
  maxDragRef.current = maxDrag;
  const onSwipeCompleteRef = useRef(onSwipeComplete);
  onSwipeCompleteRef.current = onSwipeComplete;
  const isCompletedRef = useRef<boolean>(false);

  const onLayout = (e: LayoutChangeEvent) => {
    setTrackWidth(e.nativeEvent.layout.width);
  };

  const resetKnob = () => {
    Animated.spring(pan, {
      toValue: 0,
      friction: 5,
      tension: 40,
      useNativeDriver: false,
    }).start();
  };

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => !isCompletedRef.current,
      onMoveShouldSetPanResponder: () => !isCompletedRef.current,
      onPanResponderTerminationRequest: () => false,
      onPanResponderMove: (_, gestureState) => {
        const clamped = Math.min(
          Math.max(gestureState.dx, 0),
          maxDragRef.current,
        );
        pan.setValue(clamped);
      },
      onPanResponderRelease: (_, gestureState) => {
        const max = maxDragRef.current;
        if (max > 0 && gestureState.dx >= max * 0.85) {
          isCompletedRef.current = true;
          Animated.timing(pan, {
            toValue: max,
            duration: 150,
            useNativeDriver: false,
          }).start(() => {
            onSwipeCompleteRef.current();
          });
        } else {
          resetKnob();
        }
      },
      onPanResponderTerminate: resetKnob,
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
          <AppIcon name="chevronRight" size="xl" strokeWidth={2.5} color={Colors.white} />
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

