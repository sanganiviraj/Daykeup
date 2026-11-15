import { StyleSheet } from 'react-native';
import { Colors } from '../../theme/Colors';
import { verticalScale, horizontalScale, moderateScale } from '../../theme/Metrics';

export const styles = StyleSheet.create({
  container: {
    width: '100%',
    alignItems: 'center',
    marginTop: verticalScale(16),
  },
  track: {
    width: '100%',
    height: verticalScale(64),
    borderRadius: verticalScale(32),
    backgroundColor: 'rgba(7, 12, 18, 0.6)',
    borderWidth: verticalScale(1),
    borderColor: 'rgba(255, 255, 255, 0.15)',
    justifyContent: 'center',
    paddingHorizontal: horizontalScale(4),
    position: 'relative',
    overflow: 'hidden',
  },
  progressFill: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    backgroundColor: 'rgba(255, 115, 21, 0.35)',
    borderRadius: verticalScale(32),
  },
  trackTextContainer: {
    position: 'absolute',
    left: horizontalScale(60),
    right: horizontalScale(16),
    alignItems: 'center',
    justifyContent: 'center',
  },
  trackText: {
    color: Colors.white,
    fontSize: moderateScale(15),
    fontWeight: '600',
    opacity: 0.9,
  },
  knob: {
    width: verticalScale(56),
    height: verticalScale(56),
    borderRadius: verticalScale(28),
    backgroundColor: Colors.brandOrange,
    alignItems: 'center',
    justifyContent: 'center',
  },
  hintTextContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: verticalScale(12),
    paddingHorizontal: horizontalScale(16),
  },
  hintIcon: {
    marginRight: horizontalScale(4),
  },
  hintText: {
    color: 'rgba(255, 255, 255, 0.7)',
    fontSize: moderateScale(12),
    textAlign: 'center',
  },
  hintHighlight: {
    color: Colors.brandOrangeContainer,
    fontWeight: '600',
  },
});

