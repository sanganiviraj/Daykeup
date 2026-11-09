import { StyleSheet } from 'react-native';
import { Colors } from '../../../theme/Colors';
import { verticalScale, horizontalScale, moderateScale } from '../../../theme/Metrics';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: horizontalScale(20),
    justifyContent: 'space-between',
    paddingBottom: verticalScale(34),
  },
  centerContent: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: verticalScale(50),
  },
  bellCircle: {
    width: verticalScale(100),
    height: verticalScale(100),
    borderRadius: verticalScale(50),
    backgroundColor: Colors.melonLight,
    borderWidth: verticalScale(2),
    borderColor: 'rgba(255, 167, 143, 0.4)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: verticalScale(20),
  },
  bellEmoji: {
    fontSize: moderateScale(48),
  },
  titleText: {
    fontSize: moderateScale(24),
    fontWeight: '800',
    color: Colors.textMain,
    textAlign: 'center',
  },
  descText: {
    fontSize: moderateScale(13),
    color: Colors.textSecondary,
    textAlign: 'center',
    marginTop: verticalScale(10),
    lineHeight: moderateScale(18),
    paddingHorizontal: horizontalScale(16),
  },
  retryBtn: {
    width: '100%',
    height: verticalScale(54),
    borderRadius: verticalScale(27),
    backgroundColor: Colors.melon,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: Colors.melon,
    shadowOffset: { width: 0, height: verticalScale(6) },
    shadowOpacity: 0.35,
    shadowRadius: verticalScale(12),
    elevation: 6,
  },
  retryBtnText: {
    color: Colors.white,
    fontSize: moderateScale(15),
    fontWeight: '800',
  },
});

