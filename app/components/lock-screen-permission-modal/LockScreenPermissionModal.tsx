import React, { FC, memo } from 'react';
import {
  Modal,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import AppText from '../app-text/AppText';
import AppIcon from '../app-icon/AppIcon';
import { Colors } from '../../theme/Colors';
import { lockScreenPermissionString } from '../../constants';
import { styles } from './LockScreenPermissionModalStyle';
import { AlarmService } from '../../services/AlarmService';

export interface LockScreenPermissionModalProps {
  visible: boolean;
  isXiaomi?: boolean;
  onOpenSettings: () => void;
  onOpenAutoStart?: () => void;
  onDismiss: () => void;
  onSecondaryAction?: () => void;
  primaryButtonText?: string;
  secondaryButtonText?: string;
}

const LockScreenPermissionModal: FC<LockScreenPermissionModalProps> = memo(
  ({
    visible,
    isXiaomi = false,
    onOpenSettings,
    onOpenAutoStart,
    onDismiss,
    onSecondaryAction,
    primaryButtonText = lockScreenPermissionString.openSettingsBtn,
    secondaryButtonText = lockScreenPermissionString.laterBtn,
  }) => {
    const handleSecondary = onSecondaryAction || onDismiss;
    const handleAutoStart = onOpenAutoStart || (() => AlarmService.openAutoStartSettings());
    return (
      <Modal
        visible={visible}
        transparent={true}
        animationType="fade"
        onRequestClose={onDismiss}>
        <TouchableWithoutFeedback onPress={onDismiss}>
          <View style={styles.overlay}>
            <TouchableWithoutFeedback>
              <View style={styles.modalCard}>
                {/* Header row with badge and close button */}
                <View style={styles.topRow}>
                  <View style={styles.badge}>
                    <AppText style={styles.badgeText}>
                      {lockScreenPermissionString.badgeRequired}
                    </AppText>
                  </View>
                  <TouchableOpacity
                    style={styles.closeBtn}
                    onPress={onDismiss}
                    activeOpacity={0.7}
                    accessibilityLabel={lockScreenPermissionString.close}
                    accessibilityRole="button">
                    <AppIcon name="x" size="md" color={Colors.onSurfaceVariant} />
                  </TouchableOpacity>
                </View>

                {/* Title & Subtitle */}
                <AppText style={styles.title}>
                  {lockScreenPermissionString.title}
                </AppText>
                <AppText style={styles.subtitle}>
                  {isXiaomi
                    ? lockScreenPermissionString.subtitleXiaomi
                    : lockScreenPermissionString.subtitleGeneral}
                </AppText>

                {/* Step-by-Step Guidance */}
                <View style={styles.stepsContainer}>
                  {/* Step 1 */}
                  <View style={styles.stepRow}>
                    <View style={styles.stepNumberBadge}>
                      <AppText style={styles.stepNumberText}>1</AppText>
                    </View>
                    <View style={styles.stepContent}>
                      <AppText style={styles.stepTitle}>
                        {isXiaomi
                          ? lockScreenPermissionString.step1XiaomiTitle
                          : lockScreenPermissionString.step1GeneralTitle}
                      </AppText>
                      <AppText style={styles.stepDesc}>
                        {isXiaomi
                          ? lockScreenPermissionString.step1XiaomiDesc
                          : lockScreenPermissionString.step1GeneralDesc}
                      </AppText>
                    </View>
                  </View>

                  {/* Step 2 */}
                  <View style={[styles.stepRow, styles.stepRowSpacing]}>
                    <View style={[styles.stepNumberBadge, styles.stepNumberBadgeAlt]}>
                      <AppText style={styles.stepNumberText}>2</AppText>
                    </View>
                    <View style={styles.stepContent}>
                      <AppText style={styles.stepTitle}>
                        {isXiaomi
                          ? lockScreenPermissionString.step2XiaomiTitle
                          : lockScreenPermissionString.step2GeneralTitle}
                      </AppText>
                      <AppText style={styles.stepDesc}>
                        {isXiaomi
                          ? lockScreenPermissionString.step2XiaomiDesc
                          : lockScreenPermissionString.step2GeneralDesc}
                      </AppText>
                    </View>
                  </View>

                  {/* Step 3 (Xiaomi Autostart) */}
                  {isXiaomi && (
                    <View style={[styles.stepRow, styles.stepRowSpacing]}>
                      <View style={styles.stepNumberBadge}>
                        <AppText style={styles.stepNumberText}>3</AppText>
                      </View>
                      <View style={styles.stepContent}>
                        <AppText style={styles.stepTitle}>
                          {lockScreenPermissionString.step3XiaomiTitle}
                        </AppText>
                        <AppText style={styles.stepDesc}>
                          {lockScreenPermissionString.step3XiaomiDesc}
                        </AppText>
                        <TouchableOpacity
                          style={styles.autostartInlineBtn}
                          onPress={handleAutoStart}
                          activeOpacity={0.7}
                          accessibilityLabel={lockScreenPermissionString.openAutoStartBtn}
                          accessibilityRole="button">
                          <AppText style={styles.autostartInlineBtnText}>
                            {lockScreenPermissionString.openAutoStartBtn}
                          </AppText>
                        </TouchableOpacity>
                      </View>
                    </View>
                  )}
                </View>

                {/* Why is this required info */}
                <View style={styles.whyBox}>
                  <AppText style={styles.whyTitle}>
                    {lockScreenPermissionString.whyNeededTitle}
                  </AppText>
                  <AppText style={styles.whyDesc}>
                    {lockScreenPermissionString.whyNeededDesc}
                  </AppText>
                </View>

                {/* Primary Action Button */}
                <TouchableOpacity
                  style={styles.primaryBtn}
                  onPress={onOpenSettings}
                  activeOpacity={0.8}
                  accessible={true}
                  accessibilityLabel={primaryButtonText}
                  accessibilityRole="button">
                  <AppText style={styles.primaryBtnText}>
                    {primaryButtonText}
                  </AppText>
                </TouchableOpacity>

                {/* Secondary Action Button */}
                <TouchableOpacity
                  style={styles.secondaryBtn}
                  onPress={handleSecondary}
                  activeOpacity={0.7}
                  accessible={true}
                  accessibilityLabel={secondaryButtonText}
                  accessibilityRole="button">
                  <AppText style={styles.secondaryBtnText}>
                    {secondaryButtonText}
                  </AppText>
                </TouchableOpacity>
              </View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    );
  },
);

LockScreenPermissionModal.displayName = 'LockScreenPermissionModal';

export default LockScreenPermissionModal;
