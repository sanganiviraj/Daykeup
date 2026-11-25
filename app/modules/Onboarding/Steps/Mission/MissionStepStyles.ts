import { StyleSheet } from 'react-native';
import { Colors } from '../../../../theme/Colors';
import { horizontalScale, moderateScale, verticalScale } from '../../../../theme/Metrics';
import { commonStyles } from '../../OnboardingCommonStyles';

export const BANNER_GRADIENT = [Colors.amberSoft, Colors.onboardingSurfaceLow];
export const GRADIENT_START = { x: 0, y: 0 };
export const GRADIENT_END = { x: 1, y: 1 };

export const styles = StyleSheet.create({
  banner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: verticalScale(16),
    borderRadius: verticalScale(30),
    overflow: 'hidden',
  },
  bannerCopy: {
    flex: 1,
    gap: verticalScale(6),
    paddingRight: horizontalScale(8),
  },
  bannerTitle: {
    fontSize: moderateScale(19),
    lineHeight: moderateScale(24),
    fontWeight: '800',
    color: Colors.onboardingInk,
  },
  bannerSub: {
    fontSize: moderateScale(12),
    lineHeight: moderateScale(17),
    color: Colors.onboardingBody,
  },
  bannerMascotWrap: {
    width: horizontalScale(112),
    height: verticalScale(96),
  },
  bannerMascot: {
    width: '100%',
    height: '100%',
  },
  // Left-aligned variant of the shared title block (matches the design).
  titleBlock: {
    gap: verticalScale(6),
  },
  title: {
    ...commonStyles.title,
    textAlign: 'left',
  },
  subtitle: {
    ...commonStyles.subtitle,
    textAlign: 'left',
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    rowGap: verticalScale(12),
  },
  gridItem: {
    width: '48%',
    height: verticalScale(172),
  },
  card: {
    flex: 1,
  },
  cardContent: {
    justifyContent: 'space-between',
    padding: verticalScale(14),
    borderRadius: verticalScale(28),
  },
  check: {
    position: 'absolute',
    top: verticalScale(12),
    right: horizontalScale(12),
  },
  iconBox: {
    width: moderateScale(46),
    height: moderateScale(46),
    borderRadius: moderateScale(16),
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconWarm: {
    backgroundColor: Colors.amberSoft,
  },
  iconPurple: {
    backgroundColor: Colors.brandPurpleLight,
  },
  cardCopy: {
    gap: verticalScale(3),
  },
  cardTitle: {
    fontSize: moderateScale(14),
    fontWeight: '800',
    color: Colors.onboardingInk,
  },
  cardSample: {
    fontSize: moderateScale(11),
    fontWeight: '500',
    color: Colors.onboardingBody,
  },
  tag: {
    alignSelf: 'flex-start',
    marginTop: verticalScale(4),
    paddingHorizontal: horizontalScale(8),
    paddingVertical: verticalScale(3),
    borderRadius: verticalScale(10),
  },
  tagWarm: {
    backgroundColor: Colors.amberTint,
  },
  tagPurple: {
    backgroundColor: Colors.brandPurpleLight,
  },
  tagText: {
    fontSize: moderateScale(10),
    fontWeight: '700',
  },
  tagTextWarm: {
    color: Colors.brandBrown,
  },
  tagTextPurple: {
    color: Colors.brandPurple,
  },
  intensityCard: {
    gap: verticalScale(12),
    padding: verticalScale(16),
    borderRadius: verticalScale(28),
    backgroundColor: Colors.white,
    borderWidth: verticalScale(1),
    borderColor: Colors.onboardingTrack,
  },
  intensityLabelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: horizontalScale(6),
  },
  intensityHint: {
    fontSize: moderateScale(11),
    fontWeight: '800',
    letterSpacing: 0.6,
    textTransform: 'uppercase',
    color: Colors.primary,
  },
});
