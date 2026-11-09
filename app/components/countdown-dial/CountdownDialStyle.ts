import { StyleSheet } from 'react-native';
import { Colors } from '../../theme/Colors';
import { verticalScale, horizontalScale, moderateScale } from '../../theme/Metrics';

export const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: verticalScale(12),
  },
  dialCircle: {
    width: verticalScale(140),
    height: verticalScale(140),
    borderRadius: verticalScale(70),
    borderWidth: verticalScale(8),
    borderColor: Colors.white,
    backgroundColor: Colors.white,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: Colors.azure,
    shadowOffset: { width: 0, height: verticalScale(6) },
    shadowOpacity: 0.15,
    shadowRadius: verticalScale(16),
    elevation: 6,
  },
  innerDial: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  secondsNumber: {
    fontSize: moderateScale(46),
    fontWeight: '800',
    color: Colors.textMain,
    lineHeight: moderateScale(48),
  },
  secondsLabel: {
    fontSize: moderateScale(11),
    fontWeight: '800',
    color: Colors.melon,
    letterSpacing: horizontalScale(1.5),
    marginTop: verticalScale(2),
  },
  urgencyBarTrack: {
    width: horizontalScale(220),
    height: verticalScale(8),
    borderRadius: verticalScale(4),
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
    marginTop: verticalScale(14),
    overflow: 'hidden',
  },
  urgencyBarFill: {
    height: '100%',
    backgroundColor: Colors.azure,
    borderRadius: verticalScale(4),
  },
});

