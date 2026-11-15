import { StyleSheet } from 'react-native';
import { Colors } from '../../../theme/Colors';
import { horizontalScale, moderateScale, verticalScale } from '../../../theme/Metrics';

export const EMPTY_ICON_SIZE = moderateScale(40);

export const styles = StyleSheet.create({
  contentContainer: {
    paddingHorizontal: horizontalScale(20),
    paddingTop: verticalScale(12),
    paddingBottom: verticalScale(120),
  },
  titleHeaderRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    justifyContent: 'space-between',
    marginBottom: verticalScale(16),
  },
  screenTitle: {
    fontSize: moderateScale(28),
    fontWeight: '700',
    color: Colors.textDark,
    letterSpacing: -horizontalScale(0.5),
  },
  activeAlarmsText: {
    fontSize: moderateScale(13),
    fontWeight: '500',
    color: Colors.textMuted,
  },
  emptyContainer: {
    alignItems: 'center',
    paddingHorizontal: horizontalScale(24),
    marginTop: verticalScale(56),
  },
  emptyIconContainer: {
    width: verticalScale(80),
    height: verticalScale(80),
    borderRadius: verticalScale(40),
    backgroundColor: Colors.brandOrangeLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: verticalScale(20),
  },
  emptyTitle: {
    fontSize: moderateScale(18),
    fontWeight: '700',
    color: Colors.textDark,
    textAlign: 'center',
    marginBottom: verticalScale(6),
  },
  emptySub: {
    fontSize: moderateScale(14),
    color: Colors.textMuted,
    textAlign: 'center',
    lineHeight: moderateScale(20),
  },
});
