import { StyleSheet } from 'react-native';
import { Colors } from '../../theme/Colors';
import { verticalScale, horizontalScale, moderateScale } from '../../theme/Metrics';

export const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: verticalScale(10),
    right: horizontalScale(14),
    zIndex: 10,
    minWidth: horizontalScale(64),
    alignItems: 'center',
    paddingHorizontal: horizontalScale(14),
    paddingVertical: verticalScale(6),
    borderRadius: verticalScale(20),
    borderWidth: verticalScale(2),
    borderColor: Colors.brandOrange,
    backgroundColor: Colors.white,
  },
  containerUrgent: {
    borderColor: Colors.error,
  },
  text: {
    fontSize: moderateScale(16),
    fontWeight: '700',
    color: Colors.textDark,
  },
  textUrgent: {
    color: Colors.error,
  },
});
