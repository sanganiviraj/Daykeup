import { StyleSheet } from 'react-native';
import { Colors } from '../../../../theme/Colors';
import { horizontalScale, moderateScale, verticalScale } from '../../../../theme/Metrics';

export const styles = StyleSheet.create({
  heroBadge: {
    width: moderateScale(68),
    height: moderateScale(68),
    borderRadius: moderateScale(34),
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.amberSoft,
  },
  heroBadgeInner: {
    width: moderateScale(50),
    height: moderateScale(50),
    borderRadius: moderateScale(25),
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.primaryContainer,
  },
  heroBadgeSpark: {
    position: 'absolute',
    right: -horizontalScale(2),
    bottom: -verticalScale(2),
    width: moderateScale(24),
    height: moderateScale(24),
    borderRadius: moderateScale(12),
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.white,
  },
  block: {
    gap: verticalScale(8),
  },
  optional: {
    fontSize: moderateScale(11),
    color: Colors.textMuted,
  },
  inputWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: horizontalScale(10),
    height: verticalScale(52),
    paddingHorizontal: horizontalScale(16),
    borderRadius: verticalScale(26),
    backgroundColor: Colors.white,
    borderWidth: verticalScale(1.5),
    borderColor: Colors.onboardingTrack,
  },
  input: {
    flex: 1,
    padding: 0,
    fontSize: moderateScale(15),
    color: Colors.onboardingInk,
  },
  ageRow: {
    flexDirection: 'row',
    gap: horizontalScale(8),
  },
  agePill: {
    flex: 1,
    height: verticalScale(46),
  },
  agePillContent: {
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: verticalScale(23),
  },
  ageText: {
    fontSize: moderateScale(13),
    fontWeight: '700',
    color: Colors.onboardingInk,
  },
  ageTextSelected: {
    color: Colors.white,
  },
  wakeList: {
    gap: verticalScale(8),
  },
  wakeCard: {
    height: verticalScale(70),
  },
  wakeCardContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: horizontalScale(12),
    paddingHorizontal: horizontalScale(14),
    borderRadius: verticalScale(24),
  },
  wakeIcon: {
    width: moderateScale(44),
    height: moderateScale(44),
    borderRadius: moderateScale(22),
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.onboardingSurfaceLow,
  },
  wakeIconSelected: {
    backgroundColor: Colors.primaryContainer,
  },
  wakeCopy: {
    flex: 1,
    gap: verticalScale(2),
  },
  wakeTitle: {
    fontSize: moderateScale(15),
    fontWeight: '700',
    color: Colors.onboardingInk,
  },
  wakeTitleSelected: {
    color: Colors.brandBrown,
  },
  wakeSub: {
    fontSize: moderateScale(12),
    color: Colors.onboardingBody,
  },
  insight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: horizontalScale(12),
    padding: verticalScale(14),
    borderRadius: verticalScale(24),
    backgroundColor: Colors.onboardingSurfaceLow,
  },
  insightIcon: {
    width: moderateScale(32),
    height: moderateScale(32),
    borderRadius: moderateScale(16),
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.amberSoft,
  },
  insightText: {
    flex: 1,
    fontSize: moderateScale(12),
    lineHeight: moderateScale(18),
    color: Colors.onboardingBody,
  },
});
