import React, { FC, memo } from 'react';
import { TouchableOpacity, View } from 'react-native';
import AppText from '../app-text/AppText';
import AppIcon from '../app-icon/AppIcon';
import {
  alarmListScreenString,
  challengeIcons,
  challengeNames,
  createAlarmString,
  homeScreenString,
} from '../../constants';
import { AlarmCardProps } from '../../types';
import { Colors } from '../../theme/Colors';
import { styles } from './AlarmCardStyle';

const DAY_LABELS = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];

const AlarmCard: FC<AlarmCardProps> = ({ alarm, onPress, onToggle }) => {
  const isEnabled = alarm.enabled;
  const alarmName =
    alarm.label || alarm.title || alarmListScreenString.defaultAlarmLabel;
  const difficultyTitle = createAlarmString[alarm.difficulty];

  return (
    <TouchableOpacity
      style={[styles.alarmCard, !isEnabled && styles.alarmCardInactive]}
      onPress={onPress}
      activeOpacity={0.85}
      accessible={true}
      accessibilityLabel={alarmName}
      accessibilityRole="button">
      <View style={styles.alarmCardTop}>
        <View style={styles.alarmMetaLeft}>
          <AppText style={styles.alarmNameLabel} numberOfLines={1}>
            {alarmName}
          </AppText>

          <View style={styles.alarmTimeRow}>
            <AppText
              style={[styles.alarmTimeText, !isEnabled && styles.textInactive]}>
              {`${alarm.hour}:${alarm.minute}`}
            </AppText>
            <AppText
              style={[
                styles.alarmPeriodText,
                !isEnabled && styles.textInactive,
              ]}>
              {alarm.period}
            </AppText>
          </View>
        </View>

        <TouchableOpacity
          style={[styles.toggleTrack, !isEnabled && styles.toggleTrackOff]}
          onPress={onToggle}
          activeOpacity={0.8}
          accessible={true}
          accessibilityLabel={homeScreenString.toggleAlarmAria}
          accessibilityRole="switch"
          accessibilityState={{ checked: isEnabled }}>
          <View
            style={[styles.toggleThumb, !isEnabled && styles.toggleThumbOff]}
          />
        </TouchableOpacity>
      </View>

      <View style={styles.alarmCardBottom}>
        <View style={styles.daysRow}>
          {DAY_LABELS.map((day, index) => {
            const isSelected = alarm.repeatDays?.includes(index);
            return (
              <AppText
                key={`${alarm.id}-day-${index}`}
                style={[
                  styles.dayChipText,
                  isSelected && isEnabled && styles.dayChipTextActive,
                ]}>
                {day}
              </AppText>
            );
          })}
        </View>

        <View style={styles.challengeInfoRow}>
          <AppIcon
            name={challengeIcons[alarm.challengeType]}
            size="xs"
            color={Colors.onSurfaceVariant}
            style={styles.challengeInfoIcon}
          />
          <AppText style={styles.challengeInfoText} numberOfLines={1}>
            {`${challengeNames[alarm.challengeType]} · ${difficultyTitle}`}
          </AppText>
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default memo(AlarmCard);
