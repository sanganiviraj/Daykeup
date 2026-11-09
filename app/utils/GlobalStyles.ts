import { StyleSheet } from 'react-native';
import { Colors } from '../theme/Colors';
import { verticalScale, horizontalScale } from '../theme/Metrics';

export const globalStyles = StyleSheet.create({
  flex1: {
    flex: 1,
  },
  rowCenter: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  rowBetween: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  center: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  shadowSm: {
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: verticalScale(2) },
    shadowOpacity: 0.05,
    shadowRadius: verticalScale(4),
    elevation: 2,
  },
  shadowMd: {
    shadowColor: Colors.azure,
    shadowOffset: { width: 0, height: verticalScale(4) },
    shadowOpacity: 0.18,
    shadowRadius: verticalScale(12),
    elevation: 4,
  },
  screenContainer: {
    flex: 1,
    paddingHorizontal: horizontalScale(16),
  },
});

