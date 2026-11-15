import { StyleSheet } from 'react-native';
import { Colors } from '../../theme/Colors';
import { horizontalScale, moderateScale, verticalScale } from '../../theme/Metrics';

export const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: horizontalScale(20),
    paddingBottom: verticalScale(18),
    paddingTop: verticalScale(6),
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: Colors.transparent,
  },
  dockPill: {
    flex: 1,
    marginRight: horizontalScale(16),
    backgroundColor: Colors.white,
    borderRadius: verticalScale(32),
    padding: verticalScale(4),
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.grayBorder,
    shadowColor: Colors.black,
    shadowOffset: {
      width: 0,
      height: verticalScale(4),
    },
    shadowOpacity: 0.08,
    shadowRadius: verticalScale(12),
    elevation: 4,
  },
  tabButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: verticalScale(10),
    paddingHorizontal: horizontalScale(14),
    borderRadius: verticalScale(26),
  },
  activeTabButton: {
    backgroundColor: Colors.navActiveBg,
  },
  inactiveTabButton: {
    backgroundColor: Colors.transparent,
  },
  tabLabel: {
    fontSize: moderateScale(12),
    marginLeft: horizontalScale(6),
  },
  activeTabLabel: {
    color: Colors.brandOrange,
    fontWeight: '700',
  },
  inactiveTabLabel: {
    color: Colors.navInactive,
    fontWeight: '500',
  },
  floatingAddButton: {
    width: verticalScale(54),
    height: verticalScale(54),
    borderRadius: verticalScale(27),
    backgroundColor: Colors.brandOrange,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: Colors.black,
    shadowOffset: {
      width: 0,
      height: verticalScale(3),
    },
    shadowOpacity: 0.15,
    shadowRadius: verticalScale(6),
    elevation: 4,
  },
});

