import { StyleSheet } from 'react-native';
import { Colors } from '../../theme/Colors';
import { verticalScale, horizontalScale, moderateScale } from '../../theme/Metrics';

export const styles = StyleSheet.create({
  container: {
    height: verticalScale(56),
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: horizontalScale(16),
  },
  leftContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  backButton: {
    width: verticalScale(44),
    height: verticalScale(44),
    borderRadius: verticalScale(22),
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.surfaceContainerHigh,
    marginRight: horizontalScale(10),
  },
  backButtonDark: {
    backgroundColor: 'rgba(255, 255, 255, 0.14)',
  },
  textDark: {
    color: Colors.white,
  },
  logoBadge: {
    width: verticalScale(32),
    height: verticalScale(32),
    borderRadius: verticalScale(10),
    backgroundColor: Colors.brandOrange,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: horizontalScale(8),
  },
  titleText: {
    fontSize: moderateScale(18),
    fontWeight: '700',
    color: Colors.textMain,
  },
  rightContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatarContainer: {
    width: verticalScale(34),
    height: verticalScale(34),
    borderRadius: verticalScale(17),
    backgroundColor: Colors.white,
    borderWidth: verticalScale(2),
    borderColor: Colors.brandOrange,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    fontSize: moderateScale(14),
    fontWeight: '700',
    color: Colors.brandOrange,
  },
  homeTagText: {
    fontSize: moderateScale(11),
    fontWeight: '800',
    color: Colors.textMuted,
    marginRight: horizontalScale(8),
    letterSpacing: horizontalScale(1),
  },
});
