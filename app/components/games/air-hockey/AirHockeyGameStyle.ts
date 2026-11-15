import { StyleSheet } from 'react-native';
import { Colors } from '../../../theme/Colors';
import { horizontalScale, moderateScale, verticalScale } from '../../../theme/Metrics';

export const MODAL_ICON_SIZE = moderateScale(48);

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#080b12',
  },
  webview: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  modalOverlay: {
    ...StyleSheet.absoluteFill,
    backgroundColor: 'rgba(8, 11, 18, 0.9)',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: horizontalScale(24),
    zIndex: 999,
  },
  modalCard: {
    width: '100%',
    backgroundColor: Colors.darkSurfaceContainerHigh,
    borderRadius: verticalScale(24),
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.12)',
    paddingVertical: verticalScale(28),
    paddingHorizontal: horizontalScale(20),
    alignItems: 'center',
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: verticalScale(10) },
    shadowOpacity: 0.6,
    shadowRadius: verticalScale(20),
    elevation: 12,
  },
  modalIcon: {
    marginBottom: verticalScale(12),
  },
  modalTitle: {
    fontSize: moderateScale(22),
    fontWeight: '700',
    color: Colors.white,
    textAlign: 'center',
  },
  modalSubtitle: {
    fontSize: moderateScale(14),
    fontWeight: '500',
    color: Colors.textMuted,
    textAlign: 'center',
    marginTop: verticalScale(6),
    marginBottom: verticalScale(20),
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    backgroundColor: Colors.darkSurfaceContainer,
    borderRadius: verticalScale(14),
    paddingVertical: verticalScale(12),
    marginBottom: verticalScale(20),
  },
  statItem: {
    alignItems: 'center',
  },
  statLabel: {
    fontSize: moderateScale(11),
    fontWeight: '700',
    color: Colors.textMuted,
    letterSpacing: horizontalScale(0.5),
    textTransform: 'uppercase',
  },
  statValue: {
    fontSize: moderateScale(22),
    fontWeight: '900',
    marginTop: verticalScale(2),
  },
  btnPrimary: {
    width: '100%',
    backgroundColor: Colors.brandOrange,
    borderRadius: verticalScale(14),
    paddingVertical: verticalScale(14),
    alignItems: 'center',
    marginBottom: verticalScale(10),
  },
  btnPrimaryText: {
    fontSize: moderateScale(15),
    fontWeight: '800',
    color: Colors.white,
    letterSpacing: horizontalScale(0.5),
  },
  btnSecondary: {
    width: '100%',
    backgroundColor: Colors.darkSurfaceContainer,
    borderRadius: verticalScale(14),
    paddingVertical: verticalScale(14),
    alignItems: 'center',
  },
  btnSecondaryText: {
    fontSize: moderateScale(14),
    fontWeight: '700',
    color: Colors.textMuted,
  },
});
