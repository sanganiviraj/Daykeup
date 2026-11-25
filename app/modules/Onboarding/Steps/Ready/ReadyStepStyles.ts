import { StyleSheet } from 'react-native';
import { Colors } from '../../../../theme/Colors';
import { horizontalScale, moderateScale, verticalScale } from '../../../../theme/Metrics';

export const HERO_GRADIENT = [Colors.amberTint, Colors.onboardingSurfaceLow, Colors.onboardingBg];
export const INTENTION_GRADIENT = [Colors.amberSoft, Colors.peach, Colors.amberSoft];
export const GRADIENT_START = { x: 0, y: 0 };
export const GRADIENT_END = { x: 1, y: 1 };

export const styles = StyleSheet.create({
  hero: {
    alignItems: 'center',
    gap: verticalScale(16),
    paddingVertical: verticalScale(18),
    paddingHorizontal: horizontalScale(16),
    borderRadius: verticalScale(36),
  },
  heroCardWrap: {
    width: '100%',
  },
  heroImageCard: {
    width: horizontalScale(280),
    height: verticalScale(187),
    borderRadius: verticalScale(28),
    overflow: 'hidden',
    backgroundColor: Colors.white,
    shadowColor: Colors.brandBrown,
    shadowOffset: { width: 0, height: verticalScale(8) },
    shadowOpacity: 0.18,
    shadowRadius: verticalScale(16),
    elevation: 6,
  },
  heroImage: {
    width: horizontalScale(280),
    height: verticalScale(187),
  },
  readyTag: {
    position: 'absolute',
    right: horizontalScale(10),
    bottom: verticalScale(10),
    flexDirection: 'row',
    alignItems: 'center',
    gap: horizontalScale(4),
    paddingHorizontal: horizontalScale(10),
    paddingVertical: verticalScale(4),
    borderRadius: verticalScale(14),
    backgroundColor: Colors.whiteGlass,
  },
  readyTagText: {
    fontSize: moderateScale(11),
    fontWeight: '800',
    color: Colors.onboardingInk,
  },
  summaryCard: {
    gap: verticalScale(10),
    padding: verticalScale(16),
    borderRadius: verticalScale(30),
    backgroundColor: Colors.white,
    shadowColor: Colors.brandBrown,
    shadowOffset: { width: 0, height: verticalScale(8) },
    shadowOpacity: 0.08,
    shadowRadius: verticalScale(16),
    elevation: 4,
  },
  summaryHeading: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: horizontalScale(6),
  },
  activePill: {
    paddingHorizontal: horizontalScale(10),
    paddingVertical: verticalScale(3),
    borderRadius: verticalScale(12),
    backgroundColor: Colors.amberSoft,
  },
  activePillText: {
    fontSize: moderateScale(11),
    fontWeight: '700',
    color: Colors.brandBrown,
  },
  intention: {
    gap: verticalScale(6),
    padding: verticalScale(18),
    borderRadius: verticalScale(28),
    overflow: 'hidden',
  },
  intentionQuoteMark: {
    position: 'absolute',
    right: -horizontalScale(6),
    bottom: -verticalScale(8),
    opacity: 0.12,
  },
  intentionLabelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: horizontalScale(6),
  },
  intentionLabel: {
    fontSize: moderateScale(11),
    fontWeight: '800',
    letterSpacing: 0.8,
    textTransform: 'uppercase',
    color: Colors.brandBrown,
  },
  intentionQuote: {
    fontSize: moderateScale(16),
    lineHeight: moderateScale(23),
    fontWeight: '700',
    color: Colors.textDark,
  },
  notificationCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: horizontalScale(12),
    padding: verticalScale(14),
    borderRadius: verticalScale(26),
    backgroundColor: Colors.white,
    borderWidth: verticalScale(1),
    borderColor: Colors.onboardingTrack,
  },
  notificationIcon: {
    width: moderateScale(38),
    height: moderateScale(38),
    borderRadius: moderateScale(19),
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.amberTint,
  },
  notificationCopy: {
    flex: 1,
    gap: verticalScale(2),
  },
  notificationSub: {
    fontSize: moderateScale(12),
    color: Colors.onboardingBody,
  },
  footnote: {
    fontSize: moderateScale(12),
    lineHeight: moderateScale(18),
    textAlign: 'center',
    color: Colors.onboardingBody,
  },
});
