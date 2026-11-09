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
    backgroundColor: Colors.darkSurfaceContainerLowest,
    borderWidth: verticalScale(1),
    borderColor: 'rgba(255, 255, 255, 0.1)',
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
    backgroundColor: 'rgba(6, 127, 242, 0.35)',
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
    fontSize: moderateScale(13),
    fontWeight: '800',
    letterSpacing: horizontalScale(1.5),
    opacity: 0.85,
  },
  knob: {
    width: verticalScale(56),
    height: verticalScale(56),
    borderRadius: verticalScale(28),
    backgroundColor: Colors.azure,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: Colors.azure,
    shadowOffset: { width: 0, height: verticalScale(4) },
    shadowOpacity: 0.7,
    shadowRadius: verticalScale(12),
    elevation: 8,
  },
  knobArrow: {
    color: Colors.white,
    fontSize: moderateScale(22),
    fontWeight: '800',
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
    color: Colors.textMuted,
    fontSize: moderateScale(12),
    textAlign: 'center',
  },
  hintHighlight: {
    color: Colors.jonquil,
    fontWeight: '700',
  },
});

