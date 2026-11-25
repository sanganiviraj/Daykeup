import React, { FC, memo, useCallback, useEffect, useMemo, useState } from 'react';
import { AppState, ScrollView, TouchableOpacity, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import {
  AppIcon,
  AppText,
  CustomButton,
  SafeAreaContainer,
} from '../../components';
import { AppIconName } from '../../components/app-icon/AppIcon';
import { Routes, permissionsString } from '../../constants';
import { Colors } from '../../theme/Colors';
import { AlarmPermissionKey, AlarmPermissionStatus, AlarmService } from '../../services';
import { RootStackParamList } from '../../types';
import { styles } from './PermissionsScreenStyles';

type ManualKey = 'lockScreen' | 'autostart';

interface PermissionRowProps {
  icon: AppIconName;
  title: string;
  description: string;
  done: boolean;
  actionLabel: string;
  doneLabel: string;
  onPress: () => void;
}

const PermissionRow: FC<PermissionRowProps> = memo(
  ({ icon, title, description, done, actionLabel, doneLabel, onPress }) => (
    <View style={[styles.row, done && styles.rowDone]}>
      <View style={[styles.rowIcon, done && styles.rowIconDone]}>
        <AppIcon
          name={done ? 'check' : icon}
          size="md"
          color={done ? Colors.white : Colors.brandOrange}
        />
      </View>
      <View style={styles.rowText}>
        <AppText style={styles.rowTitle}>{title}</AppText>
        <AppText style={styles.rowDesc}>{description}</AppText>
      </View>
      {done ? (
        <AppText style={styles.doneText}>{doneLabel}</AppText>
      ) : (
        <TouchableOpacity
          style={styles.actionBtn}
          onPress={onPress}
          activeOpacity={0.8}
          accessibilityRole="button"
          accessibilityLabel={`${actionLabel} ${title}`}>
          <AppText style={styles.actionBtnText}>{actionLabel}</AppText>
        </TouchableOpacity>
      )}
    </View>
  ),
);
PermissionRow.displayName = 'PermissionRow';

const REQUIRED_ROWS: ReadonlyArray<{
  key: AlarmPermissionKey;
  icon: AppIconName;
  title: string;
  description: string;
}> = [
  {
    key: 'notifications',
    icon: 'bell',
    title: permissionsString.notificationsTitle,
    description: permissionsString.notificationsDesc,
  },
  {
    key: 'exactAlarm',
    icon: 'alarmClock',
    title: permissionsString.exactAlarmTitle,
    description: permissionsString.exactAlarmDesc,
  },
  {
    key: 'overlay',
    icon: 'square',
    title: permissionsString.overlayTitle,
    description: permissionsString.overlayDesc,
  },
  {
    key: 'fullScreen',
    icon: 'bellRing',
    title: permissionsString.fullScreenTitle,
    description: permissionsString.fullScreenDesc,
  },
  {
    key: 'battery',
    icon: 'zap',
    title: permissionsString.batteryTitle,
    description: permissionsString.batteryDesc,
  },
];

const PermissionsScreen: FC = () => {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const [status, setStatus] = useState<AlarmPermissionStatus | null>(null);
  const [isXiaomi, setIsXiaomi] = useState<boolean>(false);
  const [opened, setOpened] = useState<Record<ManualKey, boolean>>({
    lockScreen: false,
    autostart: false,
  });

  const refresh = useCallback(async () => {
    const [nextStatus, brandInfo] = await Promise.all([
      AlarmService.getPermissionStatus(),
      AlarmService.getDeviceBrand(),
    ]);
    setStatus(nextStatus);
    setIsXiaomi(Boolean(brandInfo?.isXiaomi));
  }, []);

  // Permissions are granted on system screens, so re-check whenever the user comes back.
  useEffect(() => {
    refresh();
    const sub = AppState.addEventListener('change', state => {
      if (state === 'active') {
        refresh();
      }
    });
    return () => sub.remove();
  }, [refresh]);

  const handleRequest = useCallback(
    async (key: AlarmPermissionKey) => {
      await AlarmService.requestPermission(key);
      refresh();
    },
    [refresh],
  );

  const handleOpenLockScreen = useCallback(async () => {
    setOpened(prev => ({ ...prev, lockScreen: true }));
    await AlarmService.openLockScreenPermissionSettings();
  }, []);

  const handleOpenAutostart = useCallback(async () => {
    setOpened(prev => ({ ...prev, autostart: true }));
    await AlarmService.openAutoStartSettings();
  }, []);

  const allGranted = useMemo(
    () => !!status && Object.values(status).every(Boolean),
    [status],
  );
  const manualDone = !isXiaomi || (opened.lockScreen && opened.autostart);
  const canContinue = allGranted && manualDone;

  const handleContinue = useCallback(async () => {
    await AlarmService.markPromptedLockScreen();
    navigation.reset({ index: 0, routes: [{ name: Routes.home }] });
  }, [navigation]);

  return (
    <SafeAreaContainer backgroundColor={Colors.white} edges={['top', 'left', 'right', 'bottom']}>
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}>
        <View style={styles.iconBadge}>
          <AppIcon name="shieldCheck" size="lg" color={Colors.brandOrange} />
        </View>
        <View style={styles.badge}>
          <AppText style={styles.badgeText}>{permissionsString.badge}</AppText>
        </View>
        <AppText style={styles.title}>{permissionsString.title}</AppText>
        <AppText style={styles.subtitle}>
          {isXiaomi ? permissionsString.subtitleXiaomi : permissionsString.subtitle}
        </AppText>

        {REQUIRED_ROWS.map(row => (
          <PermissionRow
            key={row.key}
            icon={row.icon}
            title={row.title}
            description={row.description}
            done={!!status?.[row.key]}
            actionLabel={permissionsString.allowBtn}
            doneLabel={permissionsString.statusAllowed}
            onPress={() => handleRequest(row.key)}
          />
        ))}

        {isXiaomi ? (
          <>
            <AppText style={styles.sectionTitle}>
              {permissionsString.xiaomiSection.toUpperCase()}
            </AppText>
            <AppText style={styles.sectionHint}>{permissionsString.xiaomiHint}</AppText>
            <PermissionRow
              icon="hand"
              title={permissionsString.lockScreenTitle}
              description={permissionsString.lockScreenDesc}
              done={opened.lockScreen}
              actionLabel={permissionsString.openBtn}
              doneLabel={permissionsString.statusOpened}
              onPress={handleOpenLockScreen}
            />
            <PermissionRow
              icon="play"
              title={permissionsString.autostartTitle}
              description={permissionsString.autostartDesc}
              done={opened.autostart}
              actionLabel={permissionsString.openBtn}
              doneLabel={permissionsString.statusOpened}
              onPress={handleOpenAutostart}
            />
          </>
        ) : null}
      </ScrollView>

      <View style={styles.footer}>
        {!canContinue ? (
          <AppText style={styles.footerHint}>{permissionsString.remainingHint}</AppText>
        ) : null}
        <CustomButton
          title={permissionsString.continueBtn}
          onPress={handleContinue}
          disabled={!canContinue}
          style={styles.continueBtn}
        />
      </View>
    </SafeAreaContainer>
  );
};

export default memo(PermissionsScreen);
