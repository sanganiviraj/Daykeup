import { StyleSheet } from 'react-native';
import { Colors } from '../../../theme/Colors';
import { verticalScale, horizontalScale, moderateScale } from '../../../theme/Metrics';

const textShadow = {
  textShadowColor: 'rgba(0, 0, 0, 0.6)',
  textShadowOffset: { width: 0, height: verticalScale(2) },
  textShadowRadius: verticalScale(8),
};

export const styles = StyleSheet.create({
  contentContainer: {
    flex: 1,
    paddingHorizontal: horizontalScale(16),
  },
  spacer: {
    flex: 1,
  },
  // Time Block
  timeContainer: {
    alignItems: 'center',
    marginTop: verticalScale(24),
  },
  timeRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  timeBigText: {
    fontSize: moderateScale(80),
    fontWeight: '700',
    color: Colors.white,
    lineHeight: moderateScale(88),
    letterSpacing: -horizontalScale(2),
    ...textShadow,
  },
  timePeriod: {
    fontSize: moderateScale(24),
    fontWeight: '600',
    color: Colors.white,
    marginLeft: horizontalScale(8),
    ...textShadow,
  },
  dateLevelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: verticalScale(6),
  },
  dateText: {
    fontSize: moderateScale(16),
    color: Colors.white,
    fontWeight: '500',
    ...textShadow,
  },
  // Quote
  quoteRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingHorizontal: horizontalScale(4),
    marginBottom: verticalScale(8),
  },
  quoteText: {
    flex: 1,
    fontSize: moderateScale(20),
    color: Colors.white,
    fontWeight: '600',
    lineHeight: moderateScale(26),
    ...textShadow,
  },
});
