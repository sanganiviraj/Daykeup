import { StyleSheet } from 'react-native';
import { Colors } from '../../theme/Colors';
import { horizontalScale, moderateScale, verticalScale } from '../../theme/Metrics';

export const ITEM_HEIGHT = verticalScale(42);
export const SCROLL_BOX_HEIGHT = verticalScale(180);
export const PADDING_VERTICAL = verticalScale(4);

export const getScrollOffset = (index: number): number => {
  if (index <= 0) return 0;
  const itemTop = PADDING_VERTICAL + index * ITEM_HEIGHT;
  const centerOffset = itemTop - (SCROLL_BOX_HEIGHT - ITEM_HEIGHT) / 2;
  return Math.max(0, centerOffset);
};

export const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.55)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: horizontalScale(20),
  },
  modalCard: {
    width: '100%',
    maxWidth: horizontalScale(360),
    backgroundColor: Colors.white,
    borderRadius: verticalScale(28),
    padding: verticalScale(22),
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: verticalScale(10) },
    shadowOpacity: 0.25,
    shadowRadius: verticalScale(20),
    elevation: 10,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: verticalScale(14),
  },
  headerTitle: {
    fontSize: moderateScale(18),
    fontWeight: '800',
    color: Colors.textDark,
  },
  closeButton: {
    width: verticalScale(32),
    height: verticalScale(32),
    borderRadius: verticalScale(16),
    backgroundColor: Colors.surfaceContainer,
    alignItems: 'center',
    justifyContent: 'center',
  },

  // Preview Time Card
  previewTimeCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.brandCreamLight,
    borderWidth: 1,
    borderColor: Colors.creamBorder,
    borderRadius: verticalScale(20),
    paddingVertical: verticalScale(12),
    paddingHorizontal: horizontalScale(16),
    marginBottom: verticalScale(12),
  },
  previewTimeText: {
    fontSize: moderateScale(40),
    fontWeight: '800',
    color: Colors.textDark,
    letterSpacing: -horizontalScale(1),
  },
  periodToggleContainer: {
    flexDirection: 'row',
    backgroundColor: Colors.white,
    borderRadius: verticalScale(14),
    padding: verticalScale(3),
    marginLeft: horizontalScale(14),
    borderWidth: 1,
    borderColor: Colors.creamBorder,
  },
  periodToggleBtn: {
    paddingHorizontal: horizontalScale(12),
    paddingVertical: verticalScale(6),
    borderRadius: verticalScale(11),
  },
  periodToggleBtnActive: {
    backgroundColor: Colors.brandOrange,
  },
  periodToggleText: {
    fontSize: moderateScale(12),
    fontWeight: '700',
    color: Colors.onSurfaceVariant,
  },
  periodToggleTextActive: {
    color: Colors.white,
  },

  // Quick Minute Chips
  quickMinutesRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: verticalScale(14),
  },
  quickMinuteChip: {
    backgroundColor: Colors.surfaceContainer,
    paddingHorizontal: horizontalScale(10),
    paddingVertical: verticalScale(5),
    borderRadius: verticalScale(12),
    marginHorizontal: horizontalScale(3),
    borderWidth: 1,
    borderColor: Colors.grayBorder,
  },
  quickMinuteChipActive: {
    backgroundColor: Colors.brandOrangeLight,
    borderColor: Colors.brandOrange,
  },
  quickMinuteChipText: {
    fontSize: moderateScale(11),
    fontWeight: '700',
    color: Colors.onSurfaceVariant,
  },
  quickMinuteChipTextActive: {
    color: Colors.brandOrange,
    fontWeight: '800',
  },

  // Pickers Columns Container
  columnsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: verticalScale(18),
  },
  columnCol: {
    flex: 1,
    marginHorizontal: horizontalScale(4),
  },
  columnHeader: {
    fontSize: moderateScale(12),
    fontWeight: '700',
    color: Colors.onSurfaceVariant,
    marginBottom: verticalScale(8),
    textAlign: 'center',
    textTransform: 'uppercase',
    letterSpacing: horizontalScale(0.8),
  },
  scrollPickerBox: {
    height: verticalScale(180),
    backgroundColor: Colors.surfaceContainer,
    borderRadius: verticalScale(16),
    paddingVertical: verticalScale(4),
  },
  pickerItemBtn: {
    height: verticalScale(38),
    marginHorizontal: horizontalScale(6),
    marginVertical: verticalScale(2),
    borderRadius: verticalScale(12),
    alignItems: 'center',
    justifyContent: 'center',
  },
  pickerItemBtnSelected: {
    backgroundColor: Colors.brandOrange,
    shadowColor: Colors.brandOrange,
    shadowOffset: { width: 0, height: verticalScale(2) },
    shadowOpacity: 0.25,
    shadowRadius: verticalScale(4),
    elevation: 3,
  },
  pickerItemText: {
    fontSize: moderateScale(16),
    fontWeight: '600',
    color: Colors.textDark,
  },
  pickerItemTextSelected: {
    color: Colors.white,
    fontWeight: '800',
  },

  // Actions
  actionsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  cancelBtn: {
    flex: 1,
    height: verticalScale(48),
    borderRadius: verticalScale(24),
    backgroundColor: Colors.surfaceContainer,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: horizontalScale(8),
  },
  cancelBtnText: {
    fontSize: moderateScale(14),
    fontWeight: '700',
    color: Colors.onSurfaceVariant,
  },
  confirmBtn: {
    flex: 1,
    height: verticalScale(48),
    borderRadius: verticalScale(24),
    backgroundColor: Colors.brandOrange,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: horizontalScale(8),
    shadowColor: Colors.brandOrange,
    shadowOffset: { width: 0, height: verticalScale(4) },
    shadowOpacity: 0.3,
    shadowRadius: verticalScale(6),
    elevation: 4,
  },
  confirmBtnText: {
    fontSize: moderateScale(14),
    fontWeight: '800',
    color: Colors.white,
  },
});
