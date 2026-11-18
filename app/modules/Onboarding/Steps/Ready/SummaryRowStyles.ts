import { StyleSheet } from 'react-native';
import { Colors } from '../../../../theme/Colors';
import { horizontalScale, moderateScale, verticalScale } from '../../../../theme/Metrics';

export const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: horizontalScale(8),
    padding: verticalScale(10),
    borderRadius: verticalScale(20),
    backgroundColor: Colors.onboardingSurfaceLow,
  },
  left: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: horizontalScale(10),
  },
  iconBox: {
    width: moderateScale(42),
    height: moderateScale(42),
    borderRadius: moderateScale(21),
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconWarm: {
    backgroundColor: Colors.orangeGlow,
  },
  iconPurple: {
    backgroundColor: Colors.tertiaryContainerSoft,
  },
  iconGold: {
    backgroundColor: Colors.secondaryContainerSoft,
  },
  copy: {
    flex: 1,
  },
  label: {
    fontSize: moderateScale(11),
    fontWeight: '600',
    color: Colors.onboardingBody,
  },
  value: {
    fontSize: moderateScale(16),
    fontWeight: '800',
    color: Colors.onboardingInk,
  },
  tag: {
    maxWidth: horizontalScale(110),
    paddingHorizontal: horizontalScale(10),
    paddingVertical: verticalScale(5),
    borderRadius: verticalScale(14),
  },
  tagWarm: {
    backgroundColor: Colors.peach,
  },
  tagPurple: {
    backgroundColor: Colors.tertiaryFixed,
  },
  tagGold: {
    backgroundColor: Colors.secondaryFixed,
  },
  tagText: {
    fontSize: moderateScale(11),
    fontWeight: '700',
  },
});
