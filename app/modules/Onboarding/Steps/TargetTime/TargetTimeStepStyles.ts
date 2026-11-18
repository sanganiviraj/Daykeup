import { StyleSheet } from 'react-native';
import { Colors } from '../../../../theme/Colors';
import { horizontalScale, moderateScale, verticalScale } from '../../../../theme/Metrics';

export const styles = StyleSheet.create({
  clockCard: {
    alignItems: 'center',
    gap: verticalScale(14),
    padding: verticalScale(20),
    borderRadius: verticalScale(36),
    backgroundColor: Colors.white,
    shadowColor: Colors.brandBrown,
    shadowOffset: { width: 0, height: verticalScale(8) },
    shadowOpacity: 0.09,
    shadowRadius: verticalScale(18),
    elevation: 4,
  },
  clockRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    maxWidth: horizontalScale(300),
  },
  stepper: {
    width: moderateScale(50),
    height: moderateScale(50),
    borderRadius: moderateScale(25),
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepperMinus: {
    backgroundColor: Colors.amberTint,
  },
  stepperPlus: {
    backgroundColor: Colors.brandOrangeLight,
  },
  timeBlock: {
    alignItems: 'center',
  },
  timeRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: horizontalScale(6),
  },
  timeText: {
    fontSize: moderateScale(42),
    lineHeight: moderateScale(50),
    fontWeight: '800',
    letterSpacing: -1,
    color: Colors.onboardingInk,
  },
  periodText: {
    fontSize: moderateScale(16),
    fontWeight: '800',
    color: Colors.primary,
  },
  timeCaption: {
    fontSize: moderateScale(10),
    fontWeight: '700',
    letterSpacing: 1,
    textTransform: 'uppercase',
    color: Colors.onboardingBody,
  },
  restBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: horizontalScale(8),
    alignSelf: 'stretch',
    paddingVertical: verticalScale(10),
    paddingHorizontal: horizontalScale(14),
    borderRadius: verticalScale(22),
    backgroundColor: Colors.onboardingSurfaceLow,
  },
  restText: {
    flexShrink: 1,
    fontSize: moderateScale(12),
    fontWeight: '600',
    textAlign: 'center',
    color: Colors.onboardingBody,
  },
  restStrong: {
    fontSize: moderateScale(12),
    fontWeight: '800',
    color: Colors.onboardingInk,
  },
  sunriseRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: horizontalScale(6),
  },
  sunriseBar: {
    height: verticalScale(6),
    borderRadius: verticalScale(3),
  },
  repeatCard: {
    gap: verticalScale(12),
    padding: verticalScale(16),
    borderRadius: verticalScale(28),
    backgroundColor: Colors.white,
    borderWidth: verticalScale(1),
    borderColor: Colors.onboardingTrack,
  },
  repeatTitle: {
    fontSize: moderateScale(12),
    fontWeight: '800',
    letterSpacing: 0.8,
    textTransform: 'uppercase',
    color: Colors.onboardingInk,
  },
  dayRow: {
    flexDirection: 'row',
    gap: horizontalScale(6),
  },
  dayChip: {
    flex: 1,
    height: verticalScale(44),
  },
  dayChipContent: {
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: verticalScale(22),
  },
  dayText: {
    fontSize: moderateScale(13),
    fontWeight: '700',
    color: Colors.onboardingBody,
  },
  dayTextSelected: {
    color: Colors.white,
  },
  insight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: horizontalScale(12),
    padding: verticalScale(14),
    borderRadius: verticalScale(24),
    backgroundColor: Colors.amberTint,
  },
  insightIcon: {
    width: moderateScale(36),
    height: moderateScale(36),
    borderRadius: moderateScale(18),
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.primaryContainer,
  },
  insightText: {
    flex: 1,
    fontSize: moderateScale(12),
    lineHeight: moderateScale(18),
    color: Colors.onboardingBody,
  },
  insightStrong: {
    fontSize: moderateScale(12),
    fontWeight: '800',
    color: Colors.onboardingInk,
  },
});

// Decorative "sunrise" bars under the clock; widths grow like a rising sun.
export const SUNRISE_BARS = [
  { key: 'bar-1', style: { width: horizontalScale(32), backgroundColor: Colors.primaryContainer } },
  { key: 'bar-2', style: { width: horizontalScale(56), backgroundColor: Colors.primary } },
  { key: 'bar-3', style: { width: horizontalScale(24), backgroundColor: Colors.amberSoft } },
  { key: 'bar-4', style: { width: horizontalScale(12), backgroundColor: Colors.onboardingTrack } },
];
