import React, { FC, memo, useEffect, useRef, useState } from 'react';
import { Animated, LayoutChangeEvent, Pressable, View } from 'react-native';
import AppText from '../app-text/AppText';
import { SegmentedControlProps } from '../../types';
import { SEGMENT_PADDING, styles } from './SegmentedControlStyle';

// Pill-shaped selector with a thumb that slides to the active option.
const SegmentedControl: FC<SegmentedControlProps> = ({
  options,
  selectedIndex,
  onChange,
  testID,
}) => {
  const [trackWidth, setTrackWidth] = useState(0);
  const thumbX = useRef(new Animated.Value(0)).current;
  const segmentWidth =
    trackWidth > 0 ? (trackWidth - SEGMENT_PADDING * 2) / options.length : 0;

  useEffect(() => {
    Animated.spring(thumbX, {
      toValue: selectedIndex * segmentWidth,
      friction: 8,
      tension: 90,
      useNativeDriver: true,
    }).start();
  }, [selectedIndex, segmentWidth, thumbX]);

  const handleLayout = (event: LayoutChangeEvent) => {
    setTrackWidth(event.nativeEvent.layout.width);
  };

  return (
    <View style={styles.track} onLayout={handleLayout} testID={testID}>
      {segmentWidth > 0 ? (
        <Animated.View
          style={[
            styles.thumb,
            { width: segmentWidth, transform: [{ translateX: thumbX }] },
          ]}
        />
      ) : null}
      {options.map((label, index) => {
        const isSelected = index === selectedIndex;
        return (
          <Pressable
            key={label}
            style={styles.segment}
            onPress={() => onChange(index)}
            accessible
            accessibilityRole="radio"
            accessibilityLabel={label}
            accessibilityState={{ selected: isSelected }}
            testID={testID ? `${testID}-${index}` : undefined}>
            <AppText style={[styles.label, isSelected && styles.labelSelected]}>
              {label}
            </AppText>
          </Pressable>
        );
      })}
    </View>
  );
};

export default memo(SegmentedControl);
