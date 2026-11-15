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
    borderWidth: verticalScale(6),
    borderColor: Colors.brandOrange,
    backgroundColor: Colors.white,
    alignItems: 'center',
    justifyContent: 'center',
  },
  innerDial: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  secondsNumber: {
    fontSize: moderateScale(46),
    fontWeight: '700',
    color: Colors.textDark,
    lineHeight: moderateScale(52),
  },
  secondsLabel: {
    fontSize: moderateScale(12),
    fontWeight: '500',
    color: Colors.textMuted,
  },
  urgencyBarTrack: {
    width: horizontalScale(220),
    height: verticalScale(6),
    borderRadius: verticalScale(3),
    backgroundColor: Colors.graySubtle,
    marginTop: verticalScale(14),
    overflow: 'hidden',
  },
  urgencyBarFill: {
    height: '100%',
    backgroundColor: Colors.brandOrange,
    borderRadius: verticalScale(3),
  },
});

