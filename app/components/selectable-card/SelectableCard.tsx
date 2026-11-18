import React, { FC, memo, useEffect, useRef } from 'react';
import { Animated, Easing, Pressable } from 'react-native';
import { SelectableCardProps } from '../../types';
import { Colors } from '../../theme/Colors';
import { styles } from './SelectableCardStyle';

// Pressable card whose background/border cross-fade when selected and that
// "pops" with a spring when it becomes the active choice.
const SelectableCard: FC<SelectableCardProps> = ({
  selected,
  onPress,
  children,
  accessibilityLabel,
  accessibilityRole = 'radio',
  style,
  contentStyle,
  selectedBackgroundColor = Colors.amberTint,
  unselectedBackgroundColor = Colors.white,
  selectedBorderColor = Colors.primaryContainer,
  unselectedBorderColor = Colors.onboardingTrack,
  testID,
}) => {
  const selection = useRef(new Animated.Value(selected ? 1 : 0)).current;
  const scale = useRef(new Animated.Value(1)).current;
  const isFirstRender = useRef(true);

  useEffect(() => {
    Animated.timing(selection, {
      toValue: selected ? 1 : 0,
      duration: 240,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: false,
    }).start();

    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    if (selected) {
      scale.setValue(0.95);
      Animated.spring(scale, {
        toValue: 1,
        friction: 4,
        tension: 140,
        useNativeDriver: true,
      }).start();
    }
  }, [selected, selection, scale]);

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
      bounciness: 6,
      useNativeDriver: true,
    }).start();
  };

  const backgroundColor = selection.interpolate({
    inputRange: [0, 1],
    outputRange: [unselectedBackgroundColor, selectedBackgroundColor],
  });
  const borderColor = selection.interpolate({
    inputRange: [0, 1],
    outputRange: [unselectedBorderColor, selectedBorderColor],
  });

  return (
    <Pressable
      onPress={onPress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      style={style}
      accessible
      accessibilityRole={accessibilityRole}
      accessibilityLabel={accessibilityLabel}
      accessibilityState={{ selected, checked: selected }}
      testID={testID}>
      <Animated.View style={[styles.scaleLayer, { transform: [{ scale }] }]}>
        <Animated.View
          style={[styles.card, contentStyle, { backgroundColor, borderColor }]}>
          {children}
        </Animated.View>
      </Animated.View>
    </Pressable>
  );
};

export default memo(SelectableCard);
