import { StyleSheet } from 'react-native';
import { Colors } from '../../theme/Colors';
import { horizontalScale, moderateScale, verticalScale } from '../../theme/Metrics';

export const EMPTY_ICON_SIZE = moderateScale(40);

export const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
    backgroundColor: Colors.creamBackground,
  },
  contentContainer: {
    paddingHorizontal: horizontalScale(20),
    paddingTop: verticalScale(12),
    paddingBottom: verticalScale(120),
  },

  // Permission Banner
  permissionBannerCard: {
    backgroundColor: Colors.white,
    borderRadius: verticalScale(16),
    padding: verticalScale(16),
    marginBottom: verticalScale(20),
    borderWidth: 1,
    borderColor: Colors.creamBorder,
  },
  permissionBannerTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: verticalScale(6),
  },
  permissionBannerIcon: {
    marginRight: horizontalScale(8),
  },
  permissionBannerTitle: {
    fontSize: moderateScale(14),
    fontWeight: '700',
    color: Colors.textDark,
  },
  permissionBannerDesc: {
    fontSize: moderateScale(13),
    color: Colors.textSecondary,
    lineHeight: moderateScale(19),
    marginBottom: verticalScale(12),
  },
  permissionBannerActionBtn: {
    alignSelf: 'flex-start',
    backgroundColor: Colors.brandOrange,
    paddingHorizontal: horizontalScale(16),
    paddingVertical: verticalScale(8),
    borderRadius: verticalScale(10),
  },
  permissionBannerActionText: {
    color: Colors.white,
    fontSize: moderateScale(13),
    fontWeight: '600',
  },

  // Streak Header
  streakHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: verticalScale(16),
  },
  profileButton: {
    width: verticalScale(44),
    height: verticalScale(44),
    borderRadius: verticalScale(22),
    backgroundColor: Colors.brandOrangeLight,
    borderWidth: 1.5,
    borderColor: Colors.creamBorder,
    alignItems: 'center',
    justifyContent: 'center',
  },
  profileInitial: {
    fontSize: moderateScale(18),
    fontWeight: '800',
    color: Colors.brandOrange,
  },
  streakLabelText: {
    fontSize: moderateScale(13),
    fontWeight: '600',
    color: Colors.textMuted,
  },
  streakValueRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  streakDaysTitle: {
    fontSize: moderateScale(32),
    fontWeight: '700',
    color: Colors.textDark,
    letterSpacing: -horizontalScale(0.5),
  },
  streakDaysUnit: {
    fontSize: moderateScale(17),
    fontWeight: '600',
    color: Colors.textDark,
    marginLeft: horizontalScale(6),
  },

  // Weekly Calendar Strip
  weeklyCalendarStrip: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: verticalScale(20),
  },
  calendarDayCol: {
    alignItems: 'center',
    flex: 1,
  },
  calendarDayLabel: {
    fontSize: moderateScale(11),
    fontWeight: '500',
    color: Colors.textMuted,
    marginBottom: verticalScale(6),
  },
  calendarDayLabelActive: {
    color: Colors.textDark,
    fontWeight: '700',
  },
  calendarNode: {
    width: verticalScale(36),
    height: verticalScale(36),
    borderRadius: verticalScale(18),
    alignItems: 'center',
    justifyContent: 'center',
  },
  calendarNodeStreak: {
    backgroundColor: Colors.brandOrangeLight,
  },
  calendarNodeToday: {
    backgroundColor: Colors.textDark,
  },
  calendarNodeText: {
    fontSize: moderateScale(13),
    fontWeight: '600',
    color: Colors.textDark,
  },
  calendarNodeTextToday: {
    color: Colors.white,
    fontWeight: '700',
  },
  calendarNodeTextMuted: {
    color: Colors.textMuted,
    fontWeight: '500',
  },

  // Hero Next Alarm Card
  heroCardWrapper: {
    borderRadius: verticalScale(24),
    overflow: 'hidden',
    marginBottom: verticalScale(16),
  },
  heroGradientContainer: {
    paddingHorizontal: horizontalScale(20),
    paddingTop: verticalScale(18),
    paddingBottom: verticalScale(20),
  },
  heroTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    minHeight: verticalScale(32),
  },
  heroTrackingLabel: {
    flex: 1,
    fontSize: moderateScale(14),
    fontWeight: '600',
    color: Colors.heroSubText,
  },
  heroEditButton: {
    width: verticalScale(32),
    height: verticalScale(32),
    borderRadius: verticalScale(16),
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  heroCenterBlock: {
    paddingTop: verticalScale(28),
    paddingBottom: verticalScale(24),
  },
  heroTimeRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  heroBigTime: {
    fontSize: moderateScale(64),
    fontWeight: '700',
    color: Colors.heroTextCream,
    lineHeight: moderateScale(70),
    letterSpacing: -horizontalScale(1.5),
  },
  heroPeriod: {
    fontSize: moderateScale(20),
    fontWeight: '600',
    color: Colors.heroTextCream,
    marginLeft: horizontalScale(8),
  },
  heroDateSubtitle: {
    fontSize: moderateScale(14),
    fontWeight: '500',
    color: 'rgba(255, 255, 255, 0.6)',
    marginTop: verticalScale(4),
  },
  heroBottomColumns: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: verticalScale(14),
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: 'rgba(255, 255, 255, 0.2)',
  },
  heroColumn: {
    flex: 1,
  },
  heroColumnDivider: {
    width: StyleSheet.hairlineWidth,
    height: verticalScale(32),
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    marginHorizontal: horizontalScale(16),
  },
  heroColLabel: {
    fontSize: moderateScale(12),
    fontWeight: '500',
    color: 'rgba(255, 255, 255, 0.5)',
    marginBottom: verticalScale(4),
  },
  heroColValueRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  heroColIcon: {
    marginRight: horizontalScale(6),
  },
  heroColValue: {
    flexShrink: 1,
    fontSize: moderateScale(14),
    fontWeight: '600',
    color: Colors.white,
  },

  // Practice Games Row
  gamesRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.white,
    borderRadius: verticalScale(16),
    borderWidth: 1,
    borderColor: Colors.grayBorder,
    paddingVertical: verticalScale(14),
    paddingHorizontal: horizontalScale(14),
  },
  gamesIconBox: {
    width: verticalScale(40),
    height: verticalScale(40),
    borderRadius: verticalScale(12),
    backgroundColor: Colors.brandOrangeLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: horizontalScale(12),
  },
  gamesTextCol: {
    flex: 1,
    marginRight: horizontalScale(8),
  },
  gamesTitleText: {
    fontSize: moderateScale(15),
    fontWeight: '600',
    color: Colors.textDark,
  },
  gamesSubText: {
    fontSize: moderateScale(12),
    color: Colors.textMuted,
    marginTop: verticalScale(2),
  },

  // Dev-only test button
  testRingBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'center',
    paddingVertical: verticalScale(10),
    paddingHorizontal: horizontalScale(12),
    marginTop: verticalScale(12),
  },
  testRingBtnText: {
    fontSize: moderateScale(13),
    fontWeight: '500',
    color: Colors.textMuted,
    marginLeft: horizontalScale(6),
  },

  // --- ALARMS TAB STYLES ---
  alarmsTitleHeaderRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    justifyContent: 'space-between',
    marginBottom: verticalScale(16),
  },
  alarmsScreenTitle: {
    fontSize: moderateScale(28),
    fontWeight: '700',
    color: Colors.textDark,
    letterSpacing: -horizontalScale(0.5),
  },
  activeAlarmsText: {
    fontSize: moderateScale(13),
    fontWeight: '500',
    color: Colors.textMuted,
  },

  // Empty Alarms State
  emptyContainer: {
    alignItems: 'center',
    paddingHorizontal: horizontalScale(24),
    marginTop: verticalScale(56),
  },
  emptyIconContainer: {
    width: verticalScale(80),
    height: verticalScale(80),
    borderRadius: verticalScale(40),
    backgroundColor: Colors.brandOrangeLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: verticalScale(20),
  },
  emptyTitle: {
    fontSize: moderateScale(18),
    fontWeight: '700',
    color: Colors.textDark,
    textAlign: 'center',
    marginBottom: verticalScale(6),
  },
  emptySub: {
    fontSize: moderateScale(14),
    color: Colors.textMuted,
    textAlign: 'center',
    lineHeight: moderateScale(20),
  },
});
