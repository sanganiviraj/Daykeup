import { StyleSheet } from 'react-native';
import { Colors } from '../../theme/Colors';
import { moderateScale, verticalScale } from '../../theme/Metrics';

// Typography + spacing shared by every onboarding step.
export const commonStyles = StyleSheet.create({
  stepContainer: {
    gap: verticalScale(16),
  },
  titleBlock: {
    alignItems: 'center',
    gap: verticalScale(8),
  },
  title: {
    fontSize: moderateScale(26),
    lineHeight: moderateScale(33),
    fontWeight: '800',
    letterSpacing: -0.4,
    textAlign: 'center',
    color: Colors.onboardingInk,
  },
  subtitle: {
    fontSize: moderateScale(14),
    lineHeight: moderateScale(21),
    textAlign: 'center',
    color: Colors.onboardingBody,
  },
  sectionLabel: {
    fontSize: moderateScale(14),
    fontWeight: '700',
    color: Colors.onboardingInk,
  },
  sectionHint: {
    fontSize: moderateScale(11),
    fontWeight: '600',
    color: Colors.brandBrown,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
});
