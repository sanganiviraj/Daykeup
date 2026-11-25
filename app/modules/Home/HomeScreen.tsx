import React, { FC, memo, useCallback, useEffect, useMemo, useState } from 'react';
import {
  AppState,
  ScrollView,
  TouchableOpacity,
  View,
} from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import LinearGradient from 'react-native-linear-gradient';
import {
  AlarmCard,
  AppIcon,
  AppText,
  BottomNavigation,
  CustomHeader,
  LockScreenPermissionModal,
  SafeAreaContainer,
} from '../../components';
import {
  alarmListScreenString,
  challengeIcons,
  challengeNames,
  commonString,
  homeScreenString,
  profileString,
  Routes,
} from '../../constants';
import { useAppDispatch, useAppSelector } from '../../hooks';
import { toggleAlarm } from '../../redux';
import { AlarmService } from '../../services';
import { RootStackParamList } from '../../types';
import { Colors } from '../../theme/Colors';
import { computeStreak, formatRepeatDays, getCurrentWeek } from '../../utils';
import { BottomTabType } from '../../components/bottom-navigation/BottomNavigation';
import { EMPTY_ICON_SIZE, styles } from './HomeScreenStyles';

type HomeScreenNavProp = NativeStackNavigationProp<RootStackParamList>;
type HomeScreenRouteProp = RouteProp<RootStackParamList, 'HomeScreen'>;

const HomeScreen: FC = () => {
  const navigation = useNavigation<HomeScreenNavProp>();
  const route = useRoute<HomeScreenRouteProp>();
  const dispatch = useAppDispatch();

  const [activeTab, setActiveTab] = useState<BottomTabType>(
    route.params?.initialTab || 'main',
  );

  useEffect(() => {
    if (route.params?.initialTab) {
      setActiveTab(route.params.initialTab);
    }
  }, [route.params?.initialTab]);

  const alarms = useAppSelector(state => state.alarm.alarms);
  const userName = useAppSelector(state => state.gamification.userStats.name);
  const wakeHistory = useAppSelector(state => state.gamification.userStats.wakeHistory);
  const streak = useMemo(() => computeStreak(wakeHistory), [wakeHistory]);
  const week = useMemo(() => getCurrentWeek(), []);
  const activeCount = alarms.filter(a => a.enabled).length;

  const primaryAlarm = alarms[0];
  const displayTime = primaryAlarm
    ? `${primaryAlarm.hour}:${primaryAlarm.minute}`
    : homeScreenString.noAlarmSetTime;

  const displaySubtitle = primaryAlarm
    ? formatRepeatDays(primaryAlarm.repeatDays)
    : homeScreenString.noAlarmScheduled;

  const displayMission = primaryAlarm?.challengeType
    ? challengeNames[primaryAlarm.challengeType]
    : homeScreenString.noAlarmMission;

  const displaySound = primaryAlarm
    ? (primaryAlarm.soundTitle || homeScreenString.defaultSound)
    : homeScreenString.noAlarmSound;

  const [needsOverlayPermission, setNeedsOverlayPermission] = useState<boolean>(false);
  const [isPermissionModalVisible, setIsPermissionModalVisible] = useState<boolean>(false);
  const [isXiaomi, setIsXiaomi] = useState<boolean>(false);

  const checkPermissions = useCallback(async (isInitialCheck: boolean = false) => {
    const [canOverlay, canFullScreen, brandInfo] = await Promise.all([
      AlarmService.canDrawOverlays(),
      AlarmService.canUseFullScreenIntent(),
      AlarmService.getDeviceBrand(),
    ]);
    const needsPerm = !canOverlay || !canFullScreen;
    setNeedsOverlayPermission(needsPerm);
    setIsXiaomi(Boolean(brandInfo?.isXiaomi));

    if (isInitialCheck && needsPerm) {
      const alreadyPrompted = await AlarmService.hasPromptedLockScreen();
      if (!alreadyPrompted) {
        setIsPermissionModalVisible(true);
      }
    }
  }, []);

  useEffect(() => {
    checkPermissions(true);
    const sub = AppState.addEventListener('change', state => {
      if (state === 'active') {
        checkPermissions(false);
      }
    });
    return () => sub.remove();
  }, [checkPermissions]);

  const handleOpenPermissionSettings = async () => {
    setIsPermissionModalVisible(false);
    await AlarmService.markPromptedLockScreen();
    await AlarmService.openLockScreenPermissionSettings();
  };

  const handleDismissPermissionModal = async () => {
    setIsPermissionModalVisible(false);
    await AlarmService.markPromptedLockScreen();
  };

  const handleEnablePermissions = () => {
    setIsPermissionModalVisible(true);
  };

  const handleEditAlarm = (alarmId?: string) => {
    navigation.navigate(Routes.createAlarm, {
      alarmId: alarmId || primaryAlarm?.id,
    });
  };

  const handleCreateAlarm = () => {
    navigation.navigate(Routes.createAlarm);
  };

  const handleTriggerAlarm = () => {
    navigation.navigate(Routes.alarmRinging, {
      alarmId: primaryAlarm?.id,
    });
  };

  const handleToggleAlarm = (alarmId: string) => {
    const target = alarms.find(a => a.id === alarmId);
    if (target) {
      if (target.enabled) {
        AlarmService.cancel(alarmId);
      } else {
        AlarmService.schedule({ ...target, enabled: true });
      }
    }
    dispatch(toggleAlarm(alarmId));
    const updatedAlarms = alarms.map(a =>
      a.id === alarmId
        ? { ...a, enabled: !a.enabled, updatedAt: new Date().toISOString() }
        : a,
    );
    AlarmService.saveAllAlarms(updatedAlarms);
  };

  return (
    <SafeAreaContainer
      edges={['top', 'left', 'right']}
      backgroundColor={Colors.creamBackground}>
      {/* Alarms Header (Shown when on Alarms tab) */}
      {activeTab === 'alarms' && (
        <CustomHeader
          title={commonString.appName}
          showBack={true}
          showAvatar={false}
          onBackPress={() => setActiveTab('main')}
        />
      )}

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}>
        {activeTab === 'main' ? (
          // ================= MAIN / HOME TAB =================
          <>
            {/* Permission banner for full-screen alarm overlay */}
            {needsOverlayPermission && (
              <View style={styles.permissionBannerCard}>
                <View style={styles.permissionBannerTopRow}>
                  <AppIcon
                    name="bell"
                    size="sm"
                    color={Colors.brandOrange}
                    style={styles.permissionBannerIcon}
                  />
                  <AppText style={styles.permissionBannerTitle}>
                    {homeScreenString.overlayBannerTitle}
                  </AppText>
                </View>
                <AppText style={styles.permissionBannerDesc}>
                  {homeScreenString.overlayBannerDesc}
                </AppText>
                <TouchableOpacity
                  style={styles.permissionBannerActionBtn}
                  onPress={handleEnablePermissions}
                  activeOpacity={0.8}
                  accessible={true}
                  accessibilityLabel={homeScreenString.overlayBannerAction}
                  accessibilityRole="button">
                  <AppText style={styles.permissionBannerActionText}>
                    {homeScreenString.overlayBannerAction}
                  </AppText>
                </TouchableOpacity>
              </View>
            )}

            {/* Streak Header */}
            <View style={styles.streakHeaderRow}>
              <View>
                <AppText style={styles.streakLabelText}>
                  {homeScreenString.streakLabel}
                </AppText>
                <View style={styles.streakValueRow}>
                  <AppText style={styles.streakDaysTitle}>{streak}</AppText>
                  <AppText style={styles.streakDaysUnit}>
                    {streak === 1
                      ? homeScreenString.dayUnit
                      : homeScreenString.daysUnit}
                  </AppText>
                </View>
              </View>

              <TouchableOpacity
                style={styles.profileButton}
                onPress={() => navigation.navigate(Routes.profile)}
                activeOpacity={0.8}
                accessible={true}
                accessibilityLabel={profileString.openProfileAria}
                accessibilityRole="button">
                {userName ? (
                  <AppText style={styles.profileInitial}>
                    {userName.trim().charAt(0).toUpperCase()}
                  </AppText>
                ) : (
                  <AppIcon name="user" size="md" color={Colors.brandOrange} />
                )}
              </TouchableOpacity>
            </View>

            {/* Weekly Calendar Strip (current week; past days inside the streak get a flame) */}
            <View style={styles.weeklyCalendarStrip}>
              {week.map((day, index) => {
                const isStreakDay = Boolean(wakeHistory[day.dateKey]);
                return (
                  <View key={day.key} style={styles.calendarDayCol}>
                    <AppText
                      style={[
                        styles.calendarDayLabel,
                        day.isToday && styles.calendarDayLabelActive,
                      ]}>
                      {day.label}
                    </AppText>
                    <View
                      style={[
                        styles.calendarNode,
                        isStreakDay && styles.calendarNodeStreak,
                        day.isToday && styles.calendarNodeToday,
                      ]}>
                      {isStreakDay ? (
                        <AppIcon
                          name="flame"
                          size="sm"
                          color={Colors.brandOrange}
                        />
                      ) : (
                        <AppText
                          style={[
                            styles.calendarNodeText,
                            day.isToday && styles.calendarNodeTextToday,
                            !day.isPast &&
                              !day.isToday &&
                              styles.calendarNodeTextMuted,
                          ]}>
                          {day.date}
                        </AppText>
                      )}
                    </View>
                  </View>
                );
              })}
            </View>

            {/* Hero Next Alarm Card */}
            <TouchableOpacity
              style={styles.heroCardWrapper}
              activeOpacity={0.94}
              onPress={primaryAlarm ? () => handleEditAlarm() : handleCreateAlarm}
              accessible={true}
              accessibilityLabel={homeScreenString.nextAlarmLabel}
              accessibilityRole="button">
              <LinearGradient
                colors={[
                  Colors.heroGradientStart,
                  Colors.heroGradientMid,
                  Colors.heroGradientEnd,
                ]}
                start={{ x: 0.5, y: 0 }}
                end={{ x: 0.5, y: 1 }}
                style={styles.heroGradientContainer}>
                <View style={styles.heroTopRow}>
                  <AppText style={styles.heroTrackingLabel}>
                    {primaryAlarm
                      ? primaryAlarm.label ||
                        primaryAlarm.title ||
                        homeScreenString.nextAlarmLabel
                      : homeScreenString.noUpcomingAlarmTitle}
                  </AppText>

                  {primaryAlarm ? (
                    <TouchableOpacity
                      style={styles.heroEditButton}
                      onPress={() => handleEditAlarm()}
                      activeOpacity={0.7}
                      accessible={true}
                      accessibilityLabel={homeScreenString.editAlarmAria}
                      accessibilityRole="button">
                      <AppIcon
                        name="pencil"
                        size="sm"
                        color={Colors.heroTextCream}
                      />
                    </TouchableOpacity>
                  ) : null}
                </View>

                <View style={styles.heroCenterBlock}>
                  <View style={styles.heroTimeRow}>
                    <AppText style={styles.heroBigTime}>{displayTime}</AppText>
                    {primaryAlarm?.period ? (
                      <AppText style={styles.heroPeriod}>
                        {primaryAlarm.period}
                      </AppText>
                    ) : null}
                  </View>
                  <AppText style={styles.heroDateSubtitle}>
                    {displaySubtitle}
                  </AppText>
                </View>

                {primaryAlarm ? (
                  <View style={styles.heroBottomColumns}>
                    <View style={styles.heroColumn}>
                      <AppText style={styles.heroColLabel}>
                        {homeScreenString.missionLabel}
                      </AppText>
                      <View style={styles.heroColValueRow}>
                        <AppIcon
                          name={challengeIcons[primaryAlarm.challengeType]}
                          size="sm"
                          color={Colors.heroSubText}
                          style={styles.heroColIcon}
                        />
                        <AppText style={styles.heroColValue} numberOfLines={1}>
                          {displayMission}
                        </AppText>
                      </View>
                    </View>

                    <View style={styles.heroColumnDivider} />

                    <View style={styles.heroColumn}>
                      <AppText style={styles.heroColLabel}>
                        {homeScreenString.soundLabel}
                      </AppText>
                      <View style={styles.heroColValueRow}>
                        <AppIcon
                          name="volume"
                          size="sm"
                          color={Colors.heroSubText}
                          style={styles.heroColIcon}
                        />
                        <AppText style={styles.heroColValue} numberOfLines={1}>
                          {displaySound}
                        </AppText>
                      </View>
                    </View>
                  </View>
                ) : null}
              </LinearGradient>
            </TouchableOpacity>

            {/* Practice Games Row */}
            <TouchableOpacity
              style={styles.gamesRow}
              onPress={() => navigation.navigate(Routes.gamesHub)}
              activeOpacity={0.7}
              accessible={true}
              accessibilityLabel={homeScreenString.gamesBannerTitle}
              accessibilityRole="button">
              <View style={styles.gamesIconBox}>
                <AppIcon name="gamepad" size="md" color={Colors.brandOrange} />
              </View>
              <View style={styles.gamesTextCol}>
                <AppText style={styles.gamesTitleText}>
                  {homeScreenString.gamesBannerTitle}
                </AppText>
                <AppText style={styles.gamesSubText}>
                  {homeScreenString.gamesBannerSub}
                </AppText>
              </View>
              <AppIcon name="chevronRight" size="md" color={Colors.textMuted} />
            </TouchableOpacity>

            {/* Dev-only shortcut for testing the ringing flow */}
            {__DEV__ ? (
              <TouchableOpacity
                style={styles.testRingBtn}
                onPress={handleTriggerAlarm}
                activeOpacity={0.7}
                accessible={true}
                accessibilityLabel={homeScreenString.testAlarmBtn}
                accessibilityRole="button">
                <AppIcon name="play" size="xs" color={Colors.textMuted} />
                <AppText style={styles.testRingBtnText}>
                  {homeScreenString.testAlarmBtn}
                </AppText>
              </TouchableOpacity>
            ) : null}
          </>
        ) : (
          // ================= ALARMS TAB =================
          <>
            <View style={styles.alarmsTitleHeaderRow}>
              <AppText style={styles.alarmsScreenTitle}>
                {alarmListScreenString.headerTitle}
              </AppText>
              {alarms.length > 0 ? (
                <AppText style={styles.activeAlarmsText}>
                  {activeCount > 0
                    ? `${activeCount} ${alarmListScreenString.activeAlarmsCount}`
                    : alarmListScreenString.noActiveAlarms}
                </AppText>
              ) : null}
            </View>

            {alarms.length === 0 ? (
              <View style={styles.emptyContainer}>
                <View style={styles.emptyIconContainer}>
                  <AppIcon
                    name="alarmClock"
                    size={EMPTY_ICON_SIZE}
                    strokeWidth={1.75}
                    color={Colors.brandOrange}
                  />
                </View>

                <AppText style={styles.emptyTitle}>
                  {alarmListScreenString.emptyAlarmsTitle}
                </AppText>

                <AppText style={styles.emptySub}>
                  {alarmListScreenString.emptyAlarmsSub}
                </AppText>
              </View>
            ) : (
              alarms.map(alarm => (
                <AlarmCard
                  key={alarm.id}
                  alarm={alarm}
                  onPress={() => handleEditAlarm(alarm.id)}
                  onToggle={() => handleToggleAlarm(alarm.id)}
                />
              ))
            )}
          </>
        )}
      </ScrollView>

      {/* Persistent Bottom Navigation Dock (Switches tab in-place with zero screen stack pushing) */}
      <BottomNavigation
        currentTab={activeTab}
        onTabPress={tab => setActiveTab(tab)}
        onAddPress={handleCreateAlarm}
      />

      {/* Lock Screen & Background Overlay Permission Prompt Modal */}
      <LockScreenPermissionModal
        visible={isPermissionModalVisible}
        isXiaomi={isXiaomi}
        onOpenSettings={handleOpenPermissionSettings}
        onDismiss={handleDismissPermissionModal}
      />
    </SafeAreaContainer>
  );
};

export default memo(HomeScreen);
