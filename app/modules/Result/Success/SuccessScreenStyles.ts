import { StyleSheet } from 'react-native';
import { Colors } from '../../../theme/Colors';
import { verticalScale, horizontalScale, moderateScale } from '../../../theme/Metrics';

export const HERO_ICON_SIZE = moderateScale(44);

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: horizontalScale(24),
    paddingBottom: verticalScale(16),
    justifyContent: 'space-between',
  },
  centerContent: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconCircle: {
    width: verticalScale(96),
    height: verticalScale(96),
    borderRadius: verticalScale(48),
    backgroundColor: Colors.brandOrangeLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: verticalScale(24),
  },
  titleText: {
    fontSize: moderateScale(28),
    fontWeight: '700',
    color: Colors.textDark,
    textAlign: 'center',
  },
  subText: {
    fontSize: moderateScale(15),
    color: Colors.textSecondary,
    textAlign: 'center',
    marginTop: verticalScale(6),
  },
  statsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.white,
    borderRadius: verticalScale(16),
    borderWidth: 1,
    borderColor: Colors.grayBorder,
    paddingVertical: verticalScale(16),
    marginTop: verticalScale(32),
    alignSelf: 'stretch',
  },
  statCol: {
    flex: 1,
    alignItems: 'center',
  },
  statValueRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statValue: {
    fontSize: moderateScale(22),
    fontWeight: '700',
    color: Colors.textDark,
    marginLeft: horizontalScale(6),
  },
  statLabel: {
    fontSize: moderateScale(12),
    color: Colors.textMuted,
    marginTop: verticalScale(2),
  },
  statDivider: {
    width: 1,
    height: verticalScale(36),
    backgroundColor: Colors.grayBorder,
  },
  continueBtn: {
    height: verticalScale(52),
    borderRadius: verticalScale(14),
    backgroundColor: Colors.brandOrange,
    alignItems: 'center',
    justifyContent: 'center',
  },
  continueBtnText: {
    fontSize: moderateScale(16),
    fontWeight: '600',
    color: Colors.white,
  },
});
