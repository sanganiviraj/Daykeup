import { StyleSheet } from 'react-native';
import { Colors } from '../../theme/Colors';
import { horizontalScale, moderateScale, verticalScale } from '../../theme/Metrics';

export const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    gap: horizontalScale(6),
    paddingHorizontal: horizontalScale(12),
    paddingVertical: verticalScale(5),
    borderRadius: verticalScale(20),
    borderWidth: verticalScale(1),
  },
  text: {
    fontSize: moderateScale(12),
    fontWeight: '700',
  },
  amber: {
    backgroundColor: Colors.amberTint,
    borderColor: Colors.amberSoft,
  },
  amberText: {
    color: Colors.brandBrown,
  },
  purple: {
    backgroundColor: Colors.whiteGlass,
    borderColor: Colors.onboardingTrack,
  },
  purpleText: {
    color: Colors.brandPurple,
  },
  white: {
    backgroundColor: Colors.whiteGlass,
    borderColor: Colors.amberSoft,
  },
  whiteText: {
    color: Colors.brandBrown,
  },
  dark: {
    backgroundColor: Colors.inkScrim,
    borderColor: Colors.purpleGlow,
  },
  darkText: {
    color: Colors.darkGoldText,
  },
});
