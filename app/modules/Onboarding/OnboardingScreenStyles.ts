import { StyleSheet } from 'react-native';
import { Colors } from '../../theme/Colors';
import { horizontalScale, verticalScale } from '../../theme/Metrics';

export const BACKDROP_GRADIENT = [Colors.amberTint, Colors.onboardingBg];

export const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },
  backdrop: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: verticalScale(340),
  },
  content: {
    paddingHorizontal: horizontalScale(20),
    paddingTop: verticalScale(4),
    paddingBottom: verticalScale(16),
  },
});
