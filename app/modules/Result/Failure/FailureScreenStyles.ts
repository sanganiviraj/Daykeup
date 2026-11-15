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
    backgroundColor: Colors.errorContainer,
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
  descText: {
    fontSize: moderateScale(15),
    color: Colors.textSecondary,
    textAlign: 'center',
    lineHeight: moderateScale(22),
    marginTop: verticalScale(8),
    paddingHorizontal: horizontalScale(12),
  },
  retryBtn: {
    flexDirection: 'row',
    height: verticalScale(52),
    borderRadius: verticalScale(14),
    backgroundColor: Colors.brandOrange,
    alignItems: 'center',
    justifyContent: 'center',
  },
  retryBtnText: {
    fontSize: moderateScale(16),
    fontWeight: '600',
    color: Colors.white,
    marginLeft: horizontalScale(8),
  },
});
