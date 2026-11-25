import { StyleSheet } from 'react-native';
import { Colors } from '../../theme/Colors';
import { horizontalScale, moderateScale, verticalScale } from '../../theme/Metrics';

export const AVATAR_SIZE = verticalScale(64);
export const STAT_ICON_SIZE = moderateScale(18);

export const styles = StyleSheet.create({
  content: {
    paddingHorizontal: horizontalScale(20),
    paddingBottom: verticalScale(32),
  },
  profileCard: {
    borderRadius: verticalScale(20),
    padding: verticalScale(16),
    overflow: 'hidden',
  },
  identityRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: AVATAR_SIZE,
    height: AVATAR_SIZE,
    borderRadius: AVATAR_SIZE / 2,
    backgroundColor: 'rgba(255, 255, 255, 0.12)',
    borderWidth: 1.5,
    borderColor: 'rgba(248, 210, 153, 0.45)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarInitial: {
    fontSize: moderateScale(26),
    fontWeight: '800',
    color: Colors.brandCream,
  },
  identityText: {
    flex: 1,
    marginHorizontal: horizontalScale(14),
    alignItems: 'flex-start',
  },
  nameText: {
    fontSize: moderateScale(20),
    fontWeight: '800',
    color: Colors.heroTextCream,
  },
  nameTextEmpty: {
    color: Colors.heroSubText,
    fontWeight: '600',
  },
  nameInput: {
    alignSelf: 'stretch',
    fontSize: moderateScale(18),
    fontWeight: '700',
    color: Colors.heroTextCream,
    borderBottomWidth: 1.5,
    borderBottomColor: Colors.brandCream,
    paddingVertical: verticalScale(2),
  },
  levelBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.14)',
    borderRadius: verticalScale(10),
    paddingVertical: verticalScale(3),
    paddingHorizontal: horizontalScale(8),
    marginTop: verticalScale(6),
  },
  levelBadgeText: {
    fontSize: moderateScale(12),
    fontWeight: '700',
    color: Colors.brandCream,
    marginLeft: horizontalScale(4),
  },
  editButton: {
    width: verticalScale(36),
    height: verticalScale(36),
    borderRadius: verticalScale(18),
    backgroundColor: 'rgba(255, 255, 255, 0.14)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  progressBlock: {
    marginTop: verticalScale(16),
  },
  progressTrack: {
    height: verticalScale(8),
    borderRadius: verticalScale(4),
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: verticalScale(4),
    backgroundColor: Colors.brandOrange,
  },
  progressHint: {
    fontSize: moderateScale(12),
    fontWeight: '500',
    color: Colors.heroSubText,
    marginTop: verticalScale(6),
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginTop: verticalScale(12),
  },
  statCard: {
    width: '48.5%',
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.card,
    borderRadius: verticalScale(16),
    borderWidth: 1,
    borderColor: Colors.creamBorder,
    paddingVertical: verticalScale(10),
    paddingHorizontal: horizontalScale(12),
    marginBottom: verticalScale(10),
  },
  statIconBox: {
    width: verticalScale(36),
    height: verticalScale(36),
    borderRadius: verticalScale(12),
    backgroundColor: Colors.brandOrangeLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: horizontalScale(10),
  },
  statTextCol: {
    flex: 1,
  },
  statValue: {
    fontSize: moderateScale(20),
    fontWeight: '800',
    color: Colors.textMain,
  },
  statLabel: {
    fontSize: moderateScale(11),
    fontWeight: '600',
    color: Colors.textMuted,
  },
  activityCard: {
    borderRadius: verticalScale(20),
    padding: verticalScale(16),
    overflow: 'hidden',
    marginTop: verticalScale(4),
  },
  activityTitle: {
    fontSize: moderateScale(16),
    fontWeight: '800',
    color: Colors.heroTextCream,
  },
  activitySubtitle: {
    fontSize: moderateScale(12),
    fontWeight: '500',
    color: Colors.heroSubText,
    marginTop: verticalScale(2),
    marginBottom: verticalScale(14),
  },
  emptyRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: verticalScale(14),
    padding: verticalScale(12),
    marginTop: verticalScale(14),
  },
  emptyMascot: {
    width: verticalScale(44),
    height: verticalScale(44),
    marginRight: horizontalScale(12),
  },
  emptyTextCol: {
    flex: 1,
  },
  emptyTitle: {
    fontSize: moderateScale(13),
    fontWeight: '700',
    color: Colors.heroTextCream,
  },
  emptySub: {
    fontSize: moderateScale(12),
    fontWeight: '500',
    color: Colors.heroSubText,
    marginTop: verticalScale(1),
  },
});
