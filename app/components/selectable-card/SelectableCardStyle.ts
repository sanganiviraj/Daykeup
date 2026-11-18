import { StyleSheet } from 'react-native';
import { Colors } from '../../theme/Colors';
import { verticalScale } from '../../theme/Metrics';

export const styles = StyleSheet.create({
  scaleLayer: {
    flex: 1,
  },
  card: {
    flex: 1,
    borderWidth: verticalScale(1.5),
    borderRadius: verticalScale(28),
    shadowColor: Colors.brandBrown,
    shadowOffset: { width: 0, height: verticalScale(3) },
    shadowOpacity: 0.07,
    shadowRadius: verticalScale(8),
    elevation: 2,
  },
});
