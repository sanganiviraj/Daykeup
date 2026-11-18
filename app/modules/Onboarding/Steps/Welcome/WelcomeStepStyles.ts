import { StyleSheet } from 'react-native';
import { Colors } from '../../../../theme/Colors';
import { horizontalScale, moderateScale, verticalScale } from '../../../../theme/Metrics';

export const HERO_GRADIENT = [Colors.white, Colors.onboardingSurfaceLow];
export const STAGE_GRADIENT = [
  Colors.onboardingStageStart,
  Colors.onboardingStageEnd,
];

export const styles = StyleSheet.create({
  heroCard: {
    borderRadius: verticalScale(32),
    padding: verticalScale(14),
    gap: verticalScale(12),
    borderWidth: verticalScale(1),
    borderColor: Colors.white,
    shadowColor: Colors.brandBrown,
    shadowOffset: { width: 0, height: verticalScale(10) },
    shadowOpacity: 0.08,
    shadowRadius: verticalScale(20),
    elevation: 4,
  },
  stage: {
    height: verticalScale(200),
    borderRadius: verticalScale(22),
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  glowAmber: {
    position: 'absolute',
    width: moderateScale(170),
    height: moderateScale(170),
    borderRadius: moderateScale(85),
    backgroundColor: Colors.orangeGlow,
  },
  glowPurple: {
    position: 'absolute',
    bottom: -verticalScale(30),
    width: horizontalScale(210),
    height: verticalScale(80),
    borderRadius: verticalScale(40),
    backgroundColor: Colors.purpleGlow,
  },
  mascotWrap: {
    width: '100%',
    height: '100%',
  },
  mascot: {
    width: '100%',
    height: '100%',
  },
  tag: {
    position: 'absolute',
    right: horizontalScale(10),
    bottom: verticalScale(10),
    flexDirection: 'row',
    alignItems: 'center',
    gap: horizontalScale(8),
    paddingHorizontal: horizontalScale(10),
    paddingVertical: verticalScale(4),
    borderRadius: verticalScale(14),
    backgroundColor: Colors.inkScrim,
  },
  tagText: {
    fontSize: moderateScale(10),
    fontWeight: '700',
    color: Colors.darkGoldText,
  },
  statStrip: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: horizontalScale(6),
    paddingVertical: verticalScale(7),
    paddingHorizontal: horizontalScale(12),
    borderRadius: verticalScale(20),
    backgroundColor: Colors.whiteGlass,
    borderWidth: verticalScale(1),
    borderColor: Colors.onboardingTrack,
  },
  statText: {
    fontSize: moderateScale(11),
    fontWeight: '600',
    color: Colors.onboardingBody,
  },
  statHighlight: {
    fontSize: moderateScale(11),
    fontWeight: '800',
    color: Colors.onboardingInk,
  },
  featureRow: {
    flexDirection: 'row',
    gap: horizontalScale(8),
  },
  featureItem: {
    flex: 1,
  },
  featureCard: {
    alignItems: 'center',
    paddingVertical: verticalScale(12),
    paddingHorizontal: horizontalScale(6),
    gap: verticalScale(3),
    borderRadius: verticalScale(20),
    backgroundColor: Colors.white,
    borderWidth: verticalScale(1),
    borderColor: Colors.onboardingTrack,
  },
  featureIcon: {
    width: moderateScale(32),
    height: moderateScale(32),
    borderRadius: moderateScale(16),
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: verticalScale(4),
    backgroundColor: Colors.amberTint,
  },
  featureTitle: {
    fontSize: moderateScale(11),
    fontWeight: '800',
    color: Colors.onboardingInk,
  },
  featureSub: {
    fontSize: moderateScale(9.5),
    color: Colors.onboardingBody,
  },
});
