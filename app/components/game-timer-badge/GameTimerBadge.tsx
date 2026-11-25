import React, { FC, memo } from 'react';
import { View } from 'react-native';
import AppText from '../app-text/AppText';
import { GameTimerBadgeProps } from '../../types';
import { challengeScreenString } from '../../constants';
import { styles } from './GameTimerBadgeStyle';

const URGENT_THRESHOLD_SECONDS = 10;

// Floating top-right countdown shown over the wake-up games.
const GameTimerBadge: FC<GameTimerBadgeProps> = ({ remainingSeconds }) => {
  const isUrgent = remainingSeconds <= URGENT_THRESHOLD_SECONDS;

  return (
    <View
      pointerEvents="none"
      style={[styles.container, isUrgent && styles.containerUrgent]}
      accessible={true}
      accessibilityLabel={`${remainingSeconds} ${challengeScreenString.secondsLabel}`}
      accessibilityRole="timer">
      <AppText style={[styles.text, isUrgent && styles.textUrgent]}>
        {`${remainingSeconds}${challengeScreenString.secondsShort}`}
      </AppText>
    </View>
  );
};

export default memo(GameTimerBadge);
