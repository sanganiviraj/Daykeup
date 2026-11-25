import { StyleSheet } from 'react-native';
import { Colors } from '../../theme/Colors';
import { horizontalScale, moderateScale, verticalScale } from '../../theme/Metrics';

export const CELL_GAP = horizontalScale(3);

export const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  body: {
    flexDirection: 'row',
  },
  grid: {
    flex: 1,
  },
  monthRow: {
    flexDirection: 'row',
    height: verticalScale(18),
  },
  monthSlot: {
    flex: 1,
    marginHorizontal: CELL_GAP / 2,
    overflow: 'visible',
  },
  monthText: {
    fontSize: moderateScale(9),
    fontWeight: '600',
    color: Colors.heroSubText,
    width: horizontalScale(30),
  },
  weeksRow: {
    flexDirection: 'row',
  },
  weekCol: {
    flex: 1,
    marginHorizontal: CELL_GAP / 2,
  },
  cell: {
    width: '100%',
    aspectRatio: 1,
    borderRadius: verticalScale(3),
    marginBottom: CELL_GAP,
  },
  cellDone: {
    backgroundColor: Colors.brandOrange,
  },
  cellMissed: {
    backgroundColor: 'rgba(239, 68, 68, 0.55)',
  },
  cellIdle: {
    backgroundColor: 'rgba(255, 255, 255, 0.12)',
  },
  cellFuture: {
    backgroundColor: Colors.transparent,
  },
  cellToday: {
    borderWidth: 1.5,
    borderColor: Colors.heroTextCream,
  },
  legendRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    marginTop: verticalScale(10),
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: horizontalScale(14),
  },
  legendSwatch: {
    width: horizontalScale(11),
    height: horizontalScale(11),
    borderRadius: verticalScale(3),
    marginRight: horizontalScale(5),
  },
  legendText: {
    fontSize: moderateScale(10),
    fontWeight: '600',
    color: Colors.heroSubText,
  },
});
