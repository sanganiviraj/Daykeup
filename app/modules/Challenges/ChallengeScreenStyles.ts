import { StyleSheet } from 'react-native';
import { Colors } from '../../theme/Colors';
import { verticalScale, horizontalScale, moderateScale } from '../../theme/Metrics';

export const styles = StyleSheet.create({
  contentContainer: {
    paddingHorizontal: horizontalScale(20),
    paddingBottom: verticalScale(32),
  },
  challengeHeading: {
    fontSize: moderateScale(18),
    fontWeight: '700',
    color: Colors.textDark,
    textAlign: 'center',
    marginTop: verticalScale(8),
    marginBottom: verticalScale(20),
  },
  // Equation
  equationBox: {
    backgroundColor: Colors.white,
    borderRadius: verticalScale(16),
    borderWidth: 1,
    borderColor: Colors.grayBorder,
    paddingVertical: verticalScale(24),
    alignItems: 'center',
    marginBottom: verticalScale(16),
  },
  equationText: {
    fontSize: moderateScale(36),
    fontWeight: '700',
    color: Colors.textDark,
    letterSpacing: -horizontalScale(0.5),
  },
  instructionText: {
    fontSize: moderateScale(13),
    color: Colors.textMuted,
    marginTop: verticalScale(8),
  },
  // Options Grid
  optionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: verticalScale(8),
  },
  optionCard: {
    width: '48%',
    height: verticalScale(72),
    borderRadius: verticalScale(16),
    backgroundColor: Colors.white,
    borderWidth: 1,
    borderColor: Colors.grayBorder,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: verticalScale(12),
  },
  optionCardSelected: {
    backgroundColor: Colors.textDark,
    borderColor: Colors.textDark,
  },
  optionValue: {
    fontSize: moderateScale(26),
    fontWeight: '700',
    color: Colors.textDark,
  },
  optionValueSelected: {
    color: Colors.white,
  },
  // Reward note
  rewardRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: verticalScale(24),
  },
  rewardText: {
    fontSize: moderateScale(13),
    color: Colors.textSecondary,
    marginLeft: horizontalScale(6),
  },
  // Snooze
  snoozeBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
    paddingVertical: verticalScale(12),
    paddingHorizontal: horizontalScale(16),
  },
  snoozeText: {
    fontSize: moderateScale(14),
    fontWeight: '600',
    color: Colors.textSecondary,
    marginLeft: horizontalScale(6),
  },
  penaltyText: {
    fontSize: moderateScale(13),
    fontWeight: '500',
    color: Colors.error,
    marginLeft: horizontalScale(8),
  },
});
