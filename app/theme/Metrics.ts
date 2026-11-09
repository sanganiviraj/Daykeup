import { Dimensions, Platform } from 'react-native';

const { height, width } = Dimensions.get('window');

let guidelineBaseWidth = 375;
let guidelineBaseHeight = 812;

if (width > height) {
  [guidelineBaseWidth, guidelineBaseHeight] = [guidelineBaseHeight, guidelineBaseWidth];
}

export const horizontalScale = (size: number): number => (width / guidelineBaseWidth) * size;
export const verticalScale = (size: number): number => (height / guidelineBaseHeight) * size;
export const moderateScale = (size: number, factor = 0.5): number =>
  size + (horizontalScale(size) - size) * factor;

export const globalMetrics = {
  isAndroid: Platform.OS === 'android',
  isIos: Platform.OS === 'ios',
  isPad: Platform.OS === 'ios' && (Platform as unknown as { isPad: boolean }).isPad,
  isTV: Platform.isTV,
};

export { height, width };

