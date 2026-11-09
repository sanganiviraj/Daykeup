import React, { FC, memo } from 'react';
import { View } from 'react-native';
import AppText from '../app-text/AppText';
import { CountdownDialProps } from '../../types';
import { challengeScreenString } from '../../constants';
import { styles } from './CountdownDialStyle';
import { Colors } from '../../theme/Colors';

const CountdownDial: FC<CountdownDialProps> = ({
  totalSeconds,
  remainingSeconds,
}) => {
  const percentage = Math.max(0, Math.min(1, remainingSeconds / totalSeconds));
  const isUrgent = remainingSeconds <= 10;

  return (
    <View style={styles.container}>
      <View
        style={[
          styles.dialCircle,
          { borderColor: isUrgent ? Colors.melon : Colors.azure },
        ]}>
        <View style={styles.innerDial}>
          <AppText style={styles.secondsNumber}>{remainingSeconds}</AppText>
          <AppText style={styles.secondsLabel}>
            {challengeScreenString.secondsLabel}
          </AppText>
        </View>
      </View>

      <View style={styles.urgencyBarTrack}>
        <View
          style={[
            styles.urgencyBarFill,
            {
              width: `${percentage * 100}%`,
              backgroundColor: isUrgent ? Colors.melon : Colors.azure,
            },
          ]}
        />
      </View>
    </View>
  );
};

export default memo(CountdownDial);

