import { StyleSheet } from 'react-native';
import { Colors } from '../../theme/Colors';

export const styles = StyleSheet.create({
  base: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  selected: {
    backgroundColor: Colors.primaryContainer,
  },
  unselected: {
    backgroundColor: Colors.onboardingTrack,
  },
});
