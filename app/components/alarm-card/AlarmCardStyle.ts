import { StyleSheet } from 'react-native';
import { Colors } from '../../theme/Colors';
import { horizontalScale, moderateScale, verticalScale } from '../../theme/Metrics';

export const styles = StyleSheet.create({
  alarmCard: {
    backgroundColor: Colors.white,
    borderWidth: 1,
    borderColor: Colors.grayBorder,
    borderRadius: verticalScale(16),
    paddingHorizontal: horizontalScale(16),
    paddingVertical: verticalScale(14),
    marginBottom: verticalScale(12),
  },
  alarmCardInactive: {
    backgroundColor: Colors.creamBackground,
  },
  alarmCardTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  alarmMetaLeft: {
    flex: 1,
    marginRight: horizontalScale(12),
  },
  alarmNameLabel: {
    fontSize: moderateScale(13),
    fontWeight: '500',
    color: Colors.textMuted,
  },
  alarmTimeRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  alarmTimeText: {
    fontSize: moderateScale(40),
    fontWeight: '600',
    color: Colors.textDark,
    letterSpacing: -horizontalScale(1),
  },
  alarmPeriodText: {
    fontSize: moderateScale(15),
    fontWeight: '600',
    color: Colors.textDark,
    marginLeft: horizontalScale(4),
  },
  textInactive: {
    color: Colors.textMuted,
  },

  // Toggle Switch
  toggleTrack: {
    width: horizontalScale(48),
    height: verticalScale(28),
    borderRadius: verticalScale(14),
    backgroundColor: Colors.brandOrange,
    padding: verticalScale(2),
    justifyContent: 'center',
  },
  toggleTrackOff: {
    backgroundColor: Colors.grayLight,
  },
  toggleThumb: {
    width: verticalScale(24),
    height: verticalScale(24),
    borderRadius: verticalScale(12),
    backgroundColor: Colors.white,
    alignSelf: 'flex-end',
  },
  toggleThumbOff: {
    alignSelf: 'flex-start',
  },

  // Alarm Card Bottom (Days & Challenge)
  alarmCardBottom: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: verticalScale(10),
  },
  daysRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  dayChipText: {
    fontSize: moderateScale(12),
    fontWeight: '600',
    color: Colors.grayLight,
    marginRight: horizontalScale(8),
  },
  dayChipTextActive: {
    color: Colors.brandOrange,
  },
  challengeInfoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flexShrink: 1,
  },
  challengeInfoIcon: {
    marginRight: horizontalScale(4),
  },
  challengeInfoText: {
    fontSize: moderateScale(12),
    fontWeight: '500',
    color: Colors.onSurfaceVariant,
  },
});
