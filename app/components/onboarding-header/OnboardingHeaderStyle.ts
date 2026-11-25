import { StyleSheet } from 'react-native';
import { Colors } from '../../theme/Colors';
import { horizontalScale, moderateScale, verticalScale } from '../../theme/Metrics';

export const HIT_SLOP = { top: 8, bottom: 8, left: 8, right: 8 };

export const styles = StyleSheet.create({
  container: {
    paddingHorizontal: horizontalScale(20),
    paddingTop: verticalScale(8),
    paddingBottom: verticalScale(12),
    gap: verticalScale(12),
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    minHeight: verticalScale(36),
  },
  brandPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: horizontalScale(6),
    paddingHorizontal: horizontalScale(12),
    paddingVertical: verticalScale(6),
    borderRadius: verticalScale(20),
    backgroundColor: Colors.whiteGlass,
    borderWidth: verticalScale(1),
    borderColor: Colors.amberSoft,
  },
  brandText: {
    fontSize: moderateScale(11),
    fontWeight: '800',
    letterSpacing: 1,
    color: Colors.brandBrown,
  },
  backButton: {
    width: moderateScale(36),
    height: moderateScale(36),
    borderRadius: moderateScale(18),
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.whiteGlass,
  },
  skipButton: {
    paddingHorizontal: horizontalScale(10),
    paddingVertical: verticalScale(6),
    marginLeft: 'auto',
  },
  skipText: {
    fontSize: moderateScale(13),
    fontWeight: '700',
    color: Colors.brandPurple,
  },
  progressRow: {
    flexDirection: 'row',
    gap: horizontalScale(6),
  },
  segmentTrack: {
    flex: 1,
    height: verticalScale(6),
    borderRadius: verticalScale(3),
    backgroundColor: Colors.onboardingTrack,
    overflow: 'hidden',
  },
  segmentFill: {
    height: '100%',
    borderRadius: verticalScale(3),
    backgroundColor: Colors.primaryContainer,
  },
});
