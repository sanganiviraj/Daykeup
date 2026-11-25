import { StyleSheet } from 'react-native';
import { Colors } from '../../theme/Colors';
import { moderateScale, verticalScale } from '../../theme/Metrics';

export const SEGMENT_PADDING = verticalScale(4);

export const styles = StyleSheet.create({
  track: {
    flexDirection: 'row',
    padding: SEGMENT_PADDING,
    borderRadius: verticalScale(24),
    backgroundColor: Colors.onboardingSurfaceLow,
  },
  thumb: {
    position: 'absolute',
    top: SEGMENT_PADDING,
    bottom: SEGMENT_PADDING,
    left: SEGMENT_PADDING,
    borderRadius: verticalScale(20),
    backgroundColor: Colors.primaryContainer,
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: verticalScale(2) },
    shadowOpacity: 0.25,
    shadowRadius: verticalScale(6),
    elevation: 3,
  },
  segment: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: verticalScale(9),
  },
  label: {
    fontSize: moderateScale(12),
    fontWeight: '700',
    color: Colors.onboardingBody,
  },
  labelSelected: {
    color: Colors.white,
  },
});
