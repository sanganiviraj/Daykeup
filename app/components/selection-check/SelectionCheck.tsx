import React, { FC, memo, useEffect, useRef } from 'react';
import { Animated, Easing } from 'react-native';
import AppIcon from '../app-icon/AppIcon';
import { SelectionCheckProps } from '../../types';
import { Colors } from '../../theme/Colors';
import { moderateScale } from '../../theme/Metrics';
import { styles } from './SelectionCheckStyle';

// Round check badge that pops in when its card becomes selected.
const SelectionCheck: FC<SelectionCheckProps> = ({ selected, size = 24, style }) => {
  const progress = useRef(new Animated.Value(selected ? 1 : 0)).current;

  useEffect(() => {
    Animated.timing(progress, {
      toValue: selected ? 1 : 0,
      duration: 260,
      easing: Easing.out(Easing.back(2)),
      useNativeDriver: true,
    }).start();
  }, [selected, progress]);

  const badgeSize = moderateScale(size);
  const scale = progress.interpolate({ inputRange: [0, 1], outputRange: [0.7, 1] });

  return (
    <Animated.View
      style={[
        styles.base,
        { width: badgeSize, height: badgeSize, borderRadius: badgeSize / 2 },
        selected ? styles.selected : styles.unselected,
        style,
        { transform: [{ scale }] },
      ]}>
      <Animated.View style={{ opacity: progress }}>
        <AppIcon name="check" size={badgeSize * 0.6} color={Colors.white} strokeWidth={3} />
      </Animated.View>
    </Animated.View>
  );
};

export default memo(SelectionCheck);
