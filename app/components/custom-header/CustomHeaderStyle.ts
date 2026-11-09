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
    width: verticalScale(40),
    height: verticalScale(40),
    borderRadius: verticalScale(20),
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.4)',
    marginRight: horizontalScale(8),
  },
  backButtonDark: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  backText: {
    fontSize: moderateScale(20),
    color: Colors.textMain,
    fontWeight: '700',
  },
  textDark: {
    color: Colors.white,
  },
  logoBadge: {
    width: verticalScale(32),
    height: verticalScale(32),
    borderRadius: verticalScale(10),
    backgroundColor: Colors.azure,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: horizontalScale(8),
    shadowColor: Colors.azure,
    shadowOffset: { width: 0, height: verticalScale(2) },
    shadowOpacity: 0.3,
    shadowRadius: verticalScale(4),
    elevation: 3,
  },
  logoIcon: {
    color: Colors.white,
    fontSize: moderateScale(18),
  },
  titleText: {
    fontSize: moderateScale(18),
    fontWeight: '800',
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
    borderColor: Colors.azure,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    fontSize: moderateScale(14),
    fontWeight: '700',
    color: Colors.azure,
  },
  homeTagText: {
    fontSize: moderateScale(11),
    fontWeight: '800',
    color: Colors.textMuted,
    marginRight: horizontalScale(8),
    letterSpacing: horizontalScale(1),
  },
});
