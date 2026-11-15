import { StyleSheet } from 'react-native';
import { Colors } from '../../../theme/Colors';
import { horizontalScale, moderateScale, verticalScale } from '../../../theme/Metrics';

export const styles = StyleSheet.create({
  contentContainer: {
    paddingHorizontal: horizontalScale(18),
    paddingTop: verticalScale(12),
    paddingBottom: verticalScale(40),
  },

  // Rest Calculated Pill
  restPillContainer: {
    alignSelf: 'center',
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: verticalScale(12),
  },
  restPillIcon: {
    marginRight: horizontalScale(6),
  },
  restPillText: {
    fontSize: moderateScale(13),
    fontWeight: '500',
    color: Colors.textSecondary,
  },

  // Card Base
  sectionCard: {
    backgroundColor: Colors.white,
    borderRadius: verticalScale(16),
    padding: verticalScale(16),
    borderWidth: 1,
    borderColor: Colors.grayBorder,
    marginBottom: verticalScale(12),
  },

  // Time Adjuster Card
  timeAdjusterRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: verticalScale(8),
    paddingHorizontal: horizontalScale(8),
  },
  timeStepBtn: {
    width: verticalScale(44),
    height: verticalScale(44),
    borderRadius: verticalScale(22),
    backgroundColor: Colors.surfaceContainerHigh,
    alignItems: 'center',
    justifyContent: 'center',
  },
  timeDisplayCenter: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  timeDigitsText: {
    fontSize: moderateScale(48),
    fontWeight: '700',
    color: Colors.textDark,
    letterSpacing: -horizontalScale(1),
  },
  periodText: {
    fontSize: moderateScale(18),
    fontWeight: '700',
    color: Colors.onSurfaceVariant,
    marginLeft: horizontalScale(6),
  },
  quickChipsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: verticalScale(12),
  },
  quickChipBtn: {
    backgroundColor: Colors.surfaceContainer,
    paddingHorizontal: horizontalScale(12),
    paddingVertical: verticalScale(6),
    borderRadius: verticalScale(14),
    marginHorizontal: horizontalScale(4),
  },
  quickChipText: {
    fontSize: moderateScale(12),
    fontWeight: '600',
    color: Colors.onSurfaceVariant,
  },

  // Alarm Label Field
  fieldLabel: {
    fontSize: moderateScale(12),
    fontWeight: '600',
    color: Colors.onSurfaceVariant,
    marginBottom: verticalScale(6),
  },
  inputBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surfaceContainer,
    borderRadius: verticalScale(14),
    paddingHorizontal: horizontalScale(12),
    paddingVertical: verticalScale(10),
    borderWidth: 1,
    borderColor: Colors.transparent,
    marginBottom: verticalScale(16),
  },
  inputIcon: {
    marginRight: horizontalScale(8),
  },
  textInputField: {
    flex: 1,
    fontSize: moderateScale(14),
    fontWeight: '600',
    color: Colors.textDark,
    padding: 0,
  },

  // Repeat Schedule
  repeatHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: verticalScale(10),
  },
  repeatScheduleTitle: {
    fontSize: moderateScale(12),
    fontWeight: '600',
    color: Colors.onSurfaceVariant,
  },
  repeatScheduleValue: {
    fontSize: moderateScale(11),
    fontWeight: '700',
    color: Colors.brandOrange,
  },
  daysGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  dayChip: {
    width: verticalScale(38),
    height: verticalScale(38),
    borderRadius: verticalScale(19),
    backgroundColor: Colors.surfaceContainer,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dayChipSelected: {
    backgroundColor: Colors.brandOrange,
  },
  dayChipText: {
    fontSize: moderateScale(13),
    fontWeight: '700',
    color: Colors.onSurfaceVariant,
  },
  dayChipTextSelected: {
    color: Colors.white,
  },

  // Motivation Card
  cardHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: verticalScale(12),
  },
  cardHeaderTitle: {
    fontSize: moderateScale(15),
    fontWeight: '700',
    color: Colors.textDark,
  },
  actionTextBtn: {
    fontSize: moderateScale(13),
    fontWeight: '600',
    color: Colors.brandOrange,
  },
  visionImageBox: {
    height: verticalScale(140),
    borderRadius: verticalScale(16),
    backgroundColor: Colors.gradientDark,
    overflow: 'hidden',
    position: 'relative',
    justifyContent: 'flex-end',
    padding: verticalScale(12),
  },
  visionImageOverlay: {
    ...StyleSheet.absoluteFill,
    backgroundColor: 'rgba(0, 0, 0, 0.45)',
  },
  visionOverlayBottom: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
  },
  wakeIntentionTag: {
    fontSize: moderateScale(11),
    fontWeight: '500',
    color: 'rgba(255, 255, 255, 0.7)',
  },
  quoteText: {
    fontSize: moderateScale(13),
    fontWeight: '600',
    color: Colors.white,
    marginTop: verticalScale(2),
  },

  // Wake-Up Challenge Section
  cardHeaderSubtitle: {
    fontSize: moderateScale(12),
    color: Colors.textMuted,
    marginTop: verticalScale(2),
  },
  challengesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: verticalScale(12),
  },
  challengeCard: {
    width: '48.5%',
    backgroundColor: Colors.white,
    borderRadius: verticalScale(12),
    borderWidth: 1,
    borderColor: Colors.grayBorder,
    paddingHorizontal: horizontalScale(10),
    paddingVertical: verticalScale(10),
    marginBottom: verticalScale(10),
  },
  challengeCardSelected: {
    backgroundColor: Colors.brandOrangeLight,
    borderColor: Colors.brandOrange,
  },
  challengeCardTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: verticalScale(6),
  },
  challengeIconBox: {
    width: verticalScale(34),
    height: verticalScale(34),
    borderRadius: verticalScale(10),
    backgroundColor: Colors.brandOrangeLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  challengeIconBoxSelected: {
    backgroundColor: Colors.brandOrange,
  },
  challengeCheckCircle: {
    width: horizontalScale(18),
    height: verticalScale(18),
    borderRadius: verticalScale(9),
    borderWidth: 1.5,
    borderColor: Colors.grayBorder,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.white,
  },
  challengeCheckCircleSelected: {
    backgroundColor: Colors.brandOrange,
    borderColor: Colors.brandOrange,
  },
  challengeMetaBox: {
    justifyContent: 'center',
  },
  challengeTitle: {
    fontSize: moderateScale(14),
    fontWeight: '600',
    color: Colors.textDark,
    marginBottom: verticalScale(2),
  },
  challengeTitleSelected: {
    color: Colors.textDark,
  },
  challengeSubtitle: {
    fontSize: moderateScale(11),
    fontWeight: '500',
    color: Colors.onSurfaceVariant,
  },
  challengeSubtitleSelected: {
    color: Colors.textSecondary,
  },

  // Difficulty Selector
  difficultyRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: verticalScale(2),
    marginBottom: verticalScale(12),
  },
  difficultyLabel: {
    fontSize: moderateScale(12),
    fontWeight: '600',
    color: Colors.onSurfaceVariant,
  },
  difficultySegment: {
    flexDirection: 'row',
    backgroundColor: Colors.surfaceContainer,
    borderRadius: verticalScale(16),
    padding: verticalScale(2),
  },
  diffBtn: {
    paddingHorizontal: horizontalScale(14),
    paddingVertical: verticalScale(5),
    borderRadius: verticalScale(14),
  },
  diffBtnSelected: {
    backgroundColor: Colors.brandOrange,
  },
  diffBtnText: {
    fontSize: moderateScale(11),
    fontWeight: '600',
    color: Colors.onSurfaceVariant,
  },
  diffBtnTextSelected: {
    color: Colors.white,
    fontWeight: '700',
  },

  // Puzzle Preview Bar
  puzzlePreviewBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: Colors.surfaceContainer,
    borderRadius: verticalScale(12),
    paddingHorizontal: horizontalScale(12),
    paddingVertical: verticalScale(10),
  },
  puzzlePreviewLeft: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: horizontalScale(8),
  },
  puzzleTimerIcon: {
    marginRight: horizontalScale(8),
  },
  puzzleEquationText: {
    flex: 1,
    fontSize: moderateScale(13),
    color: Colors.textSecondary,
    lineHeight: moderateScale(18),
  },
  timeLimitText: {
    fontSize: moderateScale(12),
    fontWeight: '600',
    color: Colors.textMuted,
  },

  // Sound & Physical Affordances
  settingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: verticalScale(6),
  },
  settingRowLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  settingIconCircle: {
    width: verticalScale(40),
    height: verticalScale(40),
    borderRadius: verticalScale(12),
    backgroundColor: Colors.brandOrangeLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: horizontalScale(12),
  },
  settingIconCircleGray: {
    backgroundColor: Colors.surfaceContainer,
  },
  settingTitle: {
    fontSize: moderateScale(15),
    fontWeight: '600',
    color: Colors.textDark,
  },
  settingSub: {
    fontSize: moderateScale(12),
    color: Colors.textMuted,
    marginTop: verticalScale(1),
  },
  previewSoundBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: horizontalScale(12),
    paddingVertical: verticalScale(6),
    borderRadius: verticalScale(16),
    borderWidth: 1,
    borderColor: Colors.brandOrange,
  },
  previewSoundText: {
    fontSize: moderateScale(13),
    fontWeight: '600',
    color: Colors.brandOrange,
    marginRight: horizontalScale(6),
  },

  // Toggle Switch
  toggleTrack: {
    width: horizontalScale(48),
    height: verticalScale(28),
    borderRadius: verticalScale(14),
    backgroundColor: Colors.brandOrange,
    padding: verticalScale(2),
    justifyContent: 'center',
  },
  toggleTrackOff: {
    backgroundColor: Colors.grayLight,
  },
  toggleThumb: {
    width: verticalScale(24),
    height: verticalScale(24),
    borderRadius: verticalScale(12),
    backgroundColor: Colors.white,
    alignSelf: 'flex-end',
  },
  toggleThumbOff: {
    alignSelf: 'flex-start',
  },

  // Save Alarm Action Button
  saveAlarmBtn: {
    height: verticalScale(52),
    borderRadius: verticalScale(14),
    backgroundColor: Colors.brandOrange,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: verticalScale(8),
    marginBottom: verticalScale(8),
  },
  saveAlarmBtnText: {
    color: Colors.white,
    fontSize: moderateScale(16),
    fontWeight: '600',
  },

  // Delete Action Button
  deleteAlarmBtn: {
    flexDirection: 'row',
    height: verticalScale(48),
    alignItems: 'center',
    justifyContent: 'center',
  },
  deleteAlarmBtnText: {
    color: Colors.error,
    fontSize: moderateScale(15),
    fontWeight: '600',
    marginLeft: horizontalScale(6),
  },

  previewSoundBtnActive: {
    backgroundColor: Colors.brandOrange,
  },
  previewSoundTextActive: {
    color: Colors.white,
  },
  soundInfoTouchable: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: horizontalScale(8),
  },
  soundTextCol: {
    flex: 1,
  },

  // Sound Picker Modal
  soundModalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.45)',
    justifyContent: 'flex-end',
  },
  soundModalContainer: {
    backgroundColor: Colors.white,
    borderTopLeftRadius: verticalScale(24),
    borderTopRightRadius: verticalScale(24),
    paddingHorizontal: horizontalScale(20),
    paddingTop: verticalScale(20),
    paddingBottom: verticalScale(34),
  },
  soundModalIndicator: {
    width: horizontalScale(36),
    height: verticalScale(4),
    backgroundColor: Colors.grayLight,
    borderRadius: verticalScale(2),
    alignSelf: 'center',
    marginBottom: verticalScale(16),
  },
  soundModalHeader: {
    marginBottom: verticalScale(16),
  },
  soundModalTitle: {
    fontSize: moderateScale(18),
    fontWeight: '700',
    color: Colors.textDark,
  },
  soundModalSub: {
    fontSize: moderateScale(12),
    color: Colors.onSurfaceVariant,
    marginTop: verticalScale(2),
  },
  soundOptionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: Colors.surfaceContainer,
    borderRadius: verticalScale(16),
    paddingHorizontal: horizontalScale(14),
    paddingVertical: verticalScale(14),
    marginBottom: verticalScale(10),
  },
  soundOptionLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  soundOptionIconCircle: {
    width: verticalScale(40),
    height: verticalScale(40),
    borderRadius: verticalScale(12),
    backgroundColor: Colors.brandOrangeLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: horizontalScale(12),
  },
  soundOptionIconCirclePurple: {
    backgroundColor: Colors.brandPurpleLight,
  },
  soundOptionTexts: {
    flex: 1,
  },
  soundOptionTitle: {
    fontSize: moderateScale(15),
    fontWeight: '600',
    color: Colors.textDark,
  },
  soundOptionDesc: {
    fontSize: moderateScale(11),
    color: Colors.onSurfaceVariant,
    marginTop: verticalScale(2),
  },
  soundModalCancelBtn: {
    marginTop: verticalScale(8),
    height: verticalScale(48),
    borderRadius: verticalScale(14),
    backgroundColor: Colors.graySubtle,
    alignItems: 'center',
    justifyContent: 'center',
  },
  soundModalCancelText: {
    fontSize: moderateScale(15),
    fontWeight: '600',
    color: Colors.textDark,
  },
});
