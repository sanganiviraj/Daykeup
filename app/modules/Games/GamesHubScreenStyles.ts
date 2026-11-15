import { StyleSheet } from 'react-native';
import { Colors } from '../../theme/Colors';
import { horizontalScale, moderateScale, verticalScale } from '../../theme/Metrics';

export const styles = StyleSheet.create({
  content: {
    paddingHorizontal: horizontalScale(20),
    paddingTop: verticalScale(4),
    paddingBottom: verticalScale(32),
  },
  subtitle: {
    fontSize: moderateScale(14),
    color: Colors.textSecondary,
    lineHeight: moderateScale(20),
    marginBottom: verticalScale(16),
  },
  list: {
    backgroundColor: Colors.white,
    borderRadius: verticalScale(16),
    borderWidth: 1,
    borderColor: Colors.grayBorder,
    overflow: 'hidden',
  },
  gameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: verticalScale(14),
    paddingHorizontal: horizontalScale(14),
  },
  gameRowDivider: {
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: Colors.grayLight,
  },
  iconBox: {
    width: verticalScale(44),
    height: verticalScale(44),
    borderRadius: verticalScale(12),
    backgroundColor: Colors.brandOrangeLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: horizontalScale(12),
  },
  textCol: {
    flex: 1,
    marginRight: horizontalScale(8),
  },
  gameTitle: {
    fontSize: moderateScale(15),
    fontWeight: '600',
    color: Colors.textDark,
  },
  gameDesc: {
    fontSize: moderateScale(13),
    color: Colors.textMuted,
    lineHeight: moderateScale(18),
    marginTop: verticalScale(2),
  },
});
