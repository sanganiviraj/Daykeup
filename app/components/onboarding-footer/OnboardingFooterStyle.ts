import { StyleSheet } from 'react-native';
import { Colors } from '../../theme/Colors';
import { horizontalScale, moderateScale, verticalScale } from '../../theme/Metrics';

export const GRADIENT_START = { x: 0, y: 0.5 };
export const GRADIENT_END = { x: 1, y: 0.5 };

export const styles = StyleSheet.create({
  container: {
    paddingHorizontal: horizontalScale(20),
    paddingTop: verticalScale(12),
    paddingBottom: verticalScale(16),
  },
  shadow: {
    borderRadius: verticalScale(27),
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: verticalScale(8) },
    shadowOpacity: 0.35,
    shadowRadius: verticalScale(14),
    elevation: 8,
  },
  button: {
    height: verticalScale(54),
    borderRadius: verticalScale(27),
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: horizontalScale(8),
    paddingHorizontal: horizontalScale(20),
  },
  title: {
    fontSize: moderateScale(15),
    fontWeight: '800',
    letterSpacing: 0.3,
    color: Colors.white,
  },
  disabled: {
    opacity: 0.7,
  },
});
