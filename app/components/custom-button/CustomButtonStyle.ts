import { StyleSheet } from 'react-native';
import { Colors } from '../../theme/Colors';
import { verticalScale, horizontalScale, moderateScale } from '../../theme/Metrics';

export const styles = StyleSheet.create({
  buttonContainerStyle: {
    backgroundColor: Colors.azure,
    height: verticalScale(52),
    borderRadius: verticalScale(26),
    paddingHorizontal: horizontalScale(20),
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    shadowColor: Colors.azure,
    shadowOffset: { width: 0, height: verticalScale(4) },
    shadowOpacity: 0.25,
    shadowRadius: verticalScale(8),
    elevation: 4,
  },
  titleTextStyle: {
    color: Colors.white,
    fontSize: moderateScale(15),
    fontWeight: '700',
  },
  iconContainer: {
    marginRight: horizontalScale(8),
  },
  disabledButton: {
    opacity: 0.5,
  },
});

